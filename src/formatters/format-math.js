import * as greekLetters from '../models/greek-letters'
import { debug } from '../logger'

export default class MathFormatter {
  constructor(ast) {
    this.ast = ast
  }

  format(root = this.ast) {
    switch (root.type) {
      case 'operator':
        return this.operator(root)
      case 'number':
        return this.number(root)
      case 'function':
        return this.function(root)
      case 'variable':
        return this.variable(root)
      case 'equal':
        return this.equal(root)
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
      default:
    }

    let lhs = this.format(root.lhs)
    let rhs = this.format(root.rhs)

    if (op == '*' || op == '/') {
      if (
        root.lhs.type == 'operator' &&
        (root.lhs.operator != 'multiply' && root.lhs.operator != 'divide')
      ) {
        lhs = `(${lhs})`
      }

      if (
        root.rhs.type == 'operator' &&
        (root.rhs.operator != 'multiply' && root.rhs.operator != 'divide')
      ) {
        rhs = `(${rhs})`
      }
    }

    if (op == '%') {
      if (root.lhs.type == 'operator') {
        lhs = `(${lhs})`
      }

      if (root.rhs.type == 'operator') {
        rhs = `(${rhs})`
      }
    }

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

  equal(root) {
    return `${this.format(root.lhs)}=${this.format(root.rhs)}`
  }
}
