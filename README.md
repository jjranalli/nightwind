# Nightwind

A plugin that gives you an **out-of-the-box, customisable, overridable dark mode** for tailwindcss.

Nightwind uses the existing Tailwind color palette and your own custom colors to automatically generate the dark mode version of the Tailwind color classes you use.

For example, whenever you use a class like **bg-red-600** it gets automatically switched to **bg-red-300** in dark mode.

You can see how it works on https://nightwindcss.com

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

You can define your own functions to manage the dark mode, or use the helper functions included in 'nightwind/helper.js' to get started right away.

By default, the helper functions prevent [the dreaded flicker of light mode](https://www.joshwcomeau.com/react/dark-mode/#our-first-hurdle) and allow the chosen color mode to persist on update.

### Initialization

To initialize nightwind, **add the following script tag to the head element of your pages**.

```js
// React Example
import nightwind from "nightwind/helper"

export default function Layout() {
  return(
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

Similarly, you can use the toggle function to switch between dark and light mode.

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

## Getting started

### Examples

This is an example of what nightwind does by default:

-   'bg-white' in dark mode becomes 'bg-black'
-   'bg-red-50' in dark mode becomes 'bg-red-900'
-   'ring-amber-100' in dark mode becomes 'ring-amber-800'
-   'placeholder-gray-200' in dark mode becomes 'placeholder-gray-700'
-   'hover:text-indigo-300' in dark mode becomes 'hover:text-indigo-600'
-   'sm:border-lightBlue-400' in dark mode becomes 'sm:border-lightBlue-500'
-   'xl:hover:bg-purple-500' in dark mode becomes 'xl:hover:bg-purple-400'

### Supported classes

Due to file size considerations, Nightwind is enabled by default only on the **'text'**, **'bg'** and **'border'** color classes, as well as their **'hover'** variants.

You can also extend Nightwind to other classes and variants:

-   color classes: 'placeholder', 'ring', 'ring-offset', 'divide', 'gradient'
-   variants: all Tailwind variants are supported

## Configuration

### Colors

Nightwind switches between opposite color weights when switching to dark mode. So a -50 color gets switched with a -900 color, -100 with -800 and so forth.

> Note: Except for the -50 and -900 weights, the sum of opposite weights is always 900.

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
  // ...
}
```

You can also use **color mappings** to further customise your dark theme. Check out the next section to see how it works.

### Screens

Nightwind is responsive by default. If you add custom breakpoints they get automatically applied to Nightwind classes.

### Transition Duration

Nightwind by default applies a '300ms' transition to all color classes. You can customize this value in your tailwind.config.js file.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        nightwind: "500ms", // default '300ms'
      },
    },
  },
  // ...
}
```

If you wish to disable transition for a single class, you can add the 'duration-0' class to the element (it is already included in Nightwind).

If you wish to disable transitions for all nightwind classes, you can do so by setting the same value to false.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        nightwind: false, // default '300ms'
      },
    },
  },
  // ...
}
```

### Variants

Variants and other color classes can be enabled for Nightwind like so:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    nightwind: {
      variants: ["focus"], // Add any Tailwind variant
      colorClasses: [
        "gradient",
        "ring",
        "ring-offset",
        "divide",
        "placeholder",
      ],
    },
  },
  // ...
}
```

The 'gradient' color class enables Nightwind for the 'from', 'via' and 'to' classes, allowing **automatic dark gradients**.

### Custom classes

Thanks to the support for complex classes added in Tailwind 2.0, no additional setup is needed for custom classes. That means you can write things like

```css
.custom {
  @apply text-indigo-700 hover:text-indigo-600;
}
```

and Nightwind still works as expected when you switch into dark mode.

## Color mappings

Color mapping allows you to change colors in batch, as well as fine-tune your dark theme and how Nightwind behaves in dark mode. You set them up like this:

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

-   Individual colors: in hex '#fff' or Tailwind-inspired color codes 'red.100'
-   Color classes: such as 'red' or 'gray'

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
      },
    },
  },
}
```

-   When a mapping is not specified, Nightwind will fallback to the default dark color (red-100 becomes #1E3A8A, while red-200 becomes red-700)

> Note: Contrarily to all other cases, when you individually specify a dark color this way nightwind doesn't automatically invert the color weight. The same is also valid for overrides (see below).

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

-   All red color classes become blue in dark mode, with inverted weight (red-600 becomes blue-300);
-   Yellow colors in dark mode will switch to the 'primary' custom color with inverted weights, **when available** (yellow-300 becomes primary-600, but yellow-200 becomes yellow-700)
-   Notably, if you map a color class such as 'pink' to an individual color such as 'yellow.500', all pink color classes will become yellow-500 regardless of the color weight.

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
          100: "yellow.300",
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
