import * as greekLetters from './tokens/greek-letters'
import logger from './logger'

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
      if (i > 1) {
        if (parsedLatex[i - 1].type !== 'number' && parsedLatex[i - 1].type !== 'operator') {
          logger.debug('Adding * before number: ' + item.value + ', previous item: ' + parsedLatex[i - 1].type)
          formattedString += '*'
        }
      }
      formattedString += item.value
    }

    if (item.type === 'operator') {
      if (i === 0 && (item.value === '+' || item.value === '*')) {
        logger.debug('Structure starting with * or +, ignoring')
      } else formattedString += item.value
    }

    if (item.type === 'variable') {
      if (i > 1) {
        if (parsedLatex[i - 1].type !== 'operator') {
          logger.debug('Adding * before variable: ' + item.value + ', previous item: ' + parsedLatex[i - 1].type)
          formattedString += '*'
        }
      }
      formattedString += item.value
    }

    if (item.type === 'group') {
      formattedString += formatter(item.value)
    }

    if (item.type === 'token') {
      logger.debug('Handling token: ' + item.value)

      if (greekLetters.getSymbol(item.value) !== null) {
        const letter = greekLetters.getSymbol(item.value)
        logger.debug('greek letter ' + letter)
        formattedString += letter
      }

      if (item.value === 'frac') {
        if (parsedLatex[i + 1].type === 'group' && parsedLatex[i + 2].type === 'group') {
          logger.debug('Found fraction')
          formattedString += formatter(parsedLatex[i + 1].value) + '/' + formatter(parsedLatex[i + 2].value)
          i += 2
        } else {
          return new Error('Fraction must have 2 following parameters')
        }
      }

      if (item.value === 'sqrt') {
        if (parsedLatex[i + 1].type === 'group') {
          logger.debug('Found square root')
          formattedString += 'sqrt' + formatter(parsedLatex[i + 1].value)
          i++
        } else {
          logger.debug('Square root did not have any following parameters, ignoring')
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
