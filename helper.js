module.exports = {
  checkNightMode: () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  watchNightMode: () => {
    if (!window.matchMedia) return;
    window.matchMedia('(prefers-color-scheme: dark)').addListener(module.exports.addNightModeSelector());
  },

  addNightModeSelector: () => {
    if (module.exports.checkNightMode()) {
      document.documentElement.classList.add('night-mode');
    } else {
      document.documentElement.classList.remove('night-mode');
    }
  },

  toggleNightMode: () => {
    if (document.documentElement.classList != "night-mode") {
      document.documentElement.classList.add('night-mode');
    } else {
      document.documentElement.classList.remove('night-mode');
    }
  }
}