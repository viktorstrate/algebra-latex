import MathFormatter from '../../src/formatters/format-math.js'
import assert from 'assert'

describe('formatter', () => {
  let format = ast => {
    let formatter = new MathFormatter(ast)
    return formatter.format()
  }

  it('should format a general latex example', () => {
    const ast = {
      type: 'operator',
      operator: 'multiply',
      lhs: {
        type: 'operator',
        operator: 'plus',
        lhs: {
          type: 'number',
          value: 2,
        },
        rhs: {
          type: 'number',
          value: 3,
        },
      },
      rhs: {
        type: 'operator',
        operator: 'divide',
        lhs: {
          type: 'number',
          value: 5,
        },
        rhs: {
          type: 'number',
          value: 1,
        },
      },
    }

    assert.equal(format(ast), '(2+3)*5/1')
  })

  it('should format latex with spaces correctly', () => {
    const parsedLatex = {
      type: 'operator',
      operator: 'multiply',
      lhs: {
        type: 'variable',
        value: 'var',
      },
      rhs: {
        type: 'variable',
        value: 'var',
      },
    }

    assert.equal(format(parsedLatex), 'var*var')
  })

  describe('functions', () => {
    it('should format sqrt function', () => {
      const parsedLatex = {
        type: 'function',
        value: 'sqrt',
        content: {
          type: 'number',
          value: 123,
        },
      }

      assert.equal(format(parsedLatex), 'sqrt(123)', 'sqrt example')
    })
  })

  describe('equations', () => {
    it('should format simple equation with variables and numbers', () => {
      const parsedLatex = {
        type: 'equal',
        lhs: {
          type: 'variable',
          value: 'y',
        },
        rhs: {
          type: 'operator',
          operator: 'plus',
          lhs: {
            type: 'operator',
            operator: 'multiply',
            lhs: {
              type: 'variable',
              value: 'a',
            },
            rhs: {
              type: 'variable',
              value: 'x',
            },
          },
          rhs: {
            type: 'operator',
            operator: 'multiply',
            lhs: {
              type: 'number',
              value: 2,
            },
            rhs: {
              type: 'variable',
              value: 'b',
            },
          },
        },
      }

      assert.equal(format(parsedLatex), 'y=a*x+2*b')
    })
  })

  describe('greek letters', () => {
    it('should format lower case', () => {
      const parsedLatex = {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'variable',
          value: 'alpha',
        },
        rhs: {
          type: 'variable',
          value: 'beta',
        },
      }

      assert.equal(format(parsedLatex), 'α*β')
    })

    it('should format upper case', () => {
      const parsedLatex = {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'variable',
          value: 'Alpha',
        },
        rhs: {
          type: 'variable',
          value: 'Delta',
        },
      }

      assert.equal(format(parsedLatex), 'Α*Δ')
    })
  })
})
