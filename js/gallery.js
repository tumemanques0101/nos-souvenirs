(function () {
  "use strict";

  let galleryController = null;

  window.NosSouvenirsGallery = {
    init({ elements, memories, onFinish, onBack }) {
      let currentIndex = 0;
      let dateTypingRun = 0;
      let lastActiveElement = null;

      elements.previousMemoryButton.addEventListener("click", () => showMemory(currentIndex - 1, "previous"));
      elements.nextMemoryButton.addEventListener("click", () => showMemory(currentIndex + 1, "next"));
      elements.backToLetterButton.addEventListener("click", onBack);
      elements.finishGalleryButton.addEventListener("click", onFinish);
      elements.lightboxClose.addEventListener("click", closeLightbox);
      elements.imageLightbox.addEventListener("click", (event) => {
        if (event.target === elements.imageLightbox) closeLightbox();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeLightbox();
      });

      galleryController = {
        reset() {
          showMemory(0, "next");
        }
      };

      function showMemory(nextIndex, direction) {
        if (nextIndex < 0 || nextIndex >= memories.length) return;
        currentIndex = nextIndex;
        const memory = memories[currentIndex];
        const page = createMemoryPage(memory, direction, openLightbox);

        elements.memoryGrid.replaceChildren(page);
        elements.memoryProgress.textContent = `${currentIndex + 1} / ${memories.length}`;
        elements.previousMemoryButton.disabled = currentIndex === 0;
        elements.nextMemoryButton.disabled = currentIndex === memories.length - 1;
        elements.finishGalleryButton.hidden = currentIndex !== memories.length - 1;
        typeDate(page.querySelector(".memory-date"), memory.date);
      }

      function typeDate(element, text) {
        dateTypingRun += 1;
        const runId = dateTypingRun;
        const characters = Array.from(text);
        let index = 0;
        element.textContent = "";

        function writeNextCharacter() {
          if (runId !== dateTypingRun || index >= characters.length) return;
          element.textContent += characters[index];
          index += 1;
          window.setTimeout(writeNextCharacter, 34);
        }

        window.setTimeout(writeNextCharacter, 240);
      }

      function openLightbox(memory, trigger) {
        lastActiveElement = trigger;
        elements.lightboxImage.src = memory.source;
        elements.lightboxImage.alt = memory.title;
        elements.lightboxTitle.textContent = memory.title;
        elements.imageLightbox.classList.add("is-visible");
        elements.imageLightbox.setAttribute("aria-hidden", "false");
        elements.lightboxClose.focus();
      }

      function closeLightbox() {
        if (!elements.imageLightbox.classList.contains("is-visible")) return;
        elements.imageLightbox.classList.remove("is-visible");
        elements.imageLightbox.setAttribute("aria-hidden", "true");
        if (lastActiveElement) lastActiveElement.focus();
      }
    },

    show({ elements }) {
      elements.letterScreen.hidden = true;
      elements.galleryScreen.hidden = false;
      galleryController.reset();
      window.requestAnimationFrame(() => {
        elements.galleryScreen.classList.add("is-visible");
      });
    }
  };

  function createMemoryPage(memory, direction, onOpenImage) {
    const page = document.createElement("article");
    const scrapbook = document.createElement("div");
    const copy = document.createElement("div");
    const date = document.createElement("p");
    const title = document.createElement("h3");
    const caption = document.createElement("p");

    page.className = "memory-page";
    page.dataset.direction = direction;
    page.style.setProperty("--memory-tilt", memory.tilt);
    scrapbook.className = `memory-scrapbook decoration-${memory.decoration}`;
    copy.className = "memory-copy";
    date.className = "memory-date";
    date.setAttribute("aria-label", memory.date);
    title.textContent = memory.title;
    caption.textContent = memory.caption;

    scrapbook.append(createDecoration("memory-tape memory-tape-one"), createDecoration("memory-tape memory-tape-two"));
    scrapbook.append(createMemoryMedia(memory, onOpenImage));
    scrapbook.append(createDecoration("memory-doodle"));
    copy.append(date, title, caption);
    page.append(scrapbook, copy);
    return page;
  }

  function createMemoryMedia(memory, onOpenImage) {
    const frame = document.createElement("div");
    frame.className = "memory-media";

    if (memory.type === "video") {
      const video = document.createElement("video");
      video.src = memory.source;
      video.controls = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", memory.title);
      frame.appendChild(video);
      return frame;
    }

    const trigger = document.createElement("button");
    const image = document.createElement("img");
    trigger.type = "button";
    trigger.className = "memory-media-trigger";
    trigger.setAttribute("aria-label", `Enlarge memory: ${memory.title}`);
    image.src = memory.source;
    image.alt = memory.alt;
    trigger.appendChild(image);
    trigger.addEventListener("click", () => onOpenImage(memory, trigger));
    frame.appendChild(trigger);
    return frame;
  }

  function createDecoration(className) {
    const decoration = document.createElement("span");
    decoration.className = className;
    decoration.setAttribute("aria-hidden", "true");
    return decoration;
  }
})();
