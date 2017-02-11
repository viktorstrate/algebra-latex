import greekLetters from './tokens/greek-letters'

/**
 * Will format a parsed latex object, to a calculatable string
 * @param  {object} parsedLatex An object parsed by "./parser.js"
 * @return {string} A calculatable string, eg. "(1+3)/4*sqrt(2)"
 */
const formatter = (parsedLatex) => {
  for (var i = 0; i < parsedLatex.length; i++) {
    const item = parsedLatex[i]

    if (item.type === 'token') {
      console.log('Handling token', item.value)

      if (greekLetters[item.value] !== undefined) {
        console.log('greek letter', greekLetters[item.value])
      } else {
        console.log('Not a greek letter')
      }
    }
  }
}

export default formatter
