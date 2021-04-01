const plugin = require("tailwindcss/plugin")

const nightwind = plugin(
  function ({ addComponents, addUtilities, theme, variants, config }) {
    const darkSelector = ".dark"
    const fixedElementClass = `.${theme(
      "nightwind.fixedClass",
      "nightwind-prevent"
    )}`
    const fixedBlockClass = `.${theme(
      "nightwind.fixedBlockClass",
      "nightwind-prevent-block"
    )}`
    const transitionConfig = theme("nightwind.transitionClasses", "default")
    const colorClasses = []
    const transitionClasses = []
    const typographyValues = {}
    const typographyClasses = []
    const colors = theme("colors")
    const colorVariants = ["hover"]
    const prefixes = ["text", "bg", "border"]
    const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    let importantSelector = ""
    let importantProperty = ""

    if (variants("nightwind")) {
      typeof variants("nightwind") === "object"
        ? colorVariants.push(...variants("nightwind"))
        : colorVariants.push(variants("nightwind"))
    } else if (variants("nightwind.variants")) {
      typeof variants("nightwind.variants") === "object"
        ? colorVariants.push(...variants("nightwind.variants"))
        : colorVariants.push(variants("nightwind.variants"))
    }

    if (theme("nightwind.colorClasses")) {
      typeof theme("nightwind.colorClasses") === "object"
        ? prefixes.push(...theme("nightwind.colorClasses"))
        : prefixes.push(theme("nightwind.colorClasses"))
      if (theme("nightwind.colorClasses").includes("gradient")) {
        prefixes.splice(prefixes.indexOf("gradient"), 1)
        prefixes.push(...["from", "via", "to"])
      }
    } else if (variants("nightwind.colorClasses")) {
      typeof variants("nightwind.colorClasses") === "object"
        ? prefixes.push(...variants("nightwind.colorClasses"))
        : prefixes.push(variants("nightwind.colorClasses"))
      if (variants("nightwind.colorClasses").includes("gradient")) {
        prefixes.splice(prefixes.indexOf("gradient"), 1)
        prefixes.push(...["from", "via", "to"])
      }
    }

    if (config("important")) {
      if (typeof config("important") === "string") {
        importantSelector = `${config("important")}${
          theme("nightwind.importantNode") ? "" : " "
        }`
      }
      if (config("important") === true) {
        importantProperty = " !important"
      }
    }

    function hexToRGB(h, alpha) {
      if (h.includes("var(--")) {
        return h
      }
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

    const hexToTailwind = (hex) => {
      let colorCode = ""
      if (hex != "inherit" && hex != "current" && hex != "transparent") {
        Object.keys(colors).forEach((col) => {
          if (typeof theme(`colors.${col}`) === "string") {
            if (hex === theme(`colors.${col}`)) {
              colorCode = col
            }
          } else if (typeof theme(`colors.${col}`) === "object") {
            Object.keys(theme(`colors.${col}`)).forEach((wei) => {
              if (hex === theme(`colors.${col}.${wei}`)) {
                colorCode = col + "-" + wei
              }
            })
          }
        })
      } else {
        colorCode = hex
      }
      return colorCode
    }

    // Invert color logic

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

    const invertColor = (colorClass) => {
      if (colorClass.includes("white") || colorClass.includes("black")) {
        return {
          colorValue: colorClass.includes("white")
            ? whiteSelector
            : blackSelector,
          defaultColorValue: colorClass.includes("white")
            ? theme("colors.white")
            : theme("colors.black"),
        }
      } else if (
        colorClass === "inherit" ||
        colorClass === "transparent" ||
        colorClass === "current"
      ) {
        return {
          colorValue: colorClass,
          defaultColorValue: colorClass,
        }
      } else {
        const colorValues = colorClass.split("-")
        const weight = colorValues.pop()
        const color = colorValues.pop()
        const defaultValue = theme(`colors.${color}.${weight}`)

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
          return {
            colorValue: theme(`colors.${colorMap}`)
              ? theme(`colors.${colorMap}`)
              : colorMap,
            defaultColorValue: defaultValue,
          }
        } else if (
          theme(`nightwind.colors.${color}`) &&
          typeof theme(`nightwind.colors.${color}`) === "string"
        ) {
          const colorMap = theme(`nightwind.colors.${color}`)
          if (theme(`colors.${colorMap}.${invertWeight}`)) {
            return {
              colorValue: theme(`colors.${colorMap}.${invertWeight}`),
              defaultColorValue: defaultValue,
            }
          } else if (colorMap.split(".").length === 2) {
            return {
              colorValue: theme(`colors.${colorMap}`),
              defaultColorValue: defaultValue,
            }
          } else if (
            theme(`colors.${colorMap}`) &&
            theme(`colors.${color}.${invertWeight}`)
          ) {
            return {
              colorValue: theme(`colors.${color}.${invertWeight}`),
              defaultColorValue: defaultValue,
            }
          } else {
            return {
              colorValue: colorMap,
              defaultColorValue: defaultValue,
            }
          }
        } else if (theme(`nightwind.colors.${color}.default`)) {
          const colorMap = theme(`nightwind.colors.${color}.default`)
          return {
            colorValue: theme(`colors.${colorMap}.${invertWeight}`),
            defaultColorValue: defaultValue,
          }
        } else {
          return {
            colorValue: theme(`colors.${color}.${invertWeight}`),
            defaultColorValue: defaultValue,
          }
        }
      }
    }

    // Generate transition classes

    let transitionDurationValue = "300ms"
    if (
      theme("nightwind.transitionDuration") === false ||
      theme("transitionDuration.nightwind") === false
    ) {
      transitionDurationValue = ""
    } else if (typeof theme("nightwind.transitionDuration") === "string") {
      transitionDurationValue = theme("nightwind.transitionDuration")
    } else if (typeof theme("transitionDuration.nightwind") === "string") {
      transitionDurationValue = theme("transitionDuration.nightwind")
    }

    if (transitionDurationValue) {
      const transitionPrefixes = []
      if (transitionConfig === "full") {
        transitionPrefixes.push(...prefixes)
      } else if (
        typeof transitionConfig === "object" ||
        (typeof transitionConfig === "string" &&
          prefixes.includes(transitionConfig))
      ) {
        typeof transitionConfig === "object"
          ? transitionPrefixes.push(...transitionConfig)
          : transitionPrefixes.push(transitionConfig)
      } else {
        transitionPrefixes.push("text", "bg", "border")
      }

      Object.keys(colors).forEach((color) => {
        transitionPrefixes.forEach((prefix) => {
          if (prefix === "from" || prefix === "via" || prefix === "to") {
            return null
          }
          if (
            color == "transparent" ||
            color == "current" ||
            color == "white" ||
            color == "black"
          ) {
            const transitionClass = {
              [`${
                config("important") ? importantSelector : ""
              }.nightwind .${prefix}-${color}`]: {
                transitionDuration: transitionDurationValue,
                transitionProperty: theme("transitionProperty.colors"),
              },
              [`${
                config("important") ? importantSelector : ""
              }.nightwind .dark\\:${prefix}-${color}`]: {
                transitionDuration: transitionDurationValue,
                transitionProperty: theme("transitionProperty.colors"),
              },
            }
            transitionClasses.push(transitionClass)
          } else {
            weights.forEach((weight) => {
              const transitionClass = {
                [`${
                  config("important") ? importantSelector : ""
                }.nightwind .${prefix}-${color}-${weight}`]: {
                  transitionDuration: transitionDurationValue,
                  transitionProperty: theme("transitionProperty.colors"),
                },
                [`${
                  config("important") ? importantSelector : ""
                }.nightwind .dark\\:${prefix}-${color}-${weight}`]: {
                  transitionDuration: transitionDurationValue,
                  transitionProperty: theme("transitionProperty.colors"),
                },
              }
              transitionClasses.push(transitionClass)
            })
          }
        })
      })
    }

    // Invert typography

    if (theme("nightwind.typography")) {
      Object.keys(theme("typography")).forEach((modifier) => {
        Object.keys(theme(`typography.${modifier}.css`)).forEach((n) => {
          const themeParser = JSON.parse(
            JSON.stringify(theme(`typography.${modifier}.css[${n}]`))
          )
          Object.keys(themeParser).forEach((classname) => {
            const themeClass = themeParser[classname]
            if (
              typeof themeClass === "string" &&
              (classname.includes("color") || classname.includes("Color"))
            ) {
              const colorValue = hexToTailwind(themeClass)
              if (!typographyValues[`${modifier}`]) {
                typographyValues[`${modifier}`] = {}
              }
              if (!typographyValues[`${modifier}`]["prose"]) {
                typographyValues[`${modifier}`]["prose"] = {}
              }
              typographyValues[`${modifier}`]["prose"][classname] = colorValue
            } else if (typeof themeClass === "object") {
              Object.keys(themeClass).forEach((property) => {
                const themeProperty = themeClass[property]
                if (
                  (typeof themeProperty === "string" &&
                    property.includes("color")) ||
                  property.includes("Color")
                ) {
                  const colorValue = hexToTailwind(themeProperty)
                  if (!typographyValues[`${modifier}`]) {
                    typographyValues[`${modifier}`] = {}
                  }
                  if (!typographyValues[`${modifier}`][`${classname}`]) {
                    typographyValues[`${modifier}`][`${classname}`] = {}
                  }
                  typographyValues[`${modifier}`][`${classname}`][
                    property
                  ] = colorValue
                }
              })
            }
          })
        })
      })

      Object.keys(typographyValues).forEach((modifier) => {
        Object.keys(typographyValues[modifier]).forEach((classname) => {
          if (classname === "prose") {
            Object.keys(typographyValues[modifier]["prose"]).forEach(
              (property) => {
                let themeValue = ""
                let nightwindValue = ""
                if (modifier === "DEFAULT") {
                  nightwindValue = theme(`nightwind.typography.${property}`)
                } else {
                  nightwindValue = theme(
                    `nightwind.typography.${modifier}.${property}`
                  )
                }
                theme(`colors.${nightwindValue}`)
                  ? (themeValue = theme(`colors.${nightwindValue}`))
                  : (themeValue = nightwindValue)

                const colorValue = themeValue
                  ? themeValue
                  : invertColor(typographyValues[modifier]["prose"][property])
                      .colorValue
                const defaultColorValue = invertColor(
                  typographyValues[modifier]["prose"][property]
                ).defaultColorValue

                const typographyClass = {
                  [`${importantSelector}${darkSelector} .prose${
                    modifier !== "DEFAULT" ? `-${modifier}` : ""
                  }`]: {
                    [`${property}`]: colorValue,
                  },
                  [`${importantSelector}${darkSelector} ${fixedElementClass}.prose${
                    modifier !== "DEFAULT" ? `-${modifier}` : ""
                  }`]: {
                    [`${property}`]: defaultColorValue,
                  },
                  [`${importantSelector}${darkSelector} ${fixedBlockClass} .prose${
                    modifier !== "DEFAULT" ? `-${modifier}` : ""
                  }`]: {
                    [`${property}`]: defaultColorValue,
                  },
                }
                typographyClasses.push(typographyClass)

                if (transitionDurationValue) {
                  const typographyTransitionClass = {
                    [`${
                      config("important") ? importantSelector : ""
                    }.nightwind .prose${
                      modifier !== "DEFAULT" ? `-${modifier}` : ""
                    }`]: {
                      transitionDuration: transitionDurationValue,
                      transitionProperty: theme("transitionProperty.colors"),
                    },
                    [`${
                      config("important") ? importantSelector : ""
                    }.nightwind .dark\\:prose${
                      modifier !== "DEFAULT" ? `-${modifier}` : ""
                    }`]: {
                      transitionDuration: transitionDurationValue,
                      transitionProperty: theme("transitionProperty.colors"),
                    },
                  }
                  transitionClasses.push(typographyTransitionClass)
                }
              }
            )
          } else {
            Object.keys(typographyValues[modifier][classname]).forEach(
              (property) => {
                let themeValue = ""
                let nightwindValue = ""
                if (modifier === "DEFAULT") {
                  nightwindValue = theme(
                    `nightwind.typography.${classname}.${property}`
                  )
                } else {
                  nightwindValue = theme(
                    `nightwind.typography.${modifier}.${classname}.${property}`
                  )
                }
                theme(`colors.${nightwindValue}`)
                  ? (themeValue = theme(`colors.${nightwindValue}`))
                  : (themeValue = nightwindValue)

                const colorValue = themeValue
                  ? themeValue
                  : invertColor(typographyValues[modifier][classname][property])
                      .colorValue
                const defaultColorValue = invertColor(
                  typographyValues[modifier][classname][property]
                ).defaultColorValue

                const typographyClass = {
                  [`${importantSelector}${darkSelector} .prose${
                    modifier !== "DEFAULT" ? `-${modifier}` : ""
                  } ${classname}`]: {
                    [`${property}`]: colorValue,
                  },
                  [`${importantSelector}${darkSelector} .prose${
                    modifier !== "DEFAULT" ? `-${modifier}` : ""
                  } ${classname}${fixedElementClass}`]: {
                    [`${property}`]: defaultColorValue,
                  },
                  [`${importantSelector}${darkSelector} ${fixedBlockClass} .prose${
                    modifier !== "DEFAULT" ? `-${modifier}` : ""
                  } ${classname}`]: {
                    [`${property}`]: defaultColorValue,
                  },
                  [`${importantSelector}${darkSelector} .prose${
                    modifier !== "DEFAULT" ? `-${modifier}` : ""
                  } ${fixedBlockClass} ${classname}`]: {
                    [`${property}`]: defaultColorValue,
                  },
                }
                typographyClasses.push(typographyClass)
                if (transitionDurationValue) {
                  const typographyTransitionClass = {
                    [`${
                      config("important") ? importantSelector : ""
                    }.nightwind .prose${
                      modifier !== "DEFAULT" ? `-${modifier}` : ""
                    } ${classname}`]: {
                      transitionDuration: transitionDurationValue,
                      transitionProperty: theme("transitionProperty.colors"),
                    },
                    [`${
                      config("important") ? importantSelector : ""
                    }.nightwind .dark\\:prose${
                      modifier !== "DEFAULT" ? `-${modifier}` : ""
                    } ${classname}`]: {
                      transitionDuration: transitionDurationValue,
                      transitionProperty: theme("transitionProperty.colors"),
                    },
                  }
                  transitionClasses.push(typographyTransitionClass)
                }
              }
            )
          }
        })
      })
    }

    // Compose color classes

    prefixes.forEach((prefix) => {
      Object.keys(colors).forEach((color) => {
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

    prefixes.forEach((prefix) => {
      Object.keys(colors).forEach((color) => {
        if (
          color == "transparent" ||
          color == "current" ||
          color == "white" ||
          color == "black"
        ) {
          return false
        } else {
          weights.forEach((weight) => {
            let base = prefix + "-" + color + "-" + weight
            colorClasses.push(base)
            colorVariants.forEach((variant) => {
              let baseVar =
                variant + "\\:" + prefix + "-" + color + "-" + weight
              colorClasses.push(baseVar)
            })
          })
        }
      })
    })

    // Generate dark classes

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
          } else if (variant == "group-hover") {
            pseudoVariant = ""
          } else {
            pseudoVariant = ":" + variant
          }
        }
      })

      let colorValue = invertColor(colorClass).colorValue
      let defaultColorValue = invertColor(colorClass).defaultColorValue

      const generateClass = (prefix, property) => {
        return {
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}`]: {
            [`${property}`]: colorValue + importantProperty,
            [`${property}`]:
              hexToRGB(`${colorValue}`, `var(--tw-${prefix})`) +
              importantProperty,
          },
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}${fixedElementClass}`]: {
            [`${property}`]: defaultColorValue + importantProperty,
            [`${property}`]:
              hexToRGB(`${defaultColorValue}`, `var(--tw-${prefix})`) +
              importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedBlockClass} .${colorClass}${pseudoVariant}`]: {
            [`${property}`]: defaultColorValue + importantProperty,
            [`${property}`]:
              hexToRGB(`${defaultColorValue}`, `var(--tw-${prefix})`) +
              importantProperty,
          },
        }
      }

      if (
        colorVariants.includes("group-hover") &&
        colorClass.includes("group-hover\\:")
      ) {
        const originalColorClass = colorClass
        colorClass = "group:hover ." + originalColorClass
      }

      if (
        colorVariants.includes("group-focus") &&
        colorClass.includes("group-focus\\:")
      ) {
        const originalColorClass = colorClass
        colorClass = "group:focus ." + originalColorClass
      }

      if (colorClass.includes("text-")) {
        return generateClass("text-opacity", "color")
      } else if (colorClass.includes("bg-")) {
        return generateClass("bg-opacity", "backgroundColor")
      } else if (colorClass.includes("border-")) {
        return generateClass("border-opacity", "borderColor")
      } else if (colorClass.includes("ring-")) {
        return generateClass("ring-opacity", "--tw-ring-color")
      } else if (colorClass.includes("divide-")) {
        return {
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant} > :not([hidden]) ~ :not([hidden])`]: {
            borderColor: colorValue + importantProperty,
            borderColor:
              hexToRGB(`${colorValue}`, `var(--tw-divide-opacity)`) +
              importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedElementClass}.${colorClass}${pseudoVariant} > :not([hidden]) ~ :not([hidden])`]: {
            borderColor: defaultColorValue + importantProperty,
            borderColor:
              hexToRGB(`${defaultColorValue}`, `var(--tw-divide-opacity)`) +
              importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedBlockClass} .${colorClass}${pseudoVariant} > :not([hidden]) ~ :not([hidden])`]: {
            borderColor: defaultColorValue + importantProperty,
            borderColor:
              hexToRGB(`${defaultColorValue}`, `var(--tw-divide-opacity)`) +
              importantProperty,
          },
        }
      } else if (colorClass.includes("placeholder-")) {
        return {
          [`${importantSelector}${darkSelector} .${colorClass}::placeholder`]: {
            color: colorValue + importantProperty,
            color:
              hexToRGB(`${colorValue}`, `var(--tw-text-opacity)`) +
              importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedElementClass}.${colorClass}::placeholder`]: {
            color: defaultColorValue + importantProperty,
            color:
              hexToRGB(`${defaultColorValue}`, `var(--tw-text-opacity)`) +
              importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedBlockClass} .${colorClass}::placeholder`]: {
            color: defaultColorValue + importantProperty,
            color:
              hexToRGB(`${defaultColorValue}`, `var(--tw-text-opacity)`) +
              importantProperty,
          },
        }
      } else if (colorClass.includes("ring-offset-")) {
        return {
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}`]: {
            "--tw-ring-offset-color": colorValue + importantProperty,
          },
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}${fixedElementClass}`]: {
            "--tw-ring-offset-color": defaultColorValue + importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedBlockClass} .${colorClass}${pseudoVariant}`]: {
            "--tw-ring-offset-color": defaultColorValue + importantProperty,
          },
        }
      } else if (colorClass.includes("from-")) {
        return {
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-from": colorValue + importantProperty,
            "--tw-gradient-stops":
              `var(--tw-gradient-from), var(--tw-gradient-to, ${hexToRGB(
                `${colorValue}`,
                "0"
              )})` + importantProperty,
          },
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}${fixedElementClass}`]: {
            "--tw-gradient-from": defaultColorValue + importantProperty,
            "--tw-gradient-stops":
              `var(--tw-gradient-from), var(--tw-gradient-to, ${hexToRGB(
                `${defaultColorValue}`,
                "0"
              )})` + importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedBlockClass} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-from": defaultColorValue + importantProperty,
            "--tw-gradient-stops":
              `var(--tw-gradient-from), var(--tw-gradient-to, ${hexToRGB(
                `${defaultColorValue}`,
                "0"
              )})` + importantProperty,
          },
        }
      } else if (colorClass.includes("via-")) {
        return {
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-stops":
              `var(--tw-gradient-from), ${colorValue}, var(--tw-gradient-to, ${hexToRGB(
                `${colorValue}`,
                "0"
              )})` + importantProperty,
          },
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}${fixedElementClass}`]: {
            "--tw-gradient-stops":
              `var(--tw-gradient-from), ${defaultColorValue}, var(--tw-gradient-to, ${hexToRGB(
                `${defaultColorValue}`,
                "0"
              )})` + importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedBlockClass} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-stops":
              `var(--tw-gradient-from), ${defaultColorValue}, var(--tw-gradient-to, ${hexToRGB(
                `${defaultColorValue}`,
                "0"
              )})` + importantProperty,
          },
        }
      } else if (colorClass.includes("to-")) {
        return {
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-to": colorValue + importantProperty,
          },
          [`${importantSelector}${darkSelector} .${colorClass}${pseudoVariant}${fixedElementClass}`]: {
            "--tw-gradient-to": defaultColorValue + importantProperty,
          },
          [`${importantSelector}${darkSelector} ${fixedBlockClass} .${colorClass}${pseudoVariant}`]: {
            "--tw-gradient-to": defaultColorValue + importantProperty,
          },
        }
      }
    })

    addComponents(nightwindClasses, { variants: ["responsive"] })
    addComponents(typographyClasses)
    theme("nightwind.importantNode")
      ? addComponents(transitionClasses, { variants: ["responsive"] })
      : addUtilities(transitionClasses, { variants: ["responsive"] })
  },
  {
    theme: {
      extend: {
        transitionDuration: {
          0: "0ms",
        },
      },
    },
  },
  {
    purge: ["./node_modules/nightwind/**/*.js"],
  }
)

module.exports = nightwind
