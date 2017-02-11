/**
 * Parse a latex math string, to an object
 * @param  {string} latex A latex string like "\frac{1}{2}"
 * @return {array} An array containing the content of the input,
 *                     formatted with objects with a type and a value field
 */
const parseLatex = (latex) => {
  let findingToken = false
  let findingNumber = false
  let currentToken = ''
  let currentNumber = ''
  let structure = []

  for (let i = 0; i < latex.length; i++) {
    const char = latex.charAt(i)
    const lastIndex = i === latex.length - 1

    if (lastIndex && findingToken) {
      currentToken += char
      findingToken = false
      console.log('Found token', currentToken)
      structure.push({
        type: 'token',
        value: currentToken
      })
      currentToken = ''
      continue
    }

    if (findingToken) {
      if (char.match(/[a-zA-Z]/g)) {
        currentToken += char
        continue
      } else {
        findingToken = false
        console.log('Found token', currentToken)
        structure.push({
          type: 'token',
          value: currentToken
        })
        currentToken = ''
      }
    }

    console.log('Finding number', findingNumber)
    console.log('Last in latex', lastIndex)
    // If last character in latex
    if (i === lastIndex) {
      if (char.match(/[\d.,]/g)) {
        if (findingNumber) {
          currentNumber += char
          console.log('Number found after string ended', currentNumber)
          structure.push({
            type: 'number',
            value: currentNumber
          })

          currentNumber = ''
          findingNumber = false
        } else {
          console.log('New number found after string ended', char)
          structure.push({
            type: 'number',
            value: char
          })
        }
      }
    }

    if (findingNumber) {
      // Check for number
      if (char.match(/[\d.,]/g)) {
        console.log('Found next number in sequence:', char)
        currentNumber += char
        continue
      } else {
        console.log('Number found', currentNumber)
        structure.push({
          type: 'number',
          value: currentNumber
        })

        currentNumber = ''
        findingNumber = false
      }
    } else {
      if (char.match(/[\d.,]/g)) {
        console.log('Found a new number:', char)
        currentNumber += char
        findingNumber = true
        continue
      }
    }

    // Check for group '{ ... }'
    if (char === '\\') {
      findingToken = true
      continue
    } else {
      if (char === '{') {
        const length = matchingBracketLength(latex.substr(i))
        const newLatex = latex.substr(i + 1, length - 1)
        console.log('New Latex', newLatex)

        structure.push({
          type: 'group',
          value: parseLatex(newLatex)
        })

        i += length
        continue
      }

      // Check for operator
      if (char.match(/[+\-*/()=^_]/g)) {
        console.log('Found operator', char)
        structure.push({
          type: 'operator',
          value: char
        })
        continue
      }

      // Check for variable
      if (char.match(/[a-zA-Z]/g)) {
        console.log('Found variable', char)
        structure.push({
          type: 'variable',
          value: char
        })
      }
    }
  }

  return structure
}

const matchingBracketLength = (latex) => {
  console.log('Finding matching bracket for text:', latex)

  let bracketDepth = 0

  for (let i = 0; i < latex.length; i++) {
    const char = latex.charAt(i)
    console.log('-- Char:', char)

    if (char === '{') {
      bracketDepth++
      console.log('-- Found starting bracket, depth', bracketDepth)
    } else if (char === '}') {
      if (bracketDepth === 1) {
        console.log('-- Found original closing bracket at position', i)
        return i
      }

      bracketDepth--
      console.log('-- Found closing bracket, depth', bracketDepth)
    }
  }

  return new Error('Brackets do not match up')
}

export default parseLatex
