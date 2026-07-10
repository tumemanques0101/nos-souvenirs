(function () {
  "use strict";

  window.NosSouvenirsEnvelope = {
    open(elements) {
      return window.UneLettreAnimation.openLetter(
        elements.experience,
        elements.lockScreen,
        elements.letterScreen
      );
    }
  };
})();
