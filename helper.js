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
      })()
    `;
    return codeToRunOnClient;
  },
  
  beforeTransition: () => {
    const doc = document.documentElement;
    const onTransitionDone = () => {
      doc.classList.remove('nightwind');
      doc.removeEventListener('transitionend', onTransitionDone);
    }
    doc.addEventListener('transitionend', onTransitionDone);
    if (!doc.classList.contains('nightwind')) {
      doc.classList.add('nightwind');
    }
  },

  toggle: () => {
    module.exports.beforeTransition();
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('nightwind-mode', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        window.localStorage.setItem('nightwind-mode', 'light');
    }
  },
  
  enable: (dark) => {
    const mode = dark ? "dark" : "light";
    const opposite = dark ? "light" : "dark";

    module.exports.beforeTransition();

    if (document.documentElement.classList.contains(opposite)) {
      document.documentElement.classList.remove(opposite);
    }
    document.documentElement.classList.add(mode);
    window.localStorage.setItem('nightwind-mode', mode);
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
