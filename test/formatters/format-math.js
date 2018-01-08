import formatter from '../../src/formatters/format-math.js'
import assert from 'assert'

describe('formatter', () => {
  it('should format a general latex example', () => {
    const parsedLatex = [
      {
        type: 'token',
        value: 'frac'
      },
      {
        type: 'group',
        value: [
          {
            type: 'number',
            value: '2'
          },
          {
            type: 'operator',
            value: '^'
          },
          {
            type: 'group',
            value: [
              {
                type: 'number',
                value: '3'
              }
            ]
          },
          {
            type: 'operator',
            value: '+'
          },
          {
            type: 'number',
            value: '3'
          }
        ]
      },
      {
        type: 'group',
        value: [
          {
            type: 'operator',
            value: '+'
          },
          {
            type: 'number',
            value: '3'
          }
        ]
      }
    ]

    assert.equal(formatter(parsedLatex), '((2^(3)+3)/(3))', 'Long latex example')
  })

  it('should format latex with spaces correctly', () => {
    const parsedLatex = [
      {
        type: 'variable',
        value: 'var'
      }, {
        type: 'token',
        value: ' '
      }, {
        type: 'variable',
        value: 'var'
      }
    ]

    assert.equal(formatter(parsedLatex), '(var*var)')
  })

  describe('functions', () => {
    it('should format sqrt function', () => {
      const parsedLatex = [
        {
          type: 'function',
          value: 'sqrt'
        }, {
          type: 'group',
          value: [
            {
              type: 'number',
              value: '123'
            }
          ]
        }
      ]

      assert.equal(formatter(parsedLatex), '(sqrt(123))', 'sqrt example')
    })

    it('should format basic trigonometry functions', () => {
      const parsedLatex = [{
        type: 'function',
        value: 'sin'
      }, {
        type: 'operator',
        value: '('
      }, {
        type: 'number',
        value: '3'
      }, {
        type: 'operator',
        value: '*'
      }, {
        type: 'number',
        value: '4'
      }, {
        type: 'operator',
        value: ')'
      }, {
        type: 'operator',
        value: '-'
      }, {
        type: 'function',
        value: 'cos'
      }, {
        type: 'number',
        value: '5'
      }, {
        type: 'variable',
        value: 'var'
      }, {
        type: 'operator',
        value: '*'
      }, {
        type: 'function',
        value: 'tan'
      }, {
        type: 'number',
        value: '6'
      }, {
        type: 'variable',
        value: 'var'
      }]

      assert.equal(formatter(parsedLatex), '(sin(3*4)-cos(5)*var*tan(6)*var)')
    })

    it('should format basic integral fucntions', () => {
      const parsedLatex = [
        {
          type: 'function',
          value: 'integral'
        },
        {
          type: 'variable',
          value: 'x'
        }
      ]

      assert.equal(formatter(parsedLatex), '(integral(x))')
    })

    it('should format basic integral functions 1/x', () => {
      const parsedLatex = [
        {
          type: 'function',
          value: 'integral'
        },
        {
          type: 'token',
          value: 'frac'
        },
        {
          type: 'group',
          value: [
            {
              type: 'number',
              value: '1'
            }
          ]
        },
        {
          type: 'group',
          value: [
            {
              type: 'variable',
              value: 'x'
            }
          ]
        }
      ]

      assert.equal(formatter(parsedLatex), '(integral(1)/(x))')
    })
  })

  describe('equations', () => {
    it('should format simple equation with variables and numbers', () => {
      const parsedLatex = [
        {
          type: 'variable',
          value: 'y'
        }, {
          type: 'operator',
          value: '='
        }, {
          type: 'variable',
          value: 'a'
        }, {
          type: 'variable',
          value: 'x'
        }, {
          type: 'operator',
          value: '+'
        }, {
          type: 'number',
          value: '2'
        }, {
          type: 'variable',
          value: 'b'
        }
      ]

      assert.equal(formatter(parsedLatex), '(y=a*x+2*b)')
    })

    it('should format equation with only variables', () => {
      const parsedLatex = [
        {
          type: 'variable',
          value: 'a'
        }, {
          type: 'variable',
          value: 'b'
        }, {
          type: 'variable',
          value: 'c'
        }, {
          type: 'operator',
          value: '='
        }, {
          type: 'variable',
          value: 'a'
        }, {
          type: 'variable',
          value: 'b'
        }, {
          type: 'variable',
          value: 'c'
        }
      ]

      assert.equal(formatter(parsedLatex), '(a*b*c=a*b*c)')
    })
  })

  describe('greek letters', () => {
    it('should format lower case', () => {
      const parsedLatex = [
        {
          type: 'token',
          value: 'alpha'
        }, {
          type: 'token',
          value: 'delta'
        }, {
          type: 'token',
          value: 'gamma'
        }
      ]

      assert.equal(formatter(parsedLatex), '(αδγ)')
    })

    it('should format upper case', () => {
      const parsedLatex = [
        {
          type: 'token',
          value: 'Alpha'
        }, {
          type: 'token',
          value: 'Delta'
        }, {
          type: 'token',
          value: 'Gamma'
        }
      ]

      assert.equal(formatter(parsedLatex), '(ΑΔΓ)')
    })
  })

  describe('error handling', () => {
    it('Should return error for fragments', () => {
      const latex1 = [
        {
          type: 'token',
          value: 'frac'
        },
        {
          type: 'group',
          value: [
            {
              type: 'number',
              value: '1'
            }
          ]
        },
        {
          type: 'number',
          value: '2'
        }
      ]

      const latex2 = [
        {
          type: 'token',
          value: 'frac'
        },
        {
          type: 'number',
          value: '2'
        }
      ]

      const expectedError = /Fraction must have 2 following parameters/

      assert.throws(() => { throw formatter(latex1) }, expectedError, 'Example with one parameter following fraction')
      assert.throws(() => { throw formatter(latex2) }, expectedError, 'Example with no parameters following fraction')
    })

    it('should handle square roots correctly', () => {
      const latex = [
        {
          type: 'function',
          value: 'sqrt'
        }, {
          type: 'number',
          value: '23'
        }
      ]

      const expectedError = /Square root must be followed by/

      assert.throws(() => { throw formatter(latex) }, expectedError)
    })
  })
})
