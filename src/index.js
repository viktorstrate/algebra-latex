import Parser from './Parser'
import MathFormatter from './formatters/FormatterMath'
import LatexFormatter from './formatters/FormatterLatex'
import { debug } from './logger'
import * as greekLetters from './models/greek-letters'
import LatexLexer from './lexers/LexerLatex'
import MathLexer from './lexers/LexerMath'

/**
 * A class for parsing latex math
 */
class AlgebraLatex {
  /**
   * Create an AlgebraLatex object, to be converted
   * @deprecated @param  {String} latex Optional, if defined it will automatically parse the input as latex
   * @return {AlgebraLatex} object to be converted
   */
  constructor(latex) {
    if (typeof latex == 'undefined') {
      return
    }

    this.parseLatex(latex)
  }

  parseLatex(latex) {
    this.input = latex
    this.parser = new Parser(latex, LatexLexer)
    this.parser.parse()
  }

  parseMath(math) {
    this.input = math
    this.parser = new Parser(math, MathLexer)
    this.parser.parse()
  }

  getAst() {
    return this.parser.ast
  }

  /**
   * Will return a serialized string eg. 2*(3+4)/(sqrt(5))-8
   * @return string The serialized string
   */
  toMath() {
    return new MathFormatter(this.getAst()).format()
  }

  /**
   * Will return a formatted latex string eg. \frac{1}{\sqrt{2}}
   * @return string The formatted latex string
   */
  toLatex() {
    return new LatexFormatter(this.getAst()).format()
  }

  /**
   * @deprecated toLatex() should be used instead
   */
  toTex() {
    return self.toLatex()
  }

  /**
   * Will return an algebra.js Expression or Equation
   * @param {Object} algebraJS an instance of algebra.js
   * @return {(Expression|Equation)} an Expression or Equation
   */
  toAlgebra(algebraJS) {
    if (algebraJS === null) {
      throw new Error('Algebra.js must be passed as a parameter for toAlgebra')
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
  toAlgebrite(algebrite) {
    if (algebrite === null) {
      return new Error(
        'Algebrite must be passed as a parameter for toAlgebrite'
      )
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
  toCoffeequate(coffeequate) {
    if (coffeequate === null) {
      return new Error(
        'Coffeequante must be passed as a parameter for toCoffeequante'
      )
    }

    let result = this.toMath()
    result = result.replace('^', '**')

    return coffeequate(result)
  }

  /**
   * Wether or not the object is an equation or an expression
   * @return Boolean true if expression
   */
  isEquation() {
    return this.input.includes('=')
  }
}

module.exports = AlgebraLatex
