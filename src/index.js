import parseLatex from './parser'
import formatLatex from './formatter'
import logger from './logger'
import * as greekLetters from './tokens/greek-letters'

// Import optional dependencies
let algebraJS = null
let algebrite = null
let coffeequate = null

try {
  algebraJS = require('algebra.js')
  logger.debug('Algebra.js found')
} catch (e) {
  logger.debug('Algebra.js not found')
}

try {
  algebrite = require('algebrite')
  logger.debug('Algebrite found')
} catch (e) {
  logger.debug('Algebrite not found')
}

try {
  coffeequate = require('coffeequate')
  logger.debug('Coffequate found')
} catch (e) {
  logger.debug('Coffequate not found')
}

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
    if (this.formattedMath == null) {
      this.formattedMath = stripParenthesis(formatLatex(this.structure))
    }

    return this.formattedMath
  }

  /**
   * Will return an algebra.js Expression or Equation
   * @return {(Expression|Equation)} an Expression or Equation
   */
  toAlgebra () {
    if (algebraJS == null) {
      return new Error('Optional module is not installed, install \'algebra.js\' to use this function')
    }

    let mathToParse = this.toMath()
    mathToParse = greekLetters.convertSymbols(mathToParse)

    return algebraJS.parse(mathToParse)
  }

  /**
   * Will return an algebrite object
   * @return {Object} an algebrite object
   */
  toAlgebrite () {
    if (algebrite == null) {
      return new Error('Optional module is not installed, install \'algebrite\' to use this function')
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
  toCoffeequate () {
    if (coffeequate == null) {
      return new Error('Optional module is not installed, install \'coffeequate\' to use this function')
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
