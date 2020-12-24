module.exports = {
  init: () => {
    const codeToRunOnClient = `
      (function() {
        function getInitialColorMode() {
                const persistedColorPreference = window.localStorage.getItem('nightwind-mode');
                const hasPersistedPreference = typeof persistedColorPreference === 'string';
                if (hasPersistedPreference) {
                  return persistedColorPreference;
                }
                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                if (hasMediaQueryPreference) {
                  return mql.matches ? 'dark' : 'light';
                }
                return 'light';
        }
        getInitialColorMode() == 'light' ? document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
        document.documentElement.classList.add('nightwind');
      })()
    `;
    return codeToRunOnClient;
  },

  toggle: () => {
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('nightwind-mode', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        window.localStorage.setItem('nightwind-mode', 'light');
    }
  },

  // Old

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
      window.localStorage.setItem('nightwind-mode', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        window.localStorage.setItem('nightwind-mode', 'light');
    }
  },
}