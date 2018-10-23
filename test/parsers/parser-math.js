import Parser from '../../src/Parser'
import MathLexer from '../../src/lexers/LexerMath'
import assert from 'assert'

describe('math parser', () => {
  let parser = math => {
    let lexerMath = new Parser(math, MathLexer)
    return lexerMath.parse()
  }

  it('parse simple expression', () => {
    const math = '1/2 + sqrt(2)* 4'

    assert.deepEqual(parser(math), {
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

  it('parse expressions with parenthesis', () => {
    const math = '1/(2+4 ) '

    assert.deepEqual(parser(math), {
      type: 'operator',
      operator: 'divide',
      lhs: {
        type: 'number',
        value: 1,
      },
      rhs: {
        type: 'operator',
        operator: 'plus',
        lhs: {
          type: 'number',
          value: 2,
        },
        rhs: {
          type: 'number',
          value: 4,
        },
      },
    })
  })

  it('parse expressions with exponents', () => {
    const math = 'e^(-3*4)'

    assert.deepEqual(parser(math), {
      type: 'operator',
      operator: 'exponent',
      lhs: {
        type: 'variable',
        value: 'e',
      },
      rhs: {
        type: 'operator',
        operator: 'multiply',
        lhs: {
          type: 'number',
          value: -3,
        },
        rhs: {
          type: 'number',
          value: 4,
        },
      },
    })
  })

  it('parse fractions without helper parenthesis', () => {
    const math = '1/2*3'

    assert.deepEqual(parser(math), {
      type: 'operator',
      operator: 'multiply',
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
        type: 'number',
        value: 3,
      },
    })
  })
})
