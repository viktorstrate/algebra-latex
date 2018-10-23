import Parser from '../../src/Parser'
import LatexLexer from '../../src/lexers/LexerLatex'
import assert from 'assert'

describe('latex parser', () => {
  let parser = latex => {
    let lexerLatex = new Parser(latex, LatexLexer)
    return lexerLatex.parse()
  }

  it('parse simple expression', () => {
    const latex = '\\frac{1}{2} + \\sqrt{2} \\cdot 4'

    assert.deepEqual(parser(latex), {
      type: 'operator',
      operator: 'plus',
      lhs: {
        type: 'operator',
        operator: 'divide',
        lhs: {
          type: 'number',
          value: 1,
        },
        rhs: {
          type: 'number',
          value: 2,
        },
      },
      rhs: {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'function',
          value: 'sqrt',
          content: {
            type: 'number',
            value: 2,
          },
        },
        rhs: {
          type: 'number',
          value: 4,
        },
      },
    })
  })

  it('should parse basic latex example', () => {
    const latex = '\\sqrt{  \\frac{1\\cdot 2   + 3}{\\Delta t} -3 }* 54/399'

    let parsed = parser(latex)

    assert.deepEqual(parsed, {
      type: 'operator',
      operator: 'multiply',
      lhs: {
        type: 'function',
        value: 'sqrt',
        content: {
          type: 'operator',
          operator: 'minus',
          lhs: {
            type: 'operator',
            operator: 'divide',
            lhs: {
              type: 'operator',
              operator: 'plus',
              lhs: {
                type: 'operator',
                operator: 'multiply',
                lhs: {
                  type: 'number',
                  value: 1,
                },
                rhs: {
                  type: 'number',
                  value: 2,
                },
              },
              rhs: {
                type: 'number',
                value: 3,
              },
            },
            rhs: {
              type: 'operator',
              operator: 'multiply',
              lhs: {
                type: 'variable',
                value: 'Delta',
              },
              rhs: {
                type: 'variable',
                value: 't',
              },
            },
          },
          rhs: {
            type: 'number',
            value: 3,
          },
        },
      },
      rhs: {
        type: 'operator',
        operator: 'divide',
        lhs: {
          type: 'number',
          value: 54,
        },
        rhs: {
          type: 'number',
          value: 399,
        },
      },
    })
  })

  describe('groups', () => {
    it('operators with groups', () => {
      const latex = '3*(4+2)*{3+4}'

      assert.deepEqual(parser(latex), {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'number',
          value: 3,
        },
        rhs: {
          type: 'operator',
          operator: 'multiply',
          lhs: {
            type: 'operator',
            operator: 'plus',
            lhs: {
              type: 'number',
              value: 4,
            },
            rhs: {
              type: 'number',
              value: 2,
            },
          },
          rhs: {
            type: 'operator',
            operator: 'plus',
            lhs: {
              type: 'number',
              value: 3,
            },
            rhs: {
              type: 'number',
              value: 4,
            },
          },
        },
      })
    })

    it('parse expression starting with a group', () => {
      const latex = '{3+4}*5'

      assert.deepEqual(parser(latex), {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'operator',
          operator: 'plus',
          lhs: {
            type: 'number',
            value: 3,
          },
          rhs: {
            type: 'number',
            value: 4,
          },
        },
        rhs: {
          type: 'number',
          value: 5,
        },
      })
    })
  })

  it('parse exponent examples', () => {
    const latex = '3^2*a^{2*4}*b^(2)3'

    assert.deepEqual(parser(latex), {
      type: 'operator',
      operator: 'multiply',
      lhs: {
        type: 'operator',
        operator: 'exponent',
        lhs: {
          type: 'number',
          value: 3,
        },
        rhs: {
          type: 'number',
          value: 2,
        },
      },
      rhs: {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'operator',
          operator: 'exponent',
          lhs: {
            type: 'variable',
            value: 'a',
          },
          rhs: {
            type: 'operator',
            operator: 'multiply',
            lhs: {
              type: 'number',
              value: 2,
            },
            rhs: {
              type: 'number',
              value: 4,
            },
          },
        },
        rhs: {
          type: 'operator',
          operator: 'multiply',
          lhs: {
            type: 'operator',
            operator: 'exponent',
            lhs: {
              type: 'variable',
              value: 'b',
            },
            rhs: {
              type: 'number',
              value: 2,
            },
          },
          rhs: {
            type: 'number',
            value: 3,
          },
        },
      },
    })
  })

  describe('multiple character variables', () => {
    it('parse multiple character variables', () => {
      const latex = 'var+a var'

      assert.deepEqual(parser(latex), {
        type: 'operator',
        operator: 'plus',
        lhs: {
          type: 'variable',
          value: 'var',
        },
        rhs: {
          type: 'operator',
          operator: 'multiply',
          lhs: {
            type: 'variable',
            value: 'a',
          },
          rhs: {
            type: 'variable',
            value: 'var',
          },
        },
      })
    })

    it('parse variables with spaces in between', () => {
      const latex = 'a \\ \\qquad b'

      assert.deepEqual(parser(latex), {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'variable',
          value: 'a',
        },
        rhs: {
          type: 'variable',
          value: 'b',
        },
      })
    })
  })

  describe('greek letters', () => {
    it('should parse lower case', () => {
      const latex = '\\alpha\\delta\\gamma'

      assert.deepEqual(parser(latex), {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'variable',
          value: 'alpha',
        },
        rhs: {
          type: 'operator',
          operator: 'multiply',
          lhs: {
            type: 'variable',
            value: 'delta',
          },
          rhs: {
            type: 'variable',
            value: 'gamma',
          },
        },
      })
    })

    it('parse upper case', () => {
      const latex = '\\Alpha\\Delta\\Gamma'

      assert.deepEqual(parser(latex), {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'variable',
          value: 'Alpha',
        },
        rhs: {
          type: 'operator',
          operator: 'multiply',
          lhs: {
            type: 'variable',
            value: 'Delta',
          },
          rhs: {
            type: 'variable',
            value: 'Gamma',
          },
        },
      })
    })
  })

  it('parse modulus', () => {
    const latex = '3\\mod5'

    assert.deepEqual(parser(latex), {
      type: 'operator',
      operator: 'modulus',
      lhs: {
        type: 'number',
        value: 3,
      },
      rhs: {
        type: 'number',
        value: 5,
      },
    })
  })

  describe('functions', () => {
    it('should parse basic trigonometry functions', () => {
      const latex =
        '\\sin (3*4) * \\cos{5} \\tan 6var + \\arcsin\\left( 45 \\right )'

      assert.deepEqual(parser(latex), {
        type: 'operator',
        operator: 'plus',
        lhs: {
          type: 'operator',
          operator: 'multiply',
          lhs: {
            type: 'function',
            value: 'sin',
            content: {
              type: 'operator',
              operator: 'multiply',
              lhs: {
                type: 'number',
                value: 3,
              },
              rhs: {
                type: 'number',
                value: 4,
              },
            },
          },
          rhs: {
            type: 'operator',
            operator: 'multiply',
            lhs: {
              type: 'function',
              value: 'cos',
              content: {
                type: 'number',
                value: 5,
              },
            },
            rhs: {
              type: 'operator',
              operator: 'multiply',
              lhs: {
                type: 'function',
                value: 'tan',
                content: {
                  type: 'number',
                  value: 6,
                },
              },
              rhs: {
                type: 'variable',
                value: 'var',
              },
            },
          },
        },
        rhs: {
          content: {
            type: 'number',
            value: 45,
          },
          type: 'function',
          value: 'arcsin',
        },
      })
    })
  })

  describe('equations', () => {
    it('parse simple equation', () => {
      const latex = 'y=a x + b'

      assert.deepEqual(parser(latex), {
        type: 'equation',
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
            type: 'variable',
            value: 'b',
          },
        },
      })
    })
  })

  describe('error handling', () => {
    it('should return error for mismatched brackets to the left', () => {
      const latex = '{{23}'

      const expectedError = /(Parser error)(.|\n)*(Error at line: 1 col: 6)/

      assert.throws(
        () => {
          parser(latex)
        },
        expectedError,
        'mismatched brackets in the end'
      )
    })

    it('should return error for mismatched brackets to the right', () => {
      const latex = '{23}}'

      const expectedError = /(Parser error)(.|\n)*(Error at line: 1 col: 6)/

      assert.throws(
        () => {
          parser(latex)
        },
        expectedError,
        'mismatched brackets in the start'
      )
    })
  })
})
