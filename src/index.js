const plugin = require("tailwindcss/plugin")

const nightwind = plugin(
  function ({ addComponents, addUtilities, theme, variants }) {
    const darkSelector = "dark"
    const fixedClass = theme("nightwind.fixedClass", "nightwind-prevent")

    const colorClasses = []
    const transitionClasses = []
    const colors = theme("colors")
    const colorVariants = ["hover"]
    const prefixes = ["text", "bg", "border"]
    const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

    if (variants("nightwind.variants")) {
      colorVariants.push(...variants("nightwind.variants"))
    }

    if (variants("nightwind.colorClasses")) {
      prefixes.push(...variants("nightwind.colorClasses"))
      if (variants("nightwind.colorClasses").includes("gradient")) {
        prefixes.push(...["from", "via", "to"])
      }
    }

    function hexToRGB(h, alpha) {
      if (h.length == 4) {
        let rh = h[1] + h[1]
        let gh = h[2] + h[2]
        let bh = h[3] + h[3]
        var r = parseInt(rh, 16),
          g = parseInt(gh, 16),
          b = parseInt(bh, 16)
      }
      if (h.length == 7) {
        var r = parseInt(h.slice(1, 3), 16),
          g = parseInt(h.slice(3, 5), 16),
          b = parseInt(h.slice(5, 7), 16)
      }

      if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
      } else {
        return "rgb(" + r + ", " + g + ", " + b + ")"
      }
    }

    Object.keys(colors).forEach((color) => {
      prefixes.forEach((prefix) => {
        if (color == "white" || color == "black") {
          let base = prefix + "-" + color
          colorClasses.push(base)

          colorVariants.forEach((variant) => {
            let baseVar = variant + "\\:" + prefix + "-" + color
            colorClasses.push(baseVar)
          })
        } else {
          return false
        }
      })
    })

    Object.keys(colors).forEach((color) => {
      if (
        color == "transparent" ||
        color == "current" ||
        color == "white" ||
        color == "black"
      ) {
        return false
      } else {
        prefixes.forEach((prefix) => {
          weights.forEach((weight) => {
            let base = prefix + "-" + color + "-" + weight
            colorClasses.push(base)
            colorVariants.forEach((variant) => {
              let baseVar =
                variant + "\\:" + prefix + "-" + color + "-" + weight
              colorClasses.push(baseVar)
            })
          })
        })
      }
    })

    if (theme("transitionDuration.nightwind") !== false) {
      Object.keys(colors).forEach((color) => {
        prefixes.forEach((prefix) => {
          if (
            color == "transparent" ||
            color == "current" ||
            color == "white" ||
            color == "black"
          ) {
            const transitionClass = {
              [`.nightwind .${prefix}-${color}`]: {
                transitionDuration: theme("transitionDuration.nightwind"),
                transitionProperty: theme("transitionProperty.colors"),
              },
              [`.nightwind .dark\\:${prefix}-${color}`]: {
                transitionDuration: theme("transitionDuration.nightwind"),
                transitionProperty: theme("transitionProperty.colors"),
              },
            }
            transitionClasses.push(transitionClass)
          } else {
            weights.forEach((weight) => {
              const transitionClass = {
                [`.nightwind .${prefix}-${color}-${weight}`]: {
                  transitionDuration: theme("transitionDuration.nightwind"),
                  transitionProperty: theme("transitionProperty.colors"),
                },
                [`.nightwind .dark\\:${prefix}-${color}-${weight}`]: {
                  transitionDuration: theme("transitionDuration.nightwind"),
                  transitionProperty: theme("transitionProperty.colors"),
                },
              }
              transitionClasses.push(transitionClass)
            })
          }
        })
      })
    }

    let whiteSelector = "#000"
    let blackSelector = "#fff"
    if (theme(`nightwind.colors.white`)) {
      const colorMap = theme(`nightwind.colors.white`)
      whiteSelector = theme(`colors.${colorMap}`)
        ? theme(`colors.${colorMap}`)
        : colorMap
    }
    if (theme(`nightwind.colors.black`)) {
      const colorMap = theme(`nightwind.colors.black`)
      blackSelector = theme(`colors.${colorMap}`)
        ? theme(`colors.${colorMap}`)
        : colorMap
    }

    const nightwindClasses = colorClasses.map((colorClass) => {
      let pseudoVariant = ""

      colorVariants.forEach((variant) => {
        if (colorClass.includes(variant)) {
          if (variant == "last" || variant == "first") {
            pseudoVariant = ":" + variant + "-child"
          } else if (variant == "odd") {
            pseudoVariant = ":nth-child(odd)"
          } else if (variant == "even") {
            pseudoVariant = ":nth-child(2n)"
          } else {
            pseudoVariant = ":" + variant
          }
        }
      })

      let colorValue = ""
      let defaultColorValue = ""
      if (colorClass.includes("white") || colorClass.includes("black")) {
        colorValue = colorClass.includes("white")
          ? whiteSelector
          : blackSelector

        defaultColorValue = colorClass.includes("white")
          ? theme("colors.white")
          : theme("colors.black")
      } else {
        const colorValues = colorClass.split("-")
        const weight = colorValues.pop()
        const color = colorValues.pop()

        defaultColorValue = theme(`colors.${color}.${weight}`)
        let invertWeightIndex = 9 - weights.indexOf(Number(weight))
        let invertWeight = String(weights[invertWeightIndex])

        if (theme("nightwind.colorScale.preset")) {
          switch (theme("nightwind.colorScale.preset")) {
            case "reduced":
              let reducedInvertWeightIndex =
                10 - weights.indexOf(Number(weight))
              reducedInvertWeightIndex > 9
                ? (reducedInvertWeightIndex = 9)
                : reducedInvertWeightIndex
              invertWeight = String(weights[reducedInvertWeightIndex])
              break
          }
        } else if (theme("nightwind.colorScale")) {
          if (theme(`nightwind.colorScale.${weight}`)) {
            invertWeight = String(theme(`nightwind.colorScale.${weight}`))
          }
        }

        if (theme(`nightwind.colors.${color}.${weight}`)) {
          const colorMap = theme(`nightwind.colors.${color}.${weight}`)
          colorValue = theme(`colors.${colorMap}`)
            ? theme(`colors.${colorMap}`)
            : colorMap
        } else if (
          theme(`nightwind.colors.${color}`) &&
          typeof theme(`nightwind.colors.${color}`) === "string"
        ) {
          const colorMap = theme(`nightwind.colors.${color}`)
          if (theme(`colors.${colorMap}.${invertWeight}`)) {
            colorValue = theme(`colors.${colorMap}.${invertWeight}`)
          } else if (colorMap.split(".").length === 2) {
            colorValue = theme(`colors.${colorMap}`)
          } else if (
            theme(`colors.${colorMap}`) &&
            theme(`colors.${color}.${invertWeight}`)
          ) {
            colorValue = theme(`colors.${color}.${invertWeight}`)
          } else {
            colorValue = colorMap
          }
        } else if (theme(`nightwind.colors.${color}.default`)) {
          const colorMap = theme(`nightwind.colors.${color}.default`)
          colorValue = theme(`colors.${colorMap}.${invertWeight}`)
        } else {
          colorValue = theme(`colors.${color}.${invertWeight}`)
        }
      }

      const generateClass = (
        prefix,
        property,
        additional = "",
        variant = pseudoVariant
      ) => {
        return {
          [`.${darkSelector} .${colorClass}${variant}${additional}`]: {
            [`${property}`]: colorValue,
            [`${property}`]: hexToRGB(`${colorValue}`, `var(--tw-${prefix})`),
          },
          [`.${darkSelector} .${fixedClass}.${colorClass}${variant}${additional}`]: {
            [`${property}`]: defaultColorValue,
            [`${property}`]: hexToRGB(
              `${defaultColorValue}`,
              `var(--tw-${prefix})`
            ),
          },
        }
      }

      if (colorClass.includes("text-")) {
        return generateClass("text-opacity", "color")
      } else if (colorClass.includes("bg-")) {
        return generateClass("bg-opacity", "backgroundColor")
      } else if (colorClass.includes("border-")) {
        return generateClass("border-opacity", "borderColor")
      } else if (colorClass.includes("divide-")) {
        return generateClass(
          "divide-opacity",
          "borderColor",
          " > :not([hidden]) ~ :not([hidden])"
        )
      } else if (colorClass.includes("placeholder-")) {
        return generateClass("text-opacity", "color", "::placeholder", "")
      } else if (colorClass.includes("ring-")) {
        return generateClass("ring-opacity", "--tw-ring-color")
      } else if (colorClass.includes("ring-offset-")) {
        return {
          [`.${darkSelector} .${colorClass}${pseudoVariant}`]: {
            "--tw-ring-offset-color": `${colorValue}`,
          },
          [`.${darkSelector} .${fixedClass}.${colorClass}${pseudoVariant}`]: {
            "--tw-ring-offset-color": `${defaultColorValue}`,
          },
        }
      } else if (colorClass.includes("from-")) {
        return {
          [`.${darkSelector} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-from": colorValue,
            "--tw-gradient-stops": `var(--tw-gradient-from), var(--tw-gradient-to, ${hexToRGB(
              `${colorValue}`,
              "0"
            )})`,
          },
          [`.${darkSelector} .${fixedClass}.${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-from": defaultColorValue,
            "--tw-gradient-stops": `var(--tw-gradient-from), var(--tw-gradient-to, ${hexToRGB(
              `${defaultColorValue}`,
              "0"
            )})`,
          },
        }
      } else if (colorClass.includes("via-")) {
        return {
          [`.${darkSelector} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-stops": `var(--tw-gradient-from), ${colorValue}, var(--tw-gradient-to, ${hexToRGB(
              `${colorValue}`,
              "0"
            )})`,
          },
          [`.${darkSelector} .${fixedClass}.${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-stops": `var(--tw-gradient-from), ${defaultColorValue}, var(--tw-gradient-to, ${hexToRGB(
              `${defaultColorValue}`,
              "0"
            )})`,
          },
        }
      } else if (colorClass.includes("to-")) {
        return {
          [`.${darkSelector} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-to": `${colorValue}`,
          },
          [`.${darkSelector} .${fixedClass}.${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-to": `${defaultColorValue}`,
          },
        }
      }
    })

    addComponents(nightwindClasses, { variants: ["responsive"] })
    addUtilities(transitionClasses, { variants: ["responsive"] })
  },
  {
    theme: {
      extend: {
        transitionDuration: {
          0: "0ms",
          nightwind: "300ms",
        },
      },
    },
  },
  {
    purge: ["./node_modules/nightwind/**/*.js"],
  }
)

module.exports = nightwind
