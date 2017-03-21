import parseLatex from './parser'
import formatLatex from './formatter'
import logger from './logger'

// Functors
const stripParenthesis = mathString => mathString.substr(1, mathString.length - 2)

module.exports = class AlgebraLatex {
  constructor (latex) {
    logger.debug('Creating AlgebraLatex object with input: ' + latex)
    this.texInput = latex

    this.structure = parseLatex(latex)
  }

  toMath () {
    if (this.formattedMath == null) {
      this.formattedMath = stripParenthesis(formatLatex(this.structure))
    }

    return this.formattedMath
  }
}
