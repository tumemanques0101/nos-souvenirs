(function () {
  "use strict";

  /**
   * Edit these settings for the real recipient.
   * - password: text required to unlock the letter.
   * - unlockAt: set to a future date string to enable countdown lock.
   *   Leave it empty to allow password unlocking immediately.
   */
  const letterSettings = {
    password: "unelettre",
    unlockAt: "",
    paragraphs: [
      "Dear you,",
      "I wanted this to feel less like opening a page and more like opening something that had been waiting quietly.",
      "So here is a small letter, soft around the edges, carrying the words that are easier to read slowly than to say out loud.",
      "If this found you at the right time, I hope it stays with you for a little while."
    ]
  };

  const state = {
    countdownTimer: null,
    unlocked: false,
    music: null
  };

  const elements = {
    experience: document.querySelector(".experience"),
    lockScreen: document.querySelector("#lockScreen"),
    letterScreen: document.querySelector("#letterScreen"),
    unlockForm: document.querySelector("#unlockForm"),
    passwordInput: document.querySelector("#passwordInput"),
    passwordError: document.querySelector("#passwordError"),
    countdown: document.querySelector("#countdown"),
    days: document.querySelector("#days"),
    hours: document.querySelector("#hours"),
    minutes: document.querySelector("#minutes"),
    seconds: document.querySelector("#seconds"),
    letterContent: document.querySelector("#letterContent"),
    letterFooter: document.querySelector("#letterFooter"),
    musicButton: document.querySelector("#musicButton")
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setupCountdown();
    setupUnlockForm();
    setupMusicButton();
  }

  function setupCountdown() {
    const unlockDate = parseUnlockDate(letterSettings.unlockAt);
    if (!unlockDate) return;

    elements.countdown.hidden = false;
    updateCountdown(unlockDate);
    state.countdownTimer = window.setInterval(() => updateCountdown(unlockDate), 1000);
  }

  function setupUnlockForm() {
    elements.unlockForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!isTimeUnlocked()) {
        showPasswordError("This letter is not ready to open yet.");
        return;
      }

      if (elements.passwordInput.value.trim() !== letterSettings.password) {
        showPasswordError("That password does not open this letter.");
        return;
      }

      clearPasswordError();
      await unlockLetter();
    });
  }

  function setupMusicButton() {
    elements.musicButton.addEventListener("click", () => {
      if (!state.music) {
        state.music = createSoftMusic();
      }

      if (state.music.isPlaying) {
        state.music.stop();
        elements.musicButton.setAttribute("aria-pressed", "false");
        elements.musicButton.querySelector("span:last-child").textContent = "Play Music";
        return;
      }

      state.music.play();
      elements.musicButton.setAttribute("aria-pressed", "true");
      elements.musicButton.querySelector("span:last-child").textContent = "Pause Music";
    });
  }

  async function unlockLetter() {
    if (state.unlocked) return;
    state.unlocked = true;

    if (state.countdownTimer) {
      window.clearInterval(state.countdownTimer);
    }

    await window.UneLettreAnimation.openLetter(
      elements.experience,
      elements.lockScreen,
      elements.letterScreen
    );

    elements.letterContent.focus({ preventScroll: true });
    await window.UneLettreTypewriter.typeParagraphs(elements.letterContent, letterSettings.paragraphs, {
      characterDelay: 40,
      paragraphPause: 520
    });

    elements.letterFooter.hidden = false;
    elements.letterFooter.classList.add("is-visible");
  }

  function parseUnlockDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function isTimeUnlocked() {
    const unlockDate = parseUnlockDate(letterSettings.unlockAt);
    return !unlockDate || Date.now() >= unlockDate.getTime();
  }

  function updateCountdown(unlockDate) {
    const remaining = Math.max(0, unlockDate.getTime() - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elements.days.textContent = pad(days);
    elements.hours.textContent = pad(hours);
    elements.minutes.textContent = pad(minutes);
    elements.seconds.textContent = pad(seconds);

    if (remaining === 0 && state.countdownTimer) {
      window.clearInterval(state.countdownTimer);
      state.countdownTimer = null;
      unlockLetter();
    }
  }

  function showPasswordError(message) {
    elements.passwordError.textContent = message;
    elements.passwordInput.classList.add("is-error");
    elements.unlockForm.classList.remove("is-shaking");
    void elements.unlockForm.offsetWidth;
    elements.unlockForm.classList.add("is-shaking");
  }

  function clearPasswordError() {
    elements.passwordError.textContent = "";
    elements.passwordInput.classList.remove("is-error");
    elements.unlockForm.classList.remove("is-shaking");
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  /**
   * Creates quiet generated music so the project can ship without external
   * audio files. It starts only after the user presses the music button.
   */
  function createSoftMusic() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = AudioContext ? new AudioContext() : null;
    const nodes = [];

    return {
      isPlaying: false,
      play() {
        if (!context || this.isPlaying) return;
        this.isPlaying = true;
        const now = context.currentTime;
        const master = context.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.045, now + 1.2);
        master.connect(context.destination);

        [261.63, 329.63, 392.0].forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          gain.gain.value = 0.16 / (index + 1);
          oscillator.connect(gain);
          gain.connect(master);
          oscillator.start(now);
          nodes.push(oscillator, gain, master);
        });
      },
      stop() {
        if (!context || !this.isPlaying) return;
        this.isPlaying = false;
        nodes.forEach((node) => {
          if (typeof node.stop === "function") {
            try {
              node.stop(context.currentTime + 0.2);
            } catch (error) {
              // Oscillators can only stop once; repeated clicks should stay quiet.
            }
          }
          if (node.gain) {
            node.gain.setTargetAtTime(0.0001, context.currentTime, 0.08);
          }
        });
        nodes.length = 0;
      }
    };
  }
})();
