(function () {
  "use strict";

  window.NosSouvenirsIntro = {
    init({ elements }) {
      if (!elements.experience || !elements.lockScreen) return;
      elements.experience.dataset.scene = "gate";
      elements.lockScreen.classList.add("is-visible");
    }
  };
})();
