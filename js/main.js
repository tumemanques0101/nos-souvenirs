(function () {
  "use strict";

  // Reduce this number later to remove trailing placeholder memory pages.
  const MEMORY_PAGE_LIMIT = 30;

  const settings = {
    passcodes: ["perfect"],
    openAt: "",
    demoOpenMinutesFromNow: 12,
    enforceOpenTime: true,
    paragraphs: [
      "Dear you,",
      "I wanted this to feel less like opening a page and more like opening something that had been waiting quietly.",
      "So here is a small letter, soft around the edges, carrying the words that are easier to read slowly than to say out loud.",
      "If this found you at the right time, I hope it stays with you for a little while."
    ],
    memories: createMemoryPages(MEMORY_PAGE_LIMIT)
  };

  function createMemoryPages(limit) {
    const seeds = [
      {
        date: "17 March 2024, 4:32 PM",
        title: "Soft light",
        caption: "A small pause that made the whole afternoon feel warmer.",
        alt: "A gentle aqua memory with soft light",
        source: "assets/memory-1.svg",
        type: "image",
        tilt: "-2.2deg",
        decoration: "petals"
      },
      {
        date: "21 June 2024, 6:08 PM",
        title: "Quiet words",
        caption: "A few words kept close, long after the day had moved on.",
        alt: "A paper memory held in warm light",
        source: "assets/memory-2.svg",
        type: "image",
        tilt: "1.7deg",
        decoration: "star"
      },
      {
        date: "01 January 2025, 12:01 AM",
        title: "Kept near",
        caption: "A beginning worth returning to, one little detail at a time.",
        alt: "A warm memory from the beginning",
        source: "assets/memory-3.svg",
        type: "image",
        tilt: "-0.8deg",
        decoration: "ribbon"
      }
    ];

    return Array.from({ length: Math.max(1, limit) }, (_, index) => {
      const seed = seeds[index % seeds.length];
      if (index < seeds.length) return { ...seed };

      const pageNumber = String(index + 1).padStart(2, "0");
      return {
        ...seed,
        date: `Memory ${pageNumber} | Replace date and time`,
        title: `Memory ${pageNumber}`,
        caption: "Replace this placeholder with a photo, video, or the detail you want to keep.",
        tilt: ["-2.4deg", "1.5deg", "-0.7deg", "2deg"][index % 4]
      };
    });
  }

  const state = {
    phase: "gate",
    unlocked: false,
    closing: false,
    passwordController: null
  };

  const elements = {
    experience: document.querySelector(".experience"),
    lockScreen: document.querySelector("#lockScreen"),
    letterScreen: document.querySelector("#letterScreen"),
    galleryScreen: document.querySelector("#galleryScreen"),
    endingScreen: document.querySelector("#endingScreen"),
    closingScreen: document.querySelector("#closingScreen"),
    openRequest: document.querySelector("#openRequest"),
    unlockForm: document.querySelector("#unlockForm"),
    passwordInput: document.querySelector("#passwordInput"),
    passwordError: document.querySelector("#passwordError"),
    hintButton: document.querySelector("#hintButton"),
    hintPopover: document.querySelector("#hintPopover"),
    clockValue: document.querySelector("#clockValue"),
    clockDate: document.querySelector("#clockDate"),
    letterContent: document.querySelector("#letterContent"),
    letterFooter: document.querySelector("#letterFooter"),
    openMemoriesButton: document.querySelector("#openMemoriesButton"),
    backToLetterButton: document.querySelector("#backToLetterButton"),
    memoryGrid: document.querySelector("#memoryGrid"),
    previousMemoryButton: document.querySelector("#previousMemoryButton"),
    nextMemoryButton: document.querySelector("#nextMemoryButton"),
    memoryProgress: document.querySelector("#memoryProgress"),
    finishGalleryButton: document.querySelector("#finishGalleryButton"),
    imageLightbox: document.querySelector("#imageLightbox"),
    lightboxImage: document.querySelector("#lightboxImage"),
    lightboxTitle: document.querySelector("#lightboxTitle"),
    lightboxClose: document.querySelector("#lightboxClose"),
    closingEnvelope: document.querySelector("#closingEnvelope"),
    thanksMessage: document.querySelector("#thanksMessage")
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    window.NosSouvenirsIntro.init({ elements });

    state.passwordController = window.NosSouvenirsPassword.init({
      settings,
      elements,
      onUnlock: unlockLetter
    });

    window.NosSouvenirsGallery.init({
      elements,
      memories: settings.memories,
      onFinish: showEnding,
      onBack: returnToLetter
    });

    window.NosSouvenirsEnding.init({
      elements,
      onClose: closeLetter
    });

    elements.openMemoriesButton.addEventListener("click", showGallery);
  }

  async function unlockLetter() {
    if (state.unlocked) return;

    state.unlocked = true;
    setPhase("opening");
    state.passwordController.stop();

    await window.NosSouvenirsEnvelope.open(elements);

    setPhase("letter");
    elements.letterContent.focus({ preventScroll: true });
    await window.UneLettreTypewriter.typeParagraphs(elements.letterContent, settings.paragraphs, {
      characterDelay: 40,
      paragraphPause: 520
    });

    if (state.phase !== "letter") return;
    elements.letterFooter.hidden = false;
    elements.openMemoriesButton.disabled = false;
    elements.letterFooter.classList.add("is-visible");
  }

  function showGallery() {
    if (state.phase !== "letter" || elements.openMemoriesButton.disabled) return;
    setPhase("memories");
    elements.letterScreen.classList.remove("is-visible");
    window.NosSouvenirsGallery.show({ elements });
  }

  function showEnding() {
    if (state.phase !== "memories") return;
    setPhase("ending");
    elements.galleryScreen.classList.remove("is-visible");
    window.NosSouvenirsEnding.show({ elements });
  }

  function returnToLetter() {
    if (state.phase !== "memories") return;

    setPhase("letter");
    elements.galleryScreen.classList.remove("is-visible");
    elements.galleryScreen.hidden = true;
    elements.letterScreen.hidden = false;
    window.requestAnimationFrame(() => {
      elements.letterScreen.classList.add("is-visible");
      elements.openMemoriesButton.focus({ preventScroll: true });
    });
  }

  function closeLetter() {
    if (state.phase !== "ending" || state.closing) return;
    state.closing = true;
    setPhase("closing");
    elements.endingScreen.classList.remove("is-visible");
    window.NosSouvenirsEnding.showClosing({ elements });
  }

  function setPhase(phase) {
    state.phase = phase;
    elements.experience.dataset.scene = phase;
  }
})();
