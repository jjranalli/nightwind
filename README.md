# Nightwind

A plugin that gives you an out-of-the-box, customisable, overrideable dark mode for tailwindcss.

## Installation

Install the plugin from npm:

```sh
npm install nightwind
```

Then add the plugin to your `tailwind.config.js` file, as well as the variants you want for nightwind to automatically generate classes:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  variants: {
    // Add the variants for which you want Nightwind to automatically generate the classes
    'nightwind': ['hover', 'focus'],
  },
  plugins: [
    require('nightwind'),
    // ...
  ],
}
```

## Before starting

Nightwind styles are applied to an element whenever 

- The element has an inline class that sets the color of a text, background, border or placeholder;
- A parent element has a 'night-mode' class.

One way to have your whole website immediately support night mode, is to apply the 'night-mode' class to the `<html>` element.

Inside the package, you can find a 'helper.js' script that can get you started right away.

### Using the helper

#### React

You can use the following functions to listen for the { prefers-color-scheme: dark }:

```js
import { useEffect } from 'react'
import nightwind from 'nightwind/helper'

export default function Layout({children}) {

  useEffect(() => {
      nightwind.watchNightMode()
      nightwind.addNightModeSelector()
  });

  return (
    // ...
  )
}
```

And the toggleNightMode() function to toggle dark mode with a button:

```js
import nightwind from 'nightwind/helper'

export default function Navbar() {  
  return (
    // ...
    <Button onClick={ () => nightwind.toggleNightMode() } />
    // ...
  )
```

## Usage

Nightwind leverages the default weights in the Tailwind palette to switch between them when going into night mode.

The nightwind classes are generated automatically whenever you use a tailwind class the sets the color to a text, background, border, or placeholder.

Some examples:

- 'bg-white', in night mode becomes 'bg-black'
- 'bg-red-100', in night mode becomes 'bg-red-900'
- 'hover:text-indigo-200', in night mode becomes 'hover:text-indigo-800'
- 'sm:border-blue-300', in night mode becomes 'sm:border-blue-700'
- 'xl:hover:bg-purple-400', in night mode becomes 'xl:hover:bg-purple-600

Note: As a reminder, the sum between classes is always 1000. That also means that the '-500' colors will not change when switching into night-mode.

Nightwind is responsive by default, so it supports tailwind breakpoints. But in order to allow pseudo-variants make sure to configure up the 'nightwind' variant, as described in the installation section.

### Configuration

If you add custom breakpoints or colors tailwind.config.js, Nightwind will automatically generate the night mode classes for you.

For example:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        // Nightwind only supports the default Tailwind syntax, based on min-width.
        'custom': '800px'
      },
      colors: {
        // Add your custom colors here.
        // If you use the numeric notation in your custom colors, 
        // Nightwind will automatically switch in night mode.
        // 100 will switch with 900, 200 - 800, 300 - 700, etc. 
        // The sum is always 1000.
        primary: {
          100: '#111',
          300: '#333',
          500: '#555',
          700: '#777',
          900: '#999',
        },
        secondary: {
          100: '#111',
          300: '#333',
          500: '#555',
          700: '#777',
          900: '#999',
        }
      },
    },
  },

  variants: {
    'nightwind': ['hover', 'focus'],
  },

  plugins: [
    require('nightwind')
  ]
}
```

### Overrides

You can also use overrides to manually decide the color you want to apply to 

Overrides are based on the tailwindcss-dark-mode syntax, which is the following:

- `dark`
- `dark-hover`
- `dark-focus`
- `dark-active`
- `dark-disabled`
- `dark-group-hover`
- `dark-focus-within`
- `dark-even`
- `dark-odd`
- `dark-placeholder`

To enable them, add the ones you want to use in your config.tailwind.js file (make sure to use after ):

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // ...
      },
    },
  },
  variants: {
    'nightwind': ['hover', 'focus'],

    // Enable overrides
    textColor: ({ after }) => after(['dark', 'dark-hover', 'dark-focus', 'dark-placeholder']),
    backgroundColor: ({ after }) => after(['dark', 'dark-hover', 'dark-focus']),
    borderColor: ({ after }) => after(['dark', 'dark-hover', 'dark-focus']),
  },

  plugins: [
    require('nightwind')
  ]
}
```

You can also enable overrides for other properties, unrelated to colors:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // ...
      },
    },
  },
  variants: {
    'nightwind': ['hover', 'focus'],

    // Enable overrides
    textColor: ({ after }) => after(['dark', 'dark-hover', 'dark-focus', 'dark-placeholder']),
    backgroundColor: ({ after }) => after(['dark', 'dark-hover', 'dark-focus']),
    borderColor: ({ after }) => after(['dark', 'dark-hover', 'dark-focus']),

    fontSize: ({ after }) => after(['dark', 'dark-hover', 'dark-focus', 'dark-placeholder']),
    fontWeight: ({ after }) => after(['dark', 'dark-hover', 'dark-focus', 'dark-placeholder']) 
  },

  plugins: [
    require('nightwind')
  ]
}
```

Notably, overrides are compatible with media queries. So you can write classes such as 'md:dark:text-gray-300'

### Pay attention to

- @apply is currently not supported, so make sure to only use inline styles.