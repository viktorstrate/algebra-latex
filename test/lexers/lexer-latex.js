import LexerLatex from '../../src/lexers/LexerLatex'
import assert from 'assert'

describe('latex lexer', () => {
  let parse = latex => {
    let lexer = new LexerLatex(latex)

    let result = []

    let token = lexer.next_token()
    while (token.type !== 'EOF') {
      result.push(token)
      token = lexer.next_token()
    }

    return result
  }

  it('parse simple latex expression', () => {
    const latex = '\\sqrt{  \\frac{1\\cdot 2   + 3}{\\Delta t} -3 }* 54/399'

    const expected = [
      {
        type: 'keyword',
        value: 'sqrt',
      },
      {
        type: 'bracket',
        open: true,
        value: '{',
      },
      {
        type: 'keyword',
        value: 'frac',
      },
      {
        type: 'bracket',
        open: true,
        value: '{',
      },
      {
        type: 'number',
        value: 1,
      },
      {
        type: 'operator',
        value: 'multiply',
      },
      {
        type: 'number',
        value: 2,
      },
      {
        type: 'operator',
        value: 'plus',
      },
      {
        type: 'number',
        value: 3,
      },
      {
        type: 'bracket',
        open: false,
        value: '}',
      },
      {
        type: 'bracket',
        open: true,
        value: '{',
      },
      {
        type: 'variable',
        value: 'Delta',
      },
      {
        type: 'variable',
        value: 't',
      },
      {
        type: 'bracket',
        open: false,
        value: '}',
      },
      {
        type: 'operator',
        value: 'minus',
      },
      {
        type: 'number',
        value: 3,
      },
      {
        type: 'bracket',
        open: false,
        value: '}',
      },
      {
        type: 'operator',
        value: 'multiply',
      },
      {
        type: 'number',
        value: 54,
      },
      {
        type: 'operator',
        value: 'divide',
      },
      {
        type: 'number',
        value: 399,
      },
    ]

    assert.deepEqual(parse(latex), expected)
  })

  it('parse operators', () => {
    const latex = '32^44=x'

    const expected = [
      {
        type: 'number',
        value: 32,
      },
      {
        type: 'operator',
        value: 'exponent',
      },
      {
        type: 'number',
        value: 44,
      },
      {
        type: 'equal',
      },
      {
        type: 'variable',
        value: 'x',
      },
    ]

    assert.deepEqual(parse(latex), expected)
  })

  it('parse roots', () => {
    const latex = '\\sqrt[3]{2}'

    const expected = [
      {
        type: 'keyword',
        value: 'sqrt',
      },
      {
        type: 'bracket',
        value: '[',
        open: true,
      },
      {
        type: 'number',
        value: 3,
      },
      {
        type: 'bracket',
        value: ']',
        open: false,
      },
      {
        type: 'bracket',
        value: '{',
        open: true,
      },
      {
        type: 'number',
        value: 2,
      },
      {
        type: 'bracket',
        value: '}',
        open: false,
      },
    ]

    assert.deepEqual(parse(latex), expected)
  })

  describe('error handling', () => {
    it('handle bracket error correctly', () => {
      const latex = '\\left\n { \\right\\Alpha'

      const expectedError = /(Lexer error)(.|\n)*(Error at line: 2 col: 10)/

      assert.throws(() => {
        parse(latex)
      }, expectedError)
    })
  })
})
