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
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  addNightTransitions: () => {
    if (!document.documentElement.classList.contains('nightwind')) {
      document.documentElement.classList.add('nightwind');
    }
  },

  initNightwind: () => {
    module.exports.watchNightMode();
    module.exports.addNightModeSelector();
    module.exports.addNightTransitions();
  },

  toggleNightMode: () => {
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}