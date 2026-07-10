(function () {
  "use strict";

  window.NosSouvenirsEnding = {
    init({ elements, onClose }) {
      elements.endingScreen.addEventListener("click", onClose);
    },

    show({ elements }) {
      elements.galleryScreen.hidden = true;
      elements.endingScreen.hidden = false;
      window.requestAnimationFrame(() => {
        elements.endingScreen.classList.add("is-visible");
      });
    },

    showClosing({ elements }) {
      elements.endingScreen.hidden = true;
      elements.closingScreen.hidden = false;
      elements.closingEnvelope.classList.remove(
        "is-folding",
        "is-tucked",
        "is-sealed",
        "is-wrapped",
        "is-tied"
      );
      elements.thanksMessage.classList.remove("is-visible");
      window.requestAnimationFrame(() => {
        elements.closingScreen.classList.add("is-visible");
      });

      window.setTimeout(() => elements.closingEnvelope.classList.add("is-folding"), 360);
      window.setTimeout(() => elements.closingEnvelope.classList.add("is-tucked"), 1900);
      window.setTimeout(() => elements.closingEnvelope.classList.add("is-sealed"), 3400);
      window.setTimeout(() => elements.closingEnvelope.classList.add("is-wrapped"), 4580);
      window.setTimeout(() => elements.closingEnvelope.classList.add("is-tied"), 5480);
      window.setTimeout(() => elements.thanksMessage.classList.add("is-visible"), 6500);
    }
  };
})();
