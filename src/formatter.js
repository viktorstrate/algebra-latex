import greekLetters from './tokens/greek-letters'

/**
 * Will format a parsed latex object, to a calculatable string
 * @param  {object} parsedLatex An object parsed by "./parser.js"
 * @return {string} A calculatable string, eg. "(1+3)/4*sqrt(2)"
 */
const formatter = (parsedLatex) => {
  let formattedString = ''

  formattedString += '('

  for (var i = 0; i < parsedLatex.length; i++) {
    const item = parsedLatex[i]

    if (item.type === 'number') {
      formattedString += item.value
    }

    if (item.type === 'operator') {
      formattedString += item.value
    }

    if (item.type === 'token') {
      console.log('Handling token', item.value)

      if (greekLetters[item.value.toLowerCase()] !== undefined) {
        const upperCase = item.value.charAt(0).toUpperCase() === item.value.charAt(0)
        const letter = upperCase ? greekLetters[item.value.toLowerCase()].toUpperCase() : greekLetters[item.value.toLowerCase()]
        console.log('greek letter', letter)
        formattedString += letter
      }

      if (item.value === 'frac') {
        if (parsedLatex[i + 1].type === 'group' && parsedLatex[i + 2].type === 'group') {
          console.log('Found fraction')
          formattedString += formatter(parsedLatex[i + 1].value) + '/' + formatter(parsedLatex[i + 2].value)
          i += 2
        } else {
          return new Error('Fraction must have 2 following parameters')
        }
      }

      if (item.value === 'cdot' || item.value === 'times' || item.value === 'ast') {
        formattedString += '*'
      }

      if (item.value === 'div') {
        formattedString += '/'
      }
    }
  }

  formattedString += ')'

  return formattedString
}

export default formatter
