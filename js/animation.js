(function () {
  "use strict";

  const OPEN_DURATION = 4650;
  const LEAVE_DURATION = 620;

  let audioContext = null;
  let masterGain = null;

  /**
   * Coordinates the envelope opening sequence. CSS owns the major motion while
   * this file adds tactile timing, falling seal fragments, and synced sounds.
   */
  window.UneLettreAnimation = {
    async openLetter(experience, lockScreen, letterScreen) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      experience.classList.add("is-unlocking");

      if (!reduceMotion) {
        playBowRelease();
        launchSealFragments(experience.querySelector("#waxSeal"));
        schedule(420, playClothSlide);
        schedule(1180, () => playPaperSlide(0.32));
        schedule(1540, () => experience.classList.add("has-open-flap"));
        schedule(1850, () => playPaperSlide(0.42));
        schedule(2830, () => playPaperSlide(0.28));
        schedule(3900, playTableTouch);
      }

      await wait(reduceMotion ? 260 : OPEN_DURATION);
      lockScreen.classList.add("is-leaving");

      await wait(reduceMotion ? 80 : LEAVE_DURATION);
      lockScreen.hidden = true;
      letterScreen.hidden = false;
      letterScreen.classList.add("is-visible");
    }
  };

  function schedule(delay, callback) {
    window.setTimeout(callback, delay);
  }

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function launchSealFragments(waxSeal) {
    if (!waxSeal || !waxSeal.animate) return;

    const fragmentLayer = waxSeal.parentElement;
    if (!fragmentLayer) return;

    const centerX = waxSeal.offsetLeft + waxSeal.offsetWidth / 2;
    const centerY = waxSeal.offsetTop + waxSeal.offsetHeight / 2;
    const fragmentCount = 16;
    const animations = [];

    for (let index = 0; index < fragmentCount; index += 1) {
      const fragment = document.createElement("span");
      fragment.className = "seal-fragment";
      fragment.style.setProperty("--fragment-size", `${6 + (index % 5) * 2}px`);
      fragment.style.left = `${centerX}px`;
      fragment.style.top = `${centerY}px`;
      fragmentLayer.appendChild(fragment);

      const angle = (-148 + index * 18 + randomBetween(-8, 8)) * (Math.PI / 180);
      const distance = randomBetween(34, 86);
      const x = Math.cos(angle) * distance;
      const y = randomBetween(62, 124) + Math.abs(Math.sin(angle)) * 18;
      const rotation = randomBetween(-180, 180);
      const duration = randomBetween(820, 1320);

      const animation = fragment.animate(
        [
          {
            opacity: 0,
            transform: "translate3d(-50%, -50%, 0) rotate(0deg) scale(0.65)"
          },
          {
            opacity: 1,
            offset: 0.12,
            transform: `translate3d(calc(-50% + ${x * 0.22}px), calc(-50% - 12px), 0) rotate(${rotation * 0.2}deg) scale(1)`
          },
          {
            opacity: 1,
            offset: 0.72,
            transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotation}deg) scale(0.98)`
          },
          {
            opacity: 0.86,
            offset: 0.86,
            transform: `translate3d(calc(-50% + ${x * 0.92}px), calc(-50% + ${y - 13}px), 0) rotate(${rotation + 24}deg) scale(0.92)`
          },
          {
            opacity: 0,
            transform: `translate3d(calc(-50% + ${x * 1.06}px), calc(-50% + ${y + 18}px), 0) rotate(${rotation + 54}deg) scale(0.72)`
          }
        ],
        {
          duration,
          delay: 90 + index * 16,
          easing: "cubic-bezier(0.19, 0.72, 0.2, 1)",
          fill: "forwards"
        }
      );

      animations.push(animation.finished.finally(() => fragment.remove()));
    }

    Promise.allSettled(animations).catch(() => {
      fragmentLayer.querySelectorAll(".seal-fragment").forEach((fragment) => fragment.remove());
    });
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    if (!audioContext) {
      audioContext = new AudioContext();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.22;
      masterGain.connect(audioContext.destination);
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  }

  function playBowRelease() {
    const context = getAudioContext();
    if (!context) return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(280, now);
    oscillator.frequency.exponentialRampToValueAtTime(156, now + 0.18);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + 0.32);

    playNoise({
      duration: 0.18,
      gain: 0.12,
      frequency: 1500,
      type: "highpass"
    });
  }

  function playClothSlide() {
    playNoise({
      duration: 0.46,
      gain: 0.055,
      frequency: 620,
      type: "lowpass"
    });
  }

  function playPaperSlide(strength) {
    playNoise({
      duration: 0.34 + strength * 0.3,
      gain: 0.045 + strength * 0.06,
      frequency: 1320,
      type: "bandpass"
    });
  }

  function playTableTouch() {
    const context = getAudioContext();
    if (!context) return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(118, now);
    oscillator.frequency.exponentialRampToValueAtTime(78, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + 0.36);
  }

  function playNoise(options) {
    const context = getAudioContext();
    if (!context) return;

    const now = context.currentTime;
    const frameCount = Math.max(1, Math.floor(context.sampleRate * options.duration));
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < frameCount; index += 1) {
      const fade = 1 - index / frameCount;
      channel[index] = (Math.random() * 2 - 1) * fade;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    filter.type = options.type;
    filter.frequency.setValueAtTime(options.frequency, now);
    gain.gain.setValueAtTime(Math.max(options.gain, 0.001), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + options.duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    source.start(now);
    source.stop(now + options.duration);
  }
})();
