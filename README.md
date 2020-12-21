# Nightwind

A plugin that gives you an **out-of-the-box, customisable, overridable dark mode** for tailwindcss.

Nightwind uses the existing Tailwind color palette and your own custom colors to automatically generate the dark mode version of the Tailwind color classes you use.

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

#### Installation for older Tailwind versions (< 2.0)

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

## Usage

Nightwind relies on a fixed 'nightwind' class and a toggled 'dark' class applied on a top level element in the DOM, typically the <html> element.

You can define your own functions to manage the dark mode, or use the helper functions included in 'nightwind/helper.js' to get started right away.

```js
// React Example
import nightwind from 'nightwind/helper'

export default function Layout({children}) {

  useEffect(() => {
    nightwind.initNightwind()
  }, []);

  return (
    // ...
  )
}
```

```js
// React Example
import nightwind from "nightwind/helper"

export default function Navbar() {
	return (
		// ...
		<button onClick={() => nightwind.toggleNightMode()}></button>
		// ...
	)
}
```

### Some examples

-   'bg-white' in dark mode becomes 'bg-black'
-   'bg-red-50' in dark mode becomes 'bg-red-900'
-   'ring-amber-100' in dark mode becomes 'ring-amber-900'
-   'placeholder-gray-200' in dark mode becomes 'placeholder-gray-800'
-   'hover:text-indigo-300' in dark mode becomes 'hover:text-indigo-700'
-   'sm:border-lightBlue-400' in dark mode becomes 'sm:border-lightBlue-600'
-   'xl:hover:bg-purple-500' in dark mode remains 'xl:hover:bg-purple-500'

### Supported classes

Due to file size considerations, Nightwind is enabled by default only on the **'text'**, **'bg'** and **'border'** color classes, as well as their **'hover'** variants.

You can also extend Nightwind to other classes and variants:

-   color classes: 'placeholder', 'ring', 'ring-offset', 'divide', 'gradients'
-   variants: all Tailwind variants are supported

## Configuration

### Colors

Nightwind switches between opposite color weights when switching to dark mode. So a -100 color gets switched with a -900 color, -200 with -800 and so forth. (The sum is always 1000).

> Note: -50 colors gets switched with -900.

If you add your custom colors in tailwind.config.js following the same number notation, Nightwind is smart enough to treat them the same way as Tailwind's when switching into dark mode.

```js
// tailwind.config.js
module.exports = {
	// ...
	theme: {
		extend: {
			colors: {
				primary: {
					100: "#caf0f8", // becomes primary-900 in dark mode
					300: "#90e0ef", // becomes primary-700 in dark mode
					500: "#00b4d8", // remains the same in dark mode
					700: "#0077b6", // becomes primary-300 in dark mode
					900: "#03045e", // becomes primary-100 in dark mode
				},
			},
		},
	},
	// ...
}
```

### Screens

Nightwind is responsive by default. If you add custom breakpoints they get automatically applied to Nightwind classes.

### Transition Duration

Nightwind by default applies a '300ms' transition to all color classes. You can customize this value in your tailwind.config.js file.

```js
// tailwind.config.js
module.exports = {
	// ...
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

If you wish to disable transitions for all nightwind classes, you can set the same value to false.

```js
// tailwind.config.js
module.exports = {
	// ...
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

The 'gradient' color class enables Nightwind for the 'from', 'via' and 'to' classes, allowing automatic dark gradients.

The available values for colorClasses are the ones listed above.

## Overrides

The default dark variant allows you to write classes like 'dark:bg-gray-800' (not necessarily related to color classes) that only gets applied when you switch into dark mode.

The 'dark' variant can be used to override the automatic Nightwind classes.

```html
<h2 class="text-gray-900 dark:text-yellow-200">I'm yellow in dark mode</h2>
```

> Note: The 'dark' variant can also be concatenated with both screens and other variants, so you can write classes like 'sm:dark:hover:text-yellow-200'.

Please refer to the [Tailwind official documentation](https://tailwindcss.com/docs/dark-mode) to learn more about the 'dark' variant.

### Custom classes

Thanks to the support for complex classes added in Tailwind 2.0, no additional setup is needed for custom classes. That means you can write things like

```css
.custom {
	@apply text-indigo-700 hover:text-indigo-600;
}
```

and Nightwind will still work as expected when you switch into dark mode.
