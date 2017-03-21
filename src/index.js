import parseLatex from './parser'
import formatLatex from './formatter'
import logger from './logger'

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

  toAlgebra () {
    if (algebraJS == null) {
      return new Error('Optional module is not installed, install \'algebra.js\' to use this function')
    }
    return algebraJS.parse(this.toMath())
  }

  toAlgebrite () {
    if (algebrite == null) {
      return new Error('Optional module is not installed, install \'algebrite\' to use this function')
    }

    if (this.isEquation()) {
      return new Error('Algebrite can not handle equations, only expressions')
    }

    return algebrite.eval(this.toMath())
  }

  toCoffeequate () {
    if (coffeequate == null) {
      return new Error('Optional module is not installed, install \'coffeequate\' to use this function')
    }

    let result = this.toMath()
    result = result.replace('^', '**')

    return coffeequate(result)
  }

  isEquation () {
    return this.texInput.includes('=')
  }
}
