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
        type: 'lbracket',
      },
      {
        type: 'keyword',
        value: 'frac',
      },
      {
        type: 'lbracket',
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
        type: 'rbracket',
      },
      {
        type: 'lbracket',
      },
      {
        type: 'keyword',
        value: 'Delta',
      },
      {
        type: 'variable',
        value: 't',
      },
      {
        type: 'rbracket',
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
        type: 'rbracket',
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
})
