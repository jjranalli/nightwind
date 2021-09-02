export const init = (): string => {
	// No reason to do a const and return it instantly IMO
	return `(function() {
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
    })()`;
};

export const beforeTransition = () => {
	const doc = document.documentElement;
	const onTransitionDone = () => {
		doc.classList.remove('nightwind');
		doc.removeEventListener('transitionend', onTransitionDone);
	};
	doc.addEventListener('transitionend', onTransitionDone);
	if (!doc.classList.contains('nightwind')) {
		doc.classList.add('nightwind');
	}
};

export const toggle = () => {
	beforeTransition();
	if (!document.documentElement.classList.contains('dark')) {
		document.documentElement.classList.add('dark');
		window.localStorage.setItem('nightwind-mode', 'dark');
	} else {
		document.documentElement.classList.remove('dark');
		window.localStorage.setItem('nightwind-mode', 'light');
	}
};

export const enable = (dark: boolean) => {
	const mode = dark ? 'dark' : 'light';
	const opposite = dark ? 'light' : 'dark';

	beforeTransition();

	if (document.documentElement.classList.contains(opposite)) {
		document.documentElement.classList.remove(opposite);
	}
	document.documentElement.classList.add(mode);
	window.localStorage.setItem('nightwind-mode', mode);
};

// Old methods

export const checkNightMode = (): boolean => {
	return (
		window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	);
};

export const watchNightMode = () => {
	if (!window.matchMedia) return;
	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addListener(module.exports.addNightModeSelector());
};

export const addNightModeSelector = () => {
	if (checkNightMode()) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
};

export const addNightTransitions = () => {
	if (!document.documentElement.classList.contains('nightwind')) {
		document.documentElement.classList.add('nightwind');
	}
};

export const initNightwind = () => {
	watchNightMode();
	addNightModeSelector();
	addNightTransitions();
};

export const toggleNightMode = () => {
	if (!document.documentElement.classList.contains('dark')) {
		document.documentElement.classList.add('dark');
		window.localStorage.setItem('nightwind-mode', 'dark');
	} else {
		document.documentElement.classList.remove('dark');
		window.localStorage.setItem('nightwind-mode', 'light');
	}
};
