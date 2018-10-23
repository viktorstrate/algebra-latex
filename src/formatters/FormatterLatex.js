export default class LatexFormatter {
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
        op = '\\cdot '
        break
      case 'divide':
        return this.fragment(root)
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
      ['multiply'],
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

    lhs = lhsParen ? `\\left(${lhs}\\right)` : lhs
    rhs = rhsParen ? `\\left(${rhs}\\right)` : rhs

    return `${lhs}${op}${rhs}`
  }

  fragment(root) {
    let lhs = this.format(root.lhs)
    let rhs = this.format(root.rhs)

    return `\\frac{${lhs}}{${rhs}}`
  }

  number(root) {
    return `${root.value}`
  }

  function(root) {
    return `\\${root.value}\\left(${this.format(root.content)}\\right)`
  }

  variable(root) {
    return `${root.value}`
  }

  equation(root) {
    return `${this.format(root.lhs)}=${this.format(root.rhs)}`
  }
}
