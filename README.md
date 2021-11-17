![Nightwind cover image](https://github.com/jjranalli/nightwind-demo/raw/master/nightwindcss.com/public/nightwind-logotext.png)

A Tailwind CSS plugin that gives you an **out-of-the-box, customisable, overridable dark mode.**

---

Nightwind uses the existing Tailwind color palette and your own custom colors to automatically generate the dark mode version of the Tailwind color classes you use.

For example, whenever you use a class like **bg-red-600** it gets automatically switched to **bg-red-300** in dark mode.

You can see it in action on https://nightwindcss.com

1. [Installation](#installation)
2. [Helper functions](#helper-functions)
3. [Getting started](#getting-started)
4. [Configuration](#configuration)
   - [Colors](#colors)
   - [Variants and color classes](#variants-and-color-classes)
   - [The 'nightwind-prevent' class](#the-nightwind-prevent-class)
   - [Transitions](#transitions)
   - [Custom color scale](#custom-color-scale)
   - [Important selector](#important-selector)
5. [Color mappings](#color-mappings)
   - [Individual colors](#individual-colors)
   - [Color classes](#color-classes)
   - [Hybrid mapping](#hybrid-mapping)
6. [Overrides](#overrides)
7. [Typography](#typography)

## Installation

```sh
npm install nightwind
```

Enable the Dark class variant in your tailwind.config.js file.

```js
// tailwind.config.js - Tailwind ^2.0
module.exports = {
  darkMode: "class",
  // ...
  plugins: [require("nightwind")],
}
```

#### In older Tailwind versions (< 2.0)

```js
// tailwind.config.js
module.exports = {
  experimental: {
    darkModeVariant: true,
    applyComplexClasses: true,
  },
  dark: "class",
  // ...
  plugins: [require("nightwind")],
}
```

## Helper functions

Nightwind relies on a fixed **'nightwind' class** to manage transitions, and a toggled **'dark' class** applied on a top level element in the DOM, typically the root element.

You can define your own functions to manage the dark mode (or check the [examples](#examples) below), or use the helper functions included in 'nightwind/helper.js' to get started right away.

By default, the helper functions prevent [the dreaded flicker of light mode](https://www.joshwcomeau.com/react/dark-mode/#our-first-hurdle) and allow the chosen color mode to persist on update.

### Initialization

To initialize nightwind, **add the following script tag to the head element of your pages**.

```js
// React Example
import nightwind from "nightwind/helper"

export default function Layout() {
  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
      </Head>
      // ...
    </>
  )
}
```

### Toggle

Similarly, you can use the `toggle` function to switch between dark and light mode.

```js
// React Example
import nightwind from "nightwind/helper"

export default function Navbar() {
  return (
    // ...
    <button onClick={() => nightwind.toggle()}></button>
    // ...
  )
}
```

### Enable mode

If you need to selectively choose between light/dark mode, you can use the `enable` function. It accepts a boolean argument to enable/disable dark mode.

```js
// React Example
import nightwind from "nightwind/helper"

export default function Navbar() {
  return (
    // ...
    <button onClick={() => nightwind.enable(true)}></button>
    // ...
  )
}
```

### BeforeTransition

Nightwind also exports a `beforeTransition` function that you can leverage in case you prefer to build your own toggle functions. It prevents unwanted transitions as a side-effect of having nightwind class in the html tag.

Check out the `toggle` function in the [Nextjs example below](#examples) for an example of how this could be implemented.

### Examples

See examples of implementation (click to expand):

<details>
  <summary>Next.js (using the <a href="https://github.com/pacocoursey/next-themes">next-themes</a> library)</summary>
  
  #### _app.js

Add ThemeProvider using the following configuration

```js
import { ThemeProvider } from "next-themes"

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="nightwind-mode"
      defaultTheme="system" // default "light"
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
```

#### Toggle

Set it up using the useTheme hook

```js
import { useTheme } from "next-themes"
import nightwind from "nightwind/helper"

export default function Toggle(props) {
  const { theme, setTheme } = useTheme()

  const toggle = () => {
    nightwind.beforeTransition()
    if (theme !== "dark") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return <button onClick={toggle}>Toggle</button>
}
```

</details>

<details>
  <summary>Create React App (using the <a href="https://github.com/nfl/react-helmet">react-helmet</a> library)</summary>
  
  #### index.jsx

Add Helmet using the following configuration

```js
import React from "react"
import ReactDOM from "react-dom"
import { Helmet } from "react-helmet"
import nightwind from "nightwind/helper"

import App from "./App"
import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <script>{nightwind.init()}</script>
    </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
```

#### Toggle

Set it up using the default example

```js
import nightwind from "nightwind/helper"

export default function Navbar() {
  return (
    // ...
    <button onClick={() => nightwind.toggle()}></button>
    // ...
  )
}
```

</details>


<details>
  <summary>Pure JavaScript or Alpine.js</summary>
  
The whole idea is to deconstruct helper.js, converting it from a module to a var. And unpacking the 'init' function from within helper to be its own script body to execut at DOM render. Here is the code for that at the time of writing (Oct 14th 2021). As long as the classes made it to tailwind.css (did you configure the plugins right?) then this will enable `nightwind.toggle()` and `nightwind.enable()`
   
```js
<script>
var nightwind = {
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
    nightwind.beforeTransition();
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

    nightwind.beforeTransition();

    if (document.documentElement.classList.contains(opposite)) {
      document.documentElement.classList.remove(opposite);
    }
    document.documentElement.classList.add(mode);
    window.localStorage.setItem('nightwind-mode', mode);
  },
 }
</script>
<script>
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
</script>
```

</details>


## Getting started

This is some examples of what Nightwind does by default:

- 'bg-white' in dark mode becomes 'bg-black'
- 'bg-red-50' in dark mode becomes 'bg-red-900'
- 'ring-amber-100' in dark mode becomes 'ring-amber-800'
- 'placeholder-gray-200' in dark mode becomes 'placeholder-gray-700'
- 'hover:text-indigo-300' in dark mode becomes 'hover:text-indigo-600'
- 'sm:border-lightBlue-400' in dark mode becomes 'sm:border-lightBlue-500'
- 'xl:hover:bg-purple-500' in dark mode becomes 'xl:hover:bg-purple-400'

### Supported classes

Due to file size considerations, Nightwind is enabled by default only on the **'text'**, **'bg'** and **'border'** color classes, as well as their **'hover'** variants.

You can also extend Nightwind to other classes and variants:

- **Color classes**: 'placeholder', 'ring', 'ring-offset', 'divide', 'gradient'
- **Variants**: all Tailwind variants are supported

## Configuration

### Colors

Nightwind switches between opposite color weights when switching to dark mode. So a -50 color gets switched with a -900 color, -100 with -800 and so forth.

> Note: Except for the -50 and -900 weights, the sum of opposite weights is always 900. To customise how Nightwind inverts colors by default, see [how to set up a custom color scale](#custom-color-scale)

If you add your custom colors in tailwind.config.js using number notation, Nightwind will treat them the same way as Tailwind's colors when switching into dark mode.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#caf0f8", // becomes primary-900 in dark mode
          300: "#90e0ef", // becomes primary-600 in dark mode
          600: "#0077b6", // becomes primary-300 in dark mode
          900: "#03045e", // becomes primary-50 in dark mode
        },
      },
    },
  },
}
```

Check out [**color mappings**](#color-mappings) to see how to further customize your dark theme.

### Variants and color classes

Variants and other color classes can be enabled for Nightwind like so:

```js
// tailwind.config.js
module.exports = {
  // ...
  theme: {
    nightwind: {
      colorClasses: [
        "gradient",
        "ring",
        "ring-offset",
        "divide",
        "placeholder",
      ],
    },
  },
  variants: {
    nightwind: ["focus"], // Add any Tailwind variant
  },
  // ...
}
```

The 'gradient' color class enables Nightwind for the 'from', 'via' and 'to' classes, allowing **automatic dark gradients**.

### The 'nightwind-prevent' class

If you want an element to remain exactly the same in both light and dark modes, you can achieve this in Nightwind by adding a **'nightwind-prevent'** class to the element.

> Note: if you only want some of the colors to remain unchanged, consider using [overrides](#overrides).

To prevent all children of an element to remain unchanged in dark mode, you can add the **'nightwind-prevent-block'** class to the element. All descandant nodes of the element will be prevented from switching.

You can customize the name of both classes in your tailwind.config.js file

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      fixedClass: "prevent-switch", // default 'nightwind-prevent'
      fixedBlockClass: "prevent-switch-block", // default 'nightwind-prevent-block'
    },
  },
}
```

> Note: The 'nightwind-prevent' class doesn't work with @apply, so always add it in the html.

### Transitions

Nightwind by default applies a '300ms' transition to all color classes. You can customize this value in your tailwind.config.js file, through the **transitionDuration** property.

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      transitionDuration: "500ms", // default '300ms'
    },
  },
}
```

If you wish to disable transition for a single class, you can add the 'duration-0' class to the element (it's already included in Nightwind).

If you wish to disable the generation of all transition classes, you can do so by setting the same value to false.

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      transitionDuration: false, // default '300ms'
    },
  },
}
```

#### Transition Classes

Nightwind by default generates transition classes for 'text', 'bg' and 'border' color classes. This should make most elements transition smoothly without affecting performances.

In your configuration file you can also set the **transitionClasses** property to 'full' to enable generation of transition classes for all color classes used throughout your website (i.e. rings, divide and placeholder).

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      transitionClasses: "full", // default ['text, 'bg', 'border']
    },
  },
}
```

Alternatively, you can also specify which color classes you'd like to generate transition classes for.

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      transitionClasses: ["bg", "ring"], // default ['text, 'bg', 'border']
    },
  },
}
```

### Custom color scale

This configuration allows you to define how one or more color weights convert in dark-mode. Note that these **affects all color classes**.

For example, you could make all -100 colors switch into -900 colors like so.

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      colorScale: {
        100: 900, // default 800
      },
    },
  },
}
```

> Note: These settings can still be overridden for specific colors using [color mappings](#color-mappings), or in specific elements with [overrides](#overrides)

#### Reduced preset

This preset simulates how Nightwind would behave without the -50 color classes. Any -50 color will essentially appear the same as -100 colors (both becomes -900)

This behaviour may be desirable for two main reasons:

- Makes the reversed -800 and -900 colors darker and more different between themselves.
- -500 colors remain the same in both dark and light mode

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      colorScale: {
        preset: "reduced",
      },
    },
  },
}
```

This is the corresponding scale:

```js
// tailwind.config.js
colorScale: {
  50: 900,
  100: 900,
  200: 800,
  300: 700,
  400: 600,
  500: 500,
  600: 400,
  700: 300,
  800: 200,
  900: 100,
},
```

> Note: When using a preset, specific weights will be ignored.

### Important selector

If you're using the [important ID selector strategy](https://tailwindcss.com/docs/configuration#selector-strategy) in your config, such as

```js
// tailwind.config.js
module.exports = {
  important: "#app",
}
```

Please note that Nightwind assumes that the #app element is a parent of the element which contains the toggled 'dark' and 'nightwind' classes.

If you're applying the 'important ID selector' to the same element that contains both the 'nightwind' and the toggled 'dark' classes (typically the root element), enable the following setting:

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      importantNode: true,
    },
  },
}
```

> Note: [Overrides](#overrides) will stop working as they always assume a parent-child relationship between elements.

## Color mappings

Color mappings allow you to fine-tune your dark theme, change colors in batch and control how Nightwind behaves in dark mode. You set them up like this:

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      colors: {
        // Color mappings go here
      },
    },
  },
}
```

There are two main ways to map colors in Nightwind: using **individual colors** or **color classes**.

### Syntax

You can use the following syntax to specify colors:

- Individual colors: in hex '#fff', Tailwind-based color codes 'red.100', or using CSS variables 'var(--primary)'
- Color classes: such as 'red' or 'gray'

### Individual colors

You can use this to set individual dark colors, directly from tailwind.config.js

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      colors: {
        white: "gray.900",
        black: "gray.50",
        red: {
          100: "#1E3A8A", // or 'blue.900'
          500: "#3B82F6", // or 'blue.500'
          900: "#DBEAFE", // or 'blue.100'
        },
        primary: "var(--secondary)",
        secondary: "var(--primary)",
      },
    },
  },
}
```

- When a mapping is not specified, Nightwind will fallback to the default dark color (red-100 becomes #1E3A8A, while red-200 becomes red-700)

> Note: Contrarily to all other cases, when you individually specify a dark color this way nightwind doesn't automatically invert the color weight. The same is also valid for [overrides](#overrides).

### Color classes

This is useful when you want to switch a whole color class in one go. Consider the following example:

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      colors: {
        red: "blue",
        yellow: "primary",
        pink: "yellow.500",
      },
    },
    extend: {
      colors: {
        primary: {
          50: "#caf0f8",
          300: "#90e0ef",
          600: "#0077b6",
          900: "#03045e",
        },
      },
    },
  },
}
```

- All red color classes become blue in dark mode, with inverted weight (red-600 becomes blue-300);
- Yellow colors in dark mode will switch to the 'primary' custom color with inverted weights, **when available** (yellow-300 becomes primary-600, but yellow-200 becomes yellow-700)
- Notably, if you map a color class such as 'pink' to an individual color such as 'yellow.500', all pink color classes will become yellow-500 regardless of the color weight.

### Hybrid mapping

You can even specify a default dark color for a color class, as well as individual colors for specific weights. You can do so by specifying a default value for a color class.

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      colors: {
        rose: {
          default: "blue",
          200: "yellow.300",
        },
      },
    },
  },
}
```

## Overrides

The default dark variant allows you to write classes like 'dark:bg-gray-200' (not necessarily related to color classes) that only gets applied when you switch into dark mode.

The 'dark' variant can be used to override the automatic Nightwind classes.

```html
<h2 class="text-gray-900 dark:text-yellow-200">I'm yellow in dark mode</h2>
```

> Note: The 'dark' variant can also be concatenated with both screens and other variants, so you can write classes like 'sm:dark:hover:text-yellow-200'.

Please refer to the [Tailwind official documentation](https://tailwindcss.com/docs/dark-mode) to learn more about the 'dark' variant.

## Typography

If you're using the [Typography plugin](https://github.com/tailwindlabs/tailwindcss-typography), you can let Nightwind build an automatic dark mode of all typography color styles.

> Note: It will respect all customizations and [color mappings](#color-mappings) specified in your nightwind configuration.

Simply add the following line in your Nightwind theme configuration:

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      typography: true,
    },
  },
}
```

To fine-tune your typography dark mode, you can define the single classes by using the [individual color syntax](#individual-colors) (either hex or tailwind-based color codes).

```js
// tailwind.config.js
module.exports = {
  theme: {
    nightwind: {
      typography: {
        color: "blue.400",
        h1: {
          color: "#90e0ef",
        },
        indigo: {
          a: {
            color: "purple.300",
          },
        },
      },
    },
  },
}
```
