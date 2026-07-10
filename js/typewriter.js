(function () {
  "use strict";

  /**
   * Types paragraphs into a container with natural pauses between paragraphs.
   * The function is intentionally small and dependency-free for a calm reading
   * experience.
   */
  window.UneLettreTypewriter = {
    async typeParagraphs(container, paragraphs, options) {
      const settings = {
        characterDelay: 40,
        paragraphPause: 460,
        ...options
      };

      container.innerHTML = "";
      container.classList.add("typing-cursor");

      for (const paragraph of paragraphs) {
        const node = document.createElement("p");
        container.appendChild(node);

        for (const character of paragraph) {
          node.textContent += character;
          await wait(settings.characterDelay);
        }

        await wait(settings.paragraphPause);
      }

      container.classList.remove("typing-cursor");
    }
  };

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }
})();
