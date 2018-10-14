import ParserLatex from '../../src/parsers/ParserLatex'
import assert from 'assert'

describe('latex parser', () => {
  let parser = latex => {
    let lexerLatex = new ParserLatex(latex)
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
                type: 'symbol',
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

  /*describe('greek letters', () => {
    it('should parse lower case', () => {
      const latex = '\\alpha\\delta\\gamma'

      const expected = [
        {
          type: 'token',
          value: 'alpha',
        },
        {
          type: 'token',
          value: 'delta',
        },
        {
          type: 'token',
          value: 'gamma',
        },
      ]

      assert.deepEqual(parser(latex), expected)
    })

    it('should parse upper case', () => {
      const latex = '\\Alpha\\Delta\\Gamma'

      const expected = [
        {
          type: 'token',
          value: 'Alpha',
        },
        {
          type: 'token',
          value: 'Delta',
        },
        {
          type: 'token',
          value: 'Gamma',
        },
      ]

      assert.deepEqual(parser(latex), expected)
    })
  })

  describe('functions', () => {
    it('should parse basic trigonometry functions', () => {
      const latex = '\\sin (3*4) - \\cos{5} var * \\tan 6var'
      const expected = [
        {
          type: 'function',
          value: 'sin',
        },
        {
          type: 'operator',
          value: '(',
        },
        {
          type: 'number',
          value: '3',
        },
        {
          type: 'operator',
          value: '*',
        },
        {
          type: 'number',
          value: '4',
        },
        {
          type: 'operator',
          value: ')',
        },
        {
          type: 'operator',
          value: '-',
        },
        {
          type: 'function',
          value: 'cos',
        },
        {
          type: 'group',
          value: [
            {
              type: 'number',
              value: 5,
            },
          ],
        },
        {
          type: 'variable',
          value: 'var',
        },
        {
          type: 'operator',
          value: '*',
        },
        {
          type: 'function',
          value: 'tan',
        },
        {
          type: 'number',
          value: '6',
        },
        {
          type: 'variable',
          value: 'var',
        },
      ]

      assert.deepEqual(parser(latex), expected)
    })

    it('should parse modulus', () => {
      const latex = '3\\mod5'
      const expected = [
        {
          type: 'number',
          value: '3',
        },
        {
          type: 'operator',
          value: '%',
        },
        {
          type: 'number',
          value: '5',
        },
      ]

      assert.deepEqual(parser(latex), expected)
    })
  })

  describe('error handling', () => {
    it('should return error for mismatched brackets', () => {
      const latex = '{{23}'

      const expectedError = /Brackets do not match up/

      assert.throws(
        () => {
          throw parser(latex)
        },
        expectedError,
        'mismatched brackets in the end'
      )
    })
  })*/
})
