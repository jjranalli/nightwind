const selectorParser = require('postcss-selector-parser');
const plugin = require('tailwindcss/plugin')

const nightwind = plugin(
  function({ addComponents, theme, variants, e, prefix, addVariant }) {
        
    const darkSelector = theme('darkSelector', '.night-mode')

    const colorClasses = []
    
    const colors = theme('colors')
    const colorVariants = variants('nightwind')
    const prefixes = ["text", "bg", "border", "placeholder"]
    const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900]

    Object.keys(colors).forEach(color => {
      prefixes.forEach(prefix => {
        if (color == 'white' || color == 'black') {
          let base = prefix+'-'+color
          colorClasses.push(base);

          colorVariants.forEach(variant => {
            let baseVar = variant+'\\:'+prefix+'-'+color
            colorClasses.push(baseVar);
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

    const nightwindClasses = colorClasses.map((colorClass) => {
      let pseudoVariant = ''

      colorVariants.forEach(variant => {
        if (colorClass.includes(variant)) { pseudoVariant = variant }
      })

      if ( colorClass.includes('white') || colorClass.includes('black') ) {
        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: colorClass.includes('white') ? theme('colors.black') : theme('colors.white')
            }
          }
        } else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white')
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white')
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: colorClass.includes('white') ? theme('colors.black') : theme('colors.white')
            }
          }
        }
      } else {
        const getColor = colorClass.split('-')[1]
        const invertWeight = String(1000 - Number(colorClass.slice(-3)))

        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: theme(`colors.${getColor}.${invertWeight}`)
            }
          }  
        }
        else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: theme(`colors.${getColor}.${invertWeight}`)
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: theme(`colors.${getColor}.${invertWeight}`)
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: theme(`colors.${getColor}.${invertWeight}`)
            }
          }
        }
      }
    })

    addComponents(nightwindClasses, { variants: ['responsive'] });

    addVariant('dark', ({modifySelectors, separator}) => {
      modifySelectors(({selector}) => {
        return selectorParser((selectors) => {
          selectors.walkClasses((sel) => {
            sel.value = `dark${separator}${sel.value}`;
            sel.parent.insertBefore(sel, selectorParser().astSync(prefix(`${darkSelector} `)));
          });
        }).processSync(selector);
      });
    });

    addVariant('dark-hover', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .${e(`dark-hover${separator}${className}`)}:hover, ${darkSelector}.${e(`dark-hover${separator}${className}`)}:hover`;
      });
    });

    addVariant('dark-focus', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .${e(`dark-focus${separator}${className}`)}:focus, ${darkSelector}.${e(`dark-focus${separator}${className}`)}:focus`;
      });
    });

    addVariant('dark-active', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .${e(`dark-active${separator}${className}`)}:active, ${darkSelector}.${e(`dark-active${separator}${className}`)}:active`;
      });
    });

    addVariant('dark-disabled', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .${e(`dark-disabled${separator}${className}`)}:disabled, ${darkSelector}.${e(`dark-disabled${separator}${className}`)}:disabled`;
      });
    });

    addVariant('dark-group-hover', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .group:hover .${e(`dark-group-hover${separator}${className}`)}, ${darkSelector}.group:hover .${e(`dark-group-hover${separator}${className}`)}`;
      });
    });

    addVariant('dark-focus-within', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .${e(`dark-focus-within${separator}${className}`)}:focus-within, ${darkSelector}.${e(`dark-focus-within${separator}${className}`)}:focus-within`;
      });
    });

    addVariant('dark-even', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .${e(`dark-even${separator}${className}`)}:nth-child(even), ${darkSelector}.${e(`dark-even${separator}${className}`)}:nth-child(even)`;
      });
    });

    addVariant('dark-odd', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .${e(`dark-odd${separator}${className}`)}:nth-child(odd), ${darkSelector}.${e(`dark-odd${separator}${className}`)}:nth-child(odd)`;
      });
    });

    addVariant('dark-placeholder', ({modifySelectors, separator}) => {
      modifySelectors(({className}) => {
        return `${darkSelector} .${e(`dark-placeholder${separator}${className}`)}::placeholder, ${darkSelector}.${e(`dark-placeholder${separator}${className}`)}::placeholder`;
      });
    });
  }
);

module.exports = nightwind