import MathLexer from '../../src/lexers/LexerMath'
import assert from 'assert'

describe('math lexer', () => {
  let parse = string => {
    let lexer = new MathLexer(string)

    let result = []

    let token = lexer.next_token()
    while (token.type !== 'EOF') {
      result.push(token)
      token = lexer.next_token()
    }

    return result
  }

  it('parse simple math expression', () => {
    const math = 'sqrt((1* 2  + 3) / (Delta t) - 3 ) * 54/399'
    assert.deepEqual(parse(math), [
      {
        type: 'keyword',
        value: 'sqrt',
      },
      {
        type: 'bracket',
        open: true,
        value: '(',
      },
      {
        type: 'bracket',
        open: true,
        value: '(',
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
        value: ')',
      },
      {
        type: 'operator',
        value: 'divide',
      },
      {
        type: 'bracket',
        open: true,
        value: '(',
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
        value: ')',
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
        value: ')',
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
    ])
  })
})
