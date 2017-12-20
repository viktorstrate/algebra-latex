import parser from '../src/parser'
import assert from 'assert'

describe('parser', () => {
  it('should parse basic latex example', () => {
    const latex = '\\sqrt{  \\frac{1\\cdot 2   + 3}{\\Delta t} -3 }* 54/399'

    const expectedVal = [
      {
        type: 'function',
        value: 'sqrt'
      }, {
        type: 'group',
        value: [
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
              },
              {
                type: 'operator',
                value: '*'
              },
              {
                type: 'number',
                value: '2'
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
                type: 'token',
                value: 'Delta'
              },
              {
                type: 'variable',
                value: 't'
              }
            ]
          },
          {
            type: 'operator',
            value: '-'
          },
          {
            type: 'number',
            value: '3'
          }
        ]
      },
      {
        type: 'operator',
        value: '*'
      },
      {
        type: 'number',
        value: '54'
      },
      {
        type: 'operator',
        value: '/'
      },
      {
        type: 'number',
        value: '399'
      }
    ]

    assert.deepEqual(parser(latex), expectedVal)
  })

  describe('Multiple character variables', () => {
    it('should parse multiple character variables', () => {
      const latex = 'var*var+a test'

      const expected = [
        {
          type: 'variable',
          value: 'var'
        }, {
          type: 'operator',
          value: '*'
        }, {
          type: 'variable',
          value: 'var'
        }, {
          type: 'operator',
          value: '+'
        }, {
          type: 'variable',
          value: 'a'
        }, {
          type: 'variable',
          value: 'test'
        }
      ]

      assert.deepEqual(parser(latex), expected)
    })

    it('should parse variables with spaces in between', () => {
      const latex = 'a-var \\  var + b'
      const expected = [
        {
          type: 'variable',
          value: 'a'
        }, {
          type: 'operator',
          value: '-'
        }, {
          type: 'variable',
          value: 'var'
        }, {
          type: 'token',
          value: ' '
        }, {
          type: 'variable',
          value: 'var'
        }, {
          type: 'operator',
          value: '+'
        }, {
          type: 'variable',
          value: 'b'
        }
      ]

      assert.deepEqual(parser(latex), expected)
    })
  })

  describe('greek letters', () => {
    it('should parse lower case', () => {
      const latex = '\\alpha\\delta\\gamma'

      const expected = [
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

      assert.deepEqual(parser(latex), expected)
    })

    it('should parse upper case', () => {
      const latex = '\\Alpha\\Delta\\Gamma'

      const expected = [
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

      assert.deepEqual(parser(latex), expected)
    })
  })

  describe('functions', () => {
    it('should parse basic trigonometry functions', () => {
      const latex = '\\sin (3*4) - \\cos 5 var * \\tan 6var'
      const expected = [{
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

      assert.deepEqual(parser(latex), expected)
    })

    it('should parse modulus', () => {
      const latex = '3\\mod5'
      const expected = [
        {
          type: 'number',
          value: '3'
        }, {
          type: 'operator',
          value: '%'
        }, {
          type: 'number',
          value: '5'
        }
      ]

      assert.deepEqual(parser(latex), expected)
    })
  })

  describe('error handling', () => {
    it('should return error for mismatched brackets', () => {
      const latex = '{{23}'

      const expectedError = /Brackets do not match up/

      assert.throws(() => { throw parser(latex) }, expectedError, 'mismatched brackets in the end')
    })
  })
})
