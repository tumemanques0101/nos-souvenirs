(function () {
  "use strict";

  window.NosSouvenirsPassword = {
    init({ settings, elements, onUnlock, onReveal }) {
      let clockTimer = null;
      const openTargetTime = getOpenTarget(settings);

      startClock();
      elements.openRequest.addEventListener("click", revealPassword);
      elements.hintButton.addEventListener("click", toggleHint);
      elements.unlockForm.addEventListener("submit", handlePasswordSubmit);

      document.addEventListener("click", (event) => {
        if (!elements.hintPopover.classList.contains("is-visible")) return;
        if (!elements.hintButton.contains(event.target) && !elements.hintPopover.contains(event.target)) {
          elements.hintPopover.classList.remove("is-visible");
        }
      });

      return {
        stop() {
          if (clockTimer) {
            window.clearInterval(clockTimer);
            clockTimer = null;
          }
        }
      };

      function startClock() {
        updateClock();
        clockTimer = window.setInterval(updateClock, 1000);
      }

      function updateClock() {
        const remaining = Math.max(0, openTargetTime - Date.now());
        const totalSeconds = Math.floor(remaining / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const parts = days > 0 ? [days, hours, minutes, seconds] : [hours, minutes, seconds];

        elements.clockValue.textContent = parts.map(pad).join(":");
        elements.clockDate.textContent = settings.openAt
          ? new Date(openTargetTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
          : "Demo";
      }

      function revealPassword() {
        elements.openRequest.hidden = true;
        elements.unlockForm.hidden = false;
        elements.unlockForm.setAttribute("aria-hidden", "false");
        window.requestAnimationFrame(() => elements.unlockForm.classList.add("is-visible"));
        if (onReveal) onReveal();
        window.setTimeout(() => elements.passwordInput.focus(), 260);
      }

      function toggleHint() {
        elements.hintPopover.classList.toggle("is-visible");
      }

      function handlePasswordSubmit(event) {
        event.preventDefault();
        console.log({
    enforce: settings.enforceOpenTime,
    now: new Date(),
    target: new Date(openTargetTime),
    remaining: openTargetTime - Date.now()
});
        const value = normalizePasscode(elements.passwordInput.value);
        const allowed = settings.passcodes.map(normalizePasscode);

        if (settings.enforceOpenTime && Date.now() < openTargetTime) {
          showPasswordError("This letter is not ready to open yet.");
          return;
        }

        if (!allowed.includes(value)) {
          showPasswordError("That password does not open this letter.");
          elements.passwordInput.select();
          return;
        }

        clearPasswordError();
        elements.unlockForm.classList.add("is-unlocking");
        window.setTimeout(() => {
          elements.passwordInput.value = "";
          onUnlock();
        }, 620);
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
    }
  };

  function getOpenTarget(settings) {
    if (settings.openAt) {
      const configured = new Date(settings.openAt).getTime();
      if (!Number.isNaN(configured)) return configured;
    }

    return Date.now() + settings.demoOpenMinutesFromNow * 60 * 1000;
  }

  function normalizePasscode(value) {
    return value.trim().toLowerCase().replace(/\s+/g, "");
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }
})();
