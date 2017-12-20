import logger from './logger'

/**
 * Parse a latex math string, to an object
 * @param  {string} latex A latex string like "\frac{1}{2}"
 * @return {array} An array containing the content of the input,
 *                     formatted with objects with a type and a value field
 */
const parseLatex = (latex) => {
  let findingToken = false
  let findingNumber = false
  let findingVariable = false
  let currentToken = ''
  let currentNumber = ''
  let currentVariable = ''
  let structure = []

  for (let i = 0; i < latex.length; i++) {
    const char = latex.charAt(i)

    if (findingToken) {
      if (char.match(/[a-zA-Z]/g)) {
        currentToken += char
        continue
      } else {
        if ((currentToken + char).match(/^\s+$/g)) {
          currentToken = ' '
        }
        findingToken = false
        logger.debug('Found token ' + currentToken)
        parseToken(currentToken, structure)
        currentToken = ''
      }
    }

    if (findingNumber) {
      // Check for number
      if (char.match(/[\d.,]/g)) {
        logger.debug('Found next number in sequence: ' + char)
        currentNumber += char
        continue
      } else {
        logger.debug('Number found ' + currentNumber)
        structure.push({
          type: 'number',
          value: currentNumber
        })

        currentNumber = ''
        findingNumber = false
      }
    } else {
      if (char.match(/[\d.,]/g)) {
        logger.debug('Found a new number: ' + char)
        currentNumber += char
        findingNumber = true
        continue
      }
    }

    if (findingVariable && !char.match(/[a-zA-Z]/g)) {
      structure.push({
        type: 'variable',
        value: currentVariable
      })
      findingVariable = false
      logger.debug('Found new variable ' + currentVariable)
    }

    // Check for group '{ ... }'
    if (char === '\\') {
      findingToken = true
      continue
    } else {
      if (char === '{') {
        const length = matchingBracketLength(latex.substr(i), 'curly')

        if (length instanceof Error) return length

        const newLatex = latex.substr(i + 1, length - 1)
        logger.debug('New Latex' + newLatex)

        structure.push({
          type: 'group',
          value: parseLatex(newLatex)
        })

        i += length
        continue
      }

      // Check for operator
      if (char.match(/[+\-*/()=^_]/g)) {
        logger.debug('Found operator ' + char)
        structure.push({
          type: 'operator',
          value: char
        })
        continue
      }

      // Check for variable
      if (char.match(/[a-zA-Z]/g)) {
        if (findingVariable) {
          currentVariable += char
          logger.debug('- Finding variable ' + currentVariable)
        } else {
          currentVariable = char
          findingVariable = true
          logger.debug('Finding new variable ' + currentVariable)
        }
      }
    }
  } // Loop end

  if (findingNumber) {
    logger.debug('Wrapping up number')
    structure.push({
      type: 'number',
      value: currentNumber
    })
  }

  if (findingToken) {
    logger.debug('Wrapping up token')
    structure.push({
      type: 'token',
      value: currentToken
    })
  }

  if (findingVariable) {
    logger.debug('Wrapping up variable')
    structure.push({
      type: 'variable',
      value: currentVariable
    })
  }

  return structure
}

const parseToken = (token, structure) => {
  switch (token) {
    case 'cdot':
      structure.push({
        type: 'operator',
        value: '*'
      })
      break
    default:
      structure.push({
        type: 'token',
        value: token
      })
  }
}

/**
 * Will find the length to the matching bracket, in provided string
 * @param  {string} latex       A string of latex, starting from where the search should begin
 * @param  {string} bracketType The type of bracket to search for.
 *                                  Can be one of the following ['normal', 'curly', 'square']
 * @return {number}             The length from start of provided string,
 *                                  to the location of the matching bracket
 */
const matchingBracketLength = (latex, bracketType) => {
  logger.debug('Finding matching bracket for text:', latex)

  let startBracket = ''
  let endBracket = ''

  switch (bracketType) {
    case 'normal':
      startBracket = '('
      endBracket = ')'
      break
    case 'curly':
      startBracket = '{'
      endBracket = '}'
      break
    case 'square':
      startBracket = '['
      endBracket = ']'
      break
  }

  let bracketDepth = 0

  for (let i = 0; i < latex.length; i++) {
    const char = latex.charAt(i)
    logger.debug('-- Char:' + char)

    if (char === startBracket) {
      bracketDepth++
      logger.debug('-- Found starting bracket, depth ' + bracketDepth)
    } else if (char === endBracket) {
      if (bracketDepth === 1) {
        logger.debug('-- Found original closing bracket at position ' + i)
        return i
      }

      bracketDepth--
      logger.debug('-- Found closing bracket, depth ' + bracketDepth)
    }
  }

  return new Error('Brackets do not match up')
}

export default parseLatex
