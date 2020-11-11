# Nightwind

A plugin that gives you an out-of-the-box, customisable, overrideable dark mode for tailwindcss.

change -> This approach is different than tailwind as it doesn't generate a screen but uses new variants. It is not tied to the prefers-colors-scheme property, thus allowing toggling between light and night mode. 

It is currently therefore not compatible with the experimental tailwind feature, but it has a very similar syntax and usage.

## Installation

```sh
npm install nightwind
```

In your `tailwind.config.js` file:
- Add the 'src/index.js' nightwind path to the purge list
- Specify the variants you want for nightwind to automatically generate classes
- Require 'nightwind' in the plugin list

```js
// tailwind.config.js
module.exports = {
  experimental: {
    applyComplexClasses: true,
    darkModeVariant: true
  },
  dark: 'class',
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

- The element has an inline class that sets the color of a text, background, border or placeholder; and
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
  }, []);

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
    <button onClick={ nightwind.toggleNightMode }></button>
    // ...
  )
```

#### React toggle

You can also import the Nightwind button component, and customising it by passing it one of the following props:

```js
import Nightwind from 'nightwind/components/toggle'

export default function Navbar() {  
  return (
    // ...
    <Nightwind 
      size="w-16 h-16 md:w-20 md:h-20" // default 'w-10 h-10'
      sunColor="text-red-300 group-hover:text-teal-300" // default 'text-orange-300 group-hover:text-indigo-300'
      sunColorNight="dark:text-purple-500 dark-group-hover:text-yellow-300" // default 'dark:text-indigo-400 dark-group-hover:text-orange-400'
      moonColor="text-gray-700" // default 'text-indigo-600'
      moonColorNight="dark:text-red-300" // default 'dark:text-yellow-300'
      transition="duration-150" // default 'duration-300'
    />
    // ...
  )
```

The Nightwind toggle uses the 'group-hover' and 'dark-group-hover' textColor variants, so make sure to enable them in tailwind.config.js.

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
  // ...
    textColor: ({ after }) => after(['group-hover', 'dark', 'dark-hover', 'dark-focus', 'dark-group-hover', 'dark-placeholder']),
  // ...
  },
  plugins: [
    require('nightwind')
  ]
}
```

## Usage

Nightwind leverages the default weights in the Tailwind palette to switch between them when going into night mode.

The nightwind classes are generated automatically whenever you use a tailwind class the sets the color to a text, background, border, or placeholder.

Some examples:

- 'bg-white' in night mode becomes 'bg-black'
- 'bg-red-100' in night mode becomes 'bg-red-900'
- 'placeholder-gray-200' in night mode becomes 'placeholder-gray-800'
- 'hover:text-indigo-300' in night mode becomes 'hover:text-indigo-700'
- 'sm:border-blue-400' in night mode becomes 'sm:border-blue-600'
- 'xl:hover:bg-purple-500' in night mode remains 'xl:hover:bg-purple-500'

Note: As a reminder, the sum between classes is always 1000. That also means that the '-500' colors will not change when switching into night-mode.

Nightwind is responsive by default, so it supports tailwind breakpoints. But in order to allow pseudo-variants make sure to configure the 'nightwind' variant, as described in the installation section.

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

### Custom classes

Enable the applyComplexClasses experimental feature

```js
// tailwind.config.js
module.exports = {
  experimental: {
    applyComplexClasses: true,
  },
  // ...
}
```



### Custom transitions

Nightwind applies a default 'transition-property' and 'transition-duration' classes to all elements that have color classes. This allows to automatically manage the transition to night mode all across your website. The default duration is '200ms' but you can also customise the transition by extending the default theme:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // ...
      transitionDuration: {
        '0': '0ms',
        'nightwind': '500ms' // deafult '200ms'
      },
    },
  },

  // ...

  plugins: [
    require('nightwind')
  ]
}
```

To deactivate night mode transition, set 'nightwind' to '0ms'

For this reason, if you have an element such as

```html
<a class="text-red-800 hover:text-red-600">I change color on hover</a>
```

The transition would not be instantaneous as you'd expect, but it would take either the default or extended value for the transition.

Alternatively, if you specify the duration in the element:

```html
<a class="text-red-800 hover:text-red-600 duration-150">I change color on hover</a>
```

You'd also change the duration of the transition of that element while switching between night and light mode, making it asynchronized with respect to the rest of the elements.

In such cases where you need to specify the duration for a specific action, while keeping the night transition synchronised with the site, you should do something like this.

```html
<div class="text-red-800">
  <a class="hover:text-red-600 duration-150 transition-colors">I change color on hover</a>
</div>
```

Transition in overrides should also be treated differently, as described in the following section.

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
    textColor: ({ after }) => after(['group-hover', 'dark', 'dark-hover', 'dark-focus', 'dark-group-hover', 'dark-placeholder']),
    backgroundColor: ({ after }) => after(['dark', 'dark-hover', 'dark-focus', 'dark-placeholder']),
    borderColor: ({ after }) => after(['dark', 'dark-hover', 'dark-focus', 'dark-placeholder']),
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