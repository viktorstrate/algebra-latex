import parseLatex from './parser'
import mathFormatter from './formatters/format-math.js'
import logger from './logger'
import * as greekLetters from './tokens/greek-letters'

// Functors
const stripParenthesis = mathString => mathString.substr(1, mathString.length - 2)

/**
 * A class for parsing latex math
 */
class AlgebraLatex {
  /**
   * Create an AlgebraLatex object, to be converted
   * @param  {String} latex The latex to parse
   * @return {AlgebraLatex} object to be converted
   */
  constructor (latex) {
    logger.debug('Creating AlgebraLatex object with input: ' + latex)
    this.texInput = latex

    this.structure = parseLatex(latex)
  }

  /**
   * Will return a serialized string eg. 2*(3+4)/(sqrt(5))-8
   * @return string The serialized string
   */
  toMath () {
    if (typeof this.formattedMath === 'undefined') {
      this.formattedMath = stripParenthesis(mathFormatter(this.structure))
    }

    return this.formattedMath
  }

  /**
   * Will return an algebra.js Expression or Equation
   * @param {Object} algebraJS an instance of algebra.js
   * @return {(Expression|Equation)} an Expression or Equation
   */
  toAlgebra (algebraJS) {
    if (algebraJS === null) {
      throw (new Error('Algebra.js must be passed as a parameter for toAlgebra'))
    }

    let mathToParse = this.toMath()
    mathToParse = greekLetters.convertSymbols(mathToParse)

    return algebraJS.parse(mathToParse)
  }

  /**
   * Will return an algebrite object
   * @param {Object} algebrite an instance of algebrite
   * @return {Object} an algebrite object
   */
  toAlgebrite (algebrite) {
    if (algebrite === null) {
      return new Error('Algebrite must be passed as a parameter for toAlgebrite')
    }

    if (this.isEquation()) {
      return new Error('Algebrite can not handle equations, only expressions')
    }

    let mathToParse = this.toMath()
    mathToParse = greekLetters.convertSymbols(mathToParse)

    return algebrite.eval(mathToParse)
  }

  /**
   * Will return a coffequate object
   * @return {Object} a coffeequate object
   */
  toCoffeequate (coffeequate) {
    if (coffeequate === null) {
      return new Error('Coffeequante must be passed as a parameter for toCoffeequante')
    }

    let result = this.toMath()
    result = result.replace('^', '**')

    return coffeequate(result)
  }

  /**
   * Wether or not the object is an equation or an expression
   * @return Boolean true if expression
   */
  isEquation () {
    return this.texInput.includes('=')
  }
}

module.exports = AlgebraLatex

