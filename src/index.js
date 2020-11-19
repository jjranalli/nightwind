const plugin = require('tailwindcss/plugin')

const nightwind = plugin(
  function({ addComponents, theme, variants }) {
        
    const darkSelector = theme('darkSelector', '.dark')

    const colorClasses = []
    const transitionClasses = []
    const colors = theme('colors')
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

    function hexToRGB(hex, alpha) {
      var r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
  
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

    const nightwindClasses = colorClasses.map((colorClass) => {
      let pseudoVariant = ''

      colorVariants.forEach(variant => {
        if (colorClass.includes(variant)) { pseudoVariant = variant }
      })

      if ( colorClass.includes('white') || colorClass.includes('black') ) {
        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              color: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--tw-text-opacity)')
            }
          }
        } else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              backgroundColor: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--tw-bg-opacity)')
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              borderColor: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--tw-border-opacity)')
            }
          }
        } else if (colorClass.includes('divide-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''} > :not([hidden]) ~ :not([hidden])`]: {
              borderColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              borderColor: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--tw-divide-opacity)')
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              color: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--tw-text-opacity)')
            }
          }
        } else if (colorClass.includes('ring-offset-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-ring-offset-color': `${colorClass.includes('white') ? '#000000' : '#ffffff'}`
            }
          }
        } else if (colorClass.includes('ring-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-ring-color': hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--tw-ring-opacity)')
            }
          }
        } else if (colorClass.includes('from-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-from': colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${ hexToRGB(`${colorClass.includes('white') ? theme('colors.black') : theme('colors.white')}`, '0') })`,
            }
          }
        } else if (colorClass.includes('via-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-stops': `var(--tw-gradient-from), ${colorClass.includes('white') ? theme('colors.black') : theme('colors.white')}, var(--tw-gradient-to, ${hexToRGB(`${colorClass.includes('white') ? theme('colors.black') : theme('colors.white')}`, '0')})`,
            }
          }
        } else if (colorClass.includes('to-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-to': `${colorClass.includes('white') ? theme('colors.black') : theme('colors.white')}`,
            }
          }
        }
      } else {
        const colorValues = colorClass.split('-')
        const weight = colorValues.pop()
        const color = colorValues.pop()
        const invertWeight = String(Math.floor((1000 - Number(weight))/100)*100) 

        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: theme(`colors.${color}.${invertWeight}`),
              color: hexToRGB( `${theme(`colors.${color}.${invertWeight}`)}` , 'var(--tw-text-opacity)')
            }
          }  
        }
        else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: theme(`colors.${color}.${invertWeight}`),
              backgroundColor: hexToRGB( `${theme(`colors.${color}.${invertWeight}`)}` , 'var(--tw-bg-opacity)')
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: theme(`colors.${color}.${invertWeight}`),
              borderColor: hexToRGB( `${theme(`colors.${color}.${invertWeight}`)}` , 'var(--tw-border-opacity)')
            }
          }
        } else if (colorClass.includes('divide-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''} > :not([hidden]) ~ :not([hidden])`]: {
              borderColor: theme(`colors.${color}.${invertWeight}`),
              borderColor: hexToRGB( `${theme(`colors.${color}.${invertWeight}`)}` , 'var(--tw-divide-opacity)')
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: theme(`colors.${color}.${invertWeight}`),
              color: hexToRGB( `${theme(`colors.${color}.${invertWeight}`)}` , 'var(--tw-text-opacity)')
            }
          }
        } else if (colorClass.includes('ring-offset-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-ring-offset-color': `${theme(`colors.${color}.${invertWeight}`)}`
            }
          }
        } else if (colorClass.includes('ring-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-ring-color': hexToRGB( `${theme(`colors.${color}.${invertWeight}`)}` , 'var(--tw-ring-opacity)'),
            }
          }
        } else if (colorClass.includes('from-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-from': `${theme(`colors.${color}.${invertWeight}`)}`,
              '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${ hexToRGB(`${theme(`colors.${color}.${invertWeight}`)}`, '0') })`,
            }
          }
        } else if (colorClass.includes('via-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-stops': `var(--tw-gradient-from), ${theme(`colors.${color}.${invertWeight}`)}, var(--tw-gradient-to, ${hexToRGB(`${theme(`colors.${color}.${invertWeight}`)}`, '0')})`,
            }
          }
        } else if (colorClass.includes('to-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              '--tw-gradient-to': `${theme(`colors.${color}.${invertWeight}`)}`,
            }
          }
        } 
      }
    })

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