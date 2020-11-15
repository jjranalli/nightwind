const plugin = require('tailwindcss/plugin')

const nightwind = plugin(
  function({ addComponents, theme, variants, e, prefix }) {
        
    const darkSelector = theme('darkSelector', '.dark')

    const colorClasses = []
    const transitionClasses = []
    
    const colors = theme('colors')
    const colorVariants = variants('nightwind')
    const prefixes = ['text', 'bg', 'border', 'placeholder']
    const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

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
              color: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--text-opacity)')
            }
          }
        } else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              backgroundColor: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--bg-opacity)')
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              borderColor: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--border-opacity)')
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: colorClass.includes('white') ? theme('colors.black') : theme('colors.white'),
              color: hexToRGB( `${colorClass.includes('white') ? '#000000' : '#ffffff'}` , 'var(--text-opacity)')
            }
          }
        }
      } else {
        const getColor = colorClass.split('-')[1]
        const invertWeight = String(Math.floor((1000 - Number(colorClass.split('-')[2]))/100)*100) 

        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: theme(`colors.${getColor}.${invertWeight}`),
              color: hexToRGB( `${theme(`colors.${getColor}.${invertWeight}`)}` , 'var(--text-opacity)')
            }
          }  
        }
        else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: theme(`colors.${getColor}.${invertWeight}`),
              backgroundColor: hexToRGB( `${theme(`colors.${getColor}.${invertWeight}`)}` , 'var(--bg-opacity)')
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: theme(`colors.${getColor}.${invertWeight}`),
              borderColor: hexToRGB( `${theme(`colors.${getColor}.${invertWeight}`)}` , 'var(--border-opacity)')
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: theme(`colors.${getColor}.${invertWeight}`),
              color: hexToRGB( `${theme(`colors.${getColor}.${invertWeight}`)}` , 'var(--text-opacity)')
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
      './node_modules/nightwind/**/*.js',
      './node_modules/nightwind/**/*.jsx',
    ],
  }
);

module.exports = nightwind