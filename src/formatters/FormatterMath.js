import * as greekLetters from '../models/greek-letters'
import { debug } from '../logger'

export default class MathFormatter {
  constructor(ast) {
    this.ast = ast
  }

  format(root = this.ast) {
    if (root == null) {
      return ''
    }

    switch (root.type) {
      case 'operator':
        return this.operator(root)
      case 'number':
        return this.number(root)
      case 'function':
        return this.function(root)
      case 'variable':
        return this.variable(root)
      case 'equation':
        return this.equation(root)
      default:
        throw Error('Unexpected type: ' + root.type)
    }
  }

  operator(root) {
    let op = root.operator

    switch (op) {
      case 'plus':
        op = '+'
        break
      case 'minus':
        op = '-'
        break
      case 'multiply':
        op = '*'
        break
      case 'divide':
        op = '/'
        break
      case 'modulus':
        op = '%'
        break
      case 'exponent':
        op = '^'
        break
      default:
    }

    let lhs = this.format(root.lhs)
    let rhs = this.format(root.rhs)

    const precedensOrder = [
      ['modulus'],
      ['exponent'],
      ['multiply', 'divide'],
      ['plus', 'minus'],
    ]

    const higherPrecedens = (a, b) => {
      const depth = op => precedensOrder.findIndex(val => val.includes(op))

      return depth(b) > depth(a)
    }

    const shouldHaveParenthesis = child =>
      child.type == 'operator' && higherPrecedens(root.operator, child.operator)

    let lhsParen = shouldHaveParenthesis(root.lhs)
    let rhsParen = shouldHaveParenthesis(root.rhs)

    // Special case for division
    rhsParen = rhsParen || (op == '/' && root.rhs.type == 'operator')

    lhs = lhsParen ? `(${lhs})` : lhs
    rhs = rhsParen ? `(${rhs})` : rhs

    return lhs + op + rhs
  }

  number(root) {
    return `${root.value}`
  }

  function(root) {
    return `${root.value}(${this.format(root.content)})`
  }

  variable(root) {
    let greekLetter = greekLetters.getSymbol(root.value)

    if (greekLetter) {
      return greekLetter
    }

    return `${root.value}`
  }

  equation(root) {
    return `${this.format(root.lhs)}=${this.format(root.rhs)}`
  }
}
