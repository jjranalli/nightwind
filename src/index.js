const plugin = require('tailwindcss/plugin')

const nightwind = plugin(
  function({ addComponents, theme, variants }) {
        
    const darkSelector = theme('darkSelector', '.dark')

    const colorClasses = []
    const transitionClasses = []
    const colors = theme('colors')
    const darkColors = theme('dark.colors')
    const colorVariants = ['hover']
    const prefixes = ['text', 'bg', 'border']
    const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    
    if (variants('nightwind.variants')) {
      colorVariants.push(...variants('nightwind.variants'))
    }

    if (variants('nightwind.colorClasses')) {
      prefixes.push(...variants('nightwind.colorClasses'))
      if (variants('nightwind.colorClasses').includes('gradient')) {
        prefixes.push(...['from', 'via', 'to'])
      }
    }

    function hexToRGB(h, alpha) {
      // 3 digits
      if (h.length == 4) {
        let rh = h[1] + h[1];
        let gh = h[2] + h[2];
        let bh = h[3] + h[3];
        var r = parseInt(rh, 16),
        g = parseInt(gh, 16),
        b = parseInt(bh, 16);
      }

      // 6 digits
      if (h.length == 7) {
        var r = parseInt(h.slice(1, 3), 16),
            g = parseInt(h.slice(3, 5), 16),
            b = parseInt(h.slice(5, 7), 16);
      }

      if (alpha) {
          return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      } else {
          return "rgb(" + r + ", " + g + ", " + b + ")";
      }
    }

    Object.keys(colors).forEach(color => {
      prefixes.forEach(prefix => {
        if (color == 'white' || color == 'black') {
          let base = prefix+'-'+color
          colorClasses.push(base);

          colorVariants.forEach(variant => {
            if (variant == 'last') {
              let baseVar = prefix+'-'+color+'\\:'+variant
              colorClasses.push(baseVar);
            } else {
              let baseVar = variant+'\\:'+prefix+'-'+color
              colorClasses.push(baseVar);
            }
          })
        } else {
          return false
        }
      })
    })
    
    Object.keys(colors).forEach(color => {
      if (color == 'transparent' || color == 'current' || color == 'white' || color == 'black') {
        return false
      } else {
        prefixes.forEach(prefix => {
          weights.forEach(weight => {
            let base = prefix+'-'+color+'-'+weight
            colorClasses.push(base); 
              colorVariants.forEach(variant => {
                let baseVar = variant+'\\:'+prefix+'-'+color+'-'+weight
                colorClasses.push(baseVar);
            })
          })
        })   
      }
    })
    
    if(theme('transitionDuration.nightwind') !== false) {
      Object.keys(colors).forEach( color  => {
        prefixes.forEach(prefix => {
          if (color == 'transparent' || color == 'current' || color == 'white' || color == 'black') {
            const transitionClass = {
              [`.nightwind .${prefix}-${color}`]: {
                transitionDuration: theme('transitionDuration.nightwind'), 
                transitionProperty: theme('transitionProperty.colors')
              },
              [`.nightwind .dark\\:${prefix}-${color}`]: {
                transitionDuration: theme('transitionDuration.nightwind'), 
                transitionProperty: theme('transitionProperty.colors')
              }
            }
            transitionClasses.push(transitionClass)
          } else {
            weights.forEach( weight => {
              const transitionClass = {
                [`.nightwind .${prefix}-${color}-${weight}`]: {
                  transitionDuration: theme('transitionDuration.nightwind'), 
                  transitionProperty: theme('transitionProperty.colors')
                },
                [`.nightwind .dark\\:${prefix}-${color}-${weight}`]: {
                  transitionDuration: theme('transitionDuration.nightwind'), 
                  transitionProperty: theme('transitionProperty.colors')
                }
              }
              transitionClasses.push(transitionClass)
            })
          }
        })
      })
    }

    let whiteSelector = '#000'
    let blackSelector = '#fff'
    if (theme(`dark.colors.white`)) {
      const colorMap = theme(`dark.colors.white`)
      whiteSelector = theme(`colors.${colorMap}`) ? theme(`colors.${colorMap}`) : colorMap
    } 
    if (theme(`dark.colors.black`)) {
      const colorMap = theme(`dark.colors.black`)
      blackSelector = theme(`colors.${colorMap}`) ? theme(`colors.${colorMap}`) : colorMap
    }

    const nightwindClasses = colorClasses.map((colorClass) => {
      let pseudoVariant = ''

      colorVariants.forEach(variant => {
        if (colorClass.includes(variant)) { pseudoVariant = variant }
      })

      if ( colorClass.includes('white') || colorClass.includes('black') ) {

        const colorValue = colorClass.includes('white') ? whiteSelector : blackSelector

        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: colorValue,
              color: hexToRGB( `${colorValue}` , 'var(--tw-text-opacity)')
            }
          }
        } else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: colorValue,
              backgroundColor: hexToRGB( `${colorValue}` , 'var(--tw-bg-opacity)')
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: colorValue,
              borderColor: hexToRGB( `${colorValue}` , 'var(--tw-border-opacity)')
            }
          }
        } else if (colorClass.includes('divide-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''} > :not([hidden]) ~ :not([hidden])`]: {
              borderColor: colorValue,
              borderColor: hexToRGB( `${colorValue}` , 'var(--tw-divide-opacity)')
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: colorValue,
              color: hexToRGB( `${colorValue}` , 'var(--tw-text-opacity)')
            }
          }
        } else if (colorClass.includes('ring-offset-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-ring-offset-color': `${colorValue}`
            }
          }
        } else if (colorClass.includes('ring-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-ring-color': hexToRGB( `${colorValue}` , 'var(--tw-ring-opacity)')
            }
          }
        } else if (colorClass.includes('from-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-from': colorValue,
              '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${ hexToRGB(`${colorValue}`, '0') })`,
            }
          }
        } else if (colorClass.includes('via-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-stops': `var(--tw-gradient-from), ${colorValue}, var(--tw-gradient-to, ${hexToRGB(`${colorValue}`, '0')})`,
            }
          }
        } else if (colorClass.includes('to-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-to': `${colorValue}`,
            }
          }
        }
      } else {
        const colorValues = colorClass.split('-')
        const weight = colorValues.pop()
        const color = colorValues.pop()
        const invertWeight = String(Math.floor((1000 - Number(weight))/100)*100) 
        
        let colorValue = ''
        
        if (theme(`dark.colors.${color}.${weight}`)) {
          colorValue = theme(`dark.colors.${color}.${weight}`)
        } else if (theme(`dark.colors.${color}`) && typeof(theme(`dark.colors.${color}`)) === 'string') {
          const colorMap = theme(`dark.colors.${color}`)
          if (theme(`colors.${colorMap}.${invertWeight}`)) {
            colorValue = theme(`colors.${colorMap}.${invertWeight}`)
          } else if (colorMap.split('.').length === 2) {
            colorValue = theme(`colors.${colorMap}`)
          } else if (theme(`colors.${colorMap}`) && theme(`colors.${color}.${invertWeight}`)) {
            colorValue = theme(`colors.${color}.${invertWeight}`)
          } else {
            colorValue = colorMap
          }
        } else {
          colorValue = theme(`colors.${color}.${invertWeight}`)
        }

        
        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: colorValue,
              color: hexToRGB( `${colorValue}` , 'var(--tw-text-opacity)')
            }
          }
        } else if (colorClass.includes('bg-')) {
            return {
              [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
                backgroundColor: colorValue,
                backgroundColor: hexToRGB( `${colorValue}` , 'var(--tw-bg-opacity)')
              }
            }
          } else if (colorClass.includes('border-')) {
            return {
              [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
                borderColor: colorValue,
                borderColor: hexToRGB( `${colorValue}` , 'var(--tw-border-opacity)')
              }
            }
          } else if (colorClass.includes('divide-')) {
            return {
              [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''} > :not([hidden]) ~ :not([hidden])`]: {
                borderColor: colorValue,
                borderColor: hexToRGB( `${colorValue}` , 'var(--tw-divide-opacity)')
              }
            }
          } else if (colorClass.includes('placeholder-')) {
            return {
              [`${darkSelector} .${colorClass}::placeholder`]: {
                color: colorValue,
                color: hexToRGB( `${colorValue}` , 'var(--tw-text-opacity)')
              }
            }
          } else if (colorClass.includes('ring-offset-')) {
            return {
              [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
                '--tw-ring-offset-color': `${colorValue}`
              }
            }
          } else if (colorClass.includes('ring-')) {
            return {
              [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
                '--tw-ring-color': hexToRGB( `${colorValue}` , 'var(--tw-ring-opacity)'),
              }
            }
          } else if (colorClass.includes('from-')) {
            return {
              [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
                '--tw-gradient-from': `${colorValue}`,
                '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${ hexToRGB(`${colorValue}`, '0') })`,
              }
            }
          } else if (colorClass.includes('via-')) {
            return {
              [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
                '--tw-gradient-stops': `var(--tw-gradient-from), ${colorValue}, var(--tw-gradient-to, ${hexToRGB(`${colorValue}`, '0')})`,
              }
            }
          } else if (colorClass.includes('to-')) {
            return {
              [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
                '--tw-gradient-to': `${colorValue}`,
              }
            }
          } 
        }
      }
    )

    addComponents(nightwindClasses, { variants: ['responsive'] });
    addComponents(transitionClasses, { variants: ['responsive'] });
  },
  {
    theme: {
      extend: {
        transitionDuration: {
          '0': '0ms',
          'nightwind': '300ms'
        }
      }
    }
  },
  {
    purge: [
      './node_modules/nightwind/**/*.js'
    ],
  }
);

module.exports = nightwind