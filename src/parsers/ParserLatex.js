import LexerLatex from '../lexers/LexerLatex'

export default class ParserLatex {
  constructor(latex) {
    this.lexer = new LexerLatex(latex)
    this.ast = null
  }

  parse() {
    this.ast = this.root()
    return this.ast
  }

  root() {
    console.log('root')
    let result = []

    while (this.pos <= this.text.length) {
      let expr = this.expr()

      if (expr == null) {
        return result
      } else {
        result.push(expr)
      }
    }

    return result
  }

  expr() {
    console.log('expr')
    if (this.current_char() == '\\') {
      return this.keyword()
    }

    if (this.current_char().match(/[\+\-0-9]/)) {
      return this.operator()
    }

    if (this.current_char() == '{') {
      return this.group()
    }

    if (this.current_char() == ' ') {
      this.pos += 1
      return this.expr()
    }

    return null
  }

  keyword() {
    console.log('keyword')
    this.eat('\\')

    let token = ''
    while (
      this.current_char().match(/[a-zA-Z]/) &&
      this.pos <= this.text.length
    ) {
      token += this.current_char()
      this.pos += 1
    }

    token = token.toLocaleLowerCase()
    console.log('keyword - token:', token)

    if (token == 'frac') {
      return this.fraction()
    }

    if (functions.includes(token)) {
      return this.function(token)
    }

    if (greekLetters.map(val => val.name).includes(token)) {
      return this.symbol(token)
    }

    return null
  }

  fraction() {
    console.log('fraction')
    let nominator = this.group()
    let denominator = this.group()

    return {
      type: 'fraction',
      nominator,
      denominator,
    }
  }

  function(token) {
    console.log('function')
    let content = this.group()

    return {
      type: 'function',
      token,
      content,
    }
  }

  symbol(token) {
    console.log('symbol')
    return {
      type: 'symbol',
      token,
    }
  }

  group() {
    console.log('group')
    this.eat('{')
    let content = this.root()
    this.eat('}')

    return {
      type: 'group',
      content,
    }
  }

  operator() {
    console.log('operator')
    let result = [this.number()]

    while (this.current_char().match(/\+\-\*\//)) {
      this.pos += 1
      result.push(this.number())
    }

    return result
  }

  number_token() {
    console.log('number token')
    let num = ''
    let separator = false

    while (this.current_char().match(/[0-9\.]/)) {
      if (this.current_char() == '.') {
        if (separator) {
          break
        } else {
          separator = true
        }
      }

      num += this.current_char()
      this.pos += 1
    }

    let result = Number(num)
    if (isNaN(result)) {
      throw Error(`Could not parse number: '${num}'`)
    }

    return result
  }

  number() {
    console.log('number')
    if (this.current_char() == '+' || this.current_char() == '-') {
      let prefix = this.current_char()
      this.pos += 1
      return {
        type: 'uni-operator',
        prefix,
        content: this.number(),
      }
    } else {
      return {
        type: 'number',
        value: this.number_token(),
      }
    }
  }
}
