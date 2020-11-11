# Nightwind

A plugin that gives you an out-of-the-box, customisable, overrideable dark mode for tailwindcss.

## Installation

```sh
npm install nightwind
```

In your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  experimental: {
    applyComplexClasses: true,
    darkModeVariant: true
  },
  dark: 'class',
  purge: [
    // ...
  ],

  theme: {
    extend: {
      colors: {
        // Add your custom colors here, with number notation
        'primary': {
          100: '#caf0f8',
          300: '#90e0ef',
          500: '#00b4d8',
          700: '#0077b6',
          900: '#03045e',
        }
      },
      transitionDuration: {
        // Set the Nightwind transition duration,
        'nightwind': '1000ms' // default '200ms'
      }
    },
  },

  variants: {
    // Set the variants for which you want Nightwind to generate dark classes
    'nightwind': ['hover', 'focus'],
  },

  plugins: [
    require('nightwind')
  ]
}
```