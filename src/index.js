import algebra from 'algebra.js'
import parseLatex from './parser'
import formatLatex from './formatter'

// Functors
const stripParenthesis = mathString => mathString.substr(1, mathString.length - 2)

module.exports = class AlgebraLatex {
  constructor (latex) {
    this.texInput = latex

    this.structure = parseLatex(latex)
  }

  toMath () {
    if (this.formattedMath == null) {
      this.formattedMath = stripParenthesis(formatLatex(this.structure))
    }

    return this.formattedMath
  }

  toAlgebra () {
    if (this.parsedAlgebra == null) {
      this.parsedAlgebra = algebra.parse(this.toMath())
    }
    return this.parsedAlgebra
  }
}
