import LexerLatex from '../lexers/LexerLatex'
import functions from '../models/functions'
import greekLetters from '../models/greek-letters'
import { debug } from '../logger'

export default class ParserLatex {
  constructor(latex) {
    this.lexer = new LexerLatex(latex)
    this.ast = null
    this.current_token = null
    this.peek_token = null
  }

  parse() {
    debug('\nLatex parser .parse()')
    this.ast = this.expr()
    return this.ast
  }

  next_token() {
    if (this.peek_token != null) {
      this.current_token = this.peek_token
      this.peek_token = null
      debug('next token from peek', this.current_token)
    } else {
      this.current_token = this.lexer.next_token()
      debug('next token', this.current_token)
    }
    return this.current_token
  }

  peek() {
    if (this.peek_token == null) {
      this.peek_token = this.lexer.next_token()
    }

    debug('next token from peek', this.peek_token)
    return this.peek_token
  }

  eat(token_type) {
    if (this.next_token().type != token_type) {
      throw Error(
        `Expected ${token_type} found ${JSON.stringify(this.current_token)}`
      )
    }
  }

  expr() {
    // expr : operator
    //      | group
    //      | EOF

    debug('expr')

    this.peek()

    if (
      this.peek_token.type == 'number' ||
      this.peek_token.type == 'operator' ||
      this.peek_token.type == 'variable' ||
      this.peek_token.type == 'function' ||
      this.peek_token.type == 'keyword'
    ) {
      return this.operator()
    }

    if (this.peek_token.type == 'lbracket') {
      return this.group()
    }

    if (this.peek_token.type == 'rbracket') {
      return null
    }

    if (this.peek_token.type == 'EOF') {
      this.next_token()
      return null
    }

    this.next_token()
    throw Error(`Unexpected token: ${JSON.stringify(this.current_token)}`)
  }

  keyword() {
    // keyword : KEYWORD
    //         | fraction
    //         | function
    //         | symbol

    debug('keyword')

    if (this.peek().type != 'keyword') {
      throw Error('Expected keyword found ' + JSON.stringify(this.peek_token))
    }

    let kwd = this.peek_token.value
    kwd = kwd.toLowerCase()

    debug('keyword -', kwd)

    if (kwd == 'frac') {
      return this.fraction()
    }

    if (greekLetters.map(val => val.name).includes(kwd)) {
      return this.symbol(this.current_token.value)
    }

    if (functions.includes(kwd.toLowerCase())) {
      return this.function()
    }

    this.eat('keyword')
    return {
      type: 'keyword',
      value: this.current_token.value,
    }
  }

  fraction() {
    // fraction : FRAC group group

    debug('fraction')

    this.eat('keyword')

    if (this.current_token.value != 'frac') {
      throw Error(
        'Expected fraction found ' + JSON.stringify(this.current_token)
      )
    }

    let nominator = this.group()
    let denominator = this.group()

    return {
      type: 'operator',
      operator: 'divide',
      lhs: nominator,
      rhs: denominator,
    }
  }

  function() {
    // function : FUNCTION group

    debug('function')

    this.eat('keyword')
    let value = this.current_token.value

    let content = this.group()

    return {
      type: 'function',
      value,
      content,
    }
  }

  symbol() {
    // symbol : SYMBOL

    this.eat('keyword')

    debug('symbol')
    return {
      type: 'symbol',
      value: this.current_token.value,
    }
  }

  group() {
    // group : LBRACKET expr RBRACKET

    debug('start group')
    this.eat('lbracket')
    let content = this.expr()
    this.eat('rbracket')
    debug('end group')

    return content
  }

  operator() {
    // operator : term ((PLUS | MINUS) operator)?
    debug('operator left')
    let lhs = this.term()
    let op = this.peek()

    if (op.type != 'operator' || (op.value != 'plus' && op.value != 'minus')) {
      debug('operator only left side')
      return lhs
    }

    // Operator token
    this.next_token()

    debug('operator right')
    let rhs = this.operator()

    return {
      type: 'operator',
      lhs,
      operator: op.value,
      rhs,
    }
  }

  term() {
    // term : number ( ((MULTIPLY | DIVIDE) term) | variable )?

    debug('term left')

    let lhs = this.number()
    let op = this.peek()

    if (op.type == 'variable') {
      op = {
        type: 'operator',
        value: 'multiply',
      }
    } else if (
      op.type != 'operator' ||
      (op.value != 'multiply' && op.value != 'divide')
    ) {
      debug('term only left side')
      return lhs
    } else {
      // Operator token
      this.next_token()
    }

    debug('term right')

    let rhs = this.term()

    return {
      type: 'operator',
      lhs,
      operator: op.value,
      rhs,
    }
  }

  number() {
    // number : NUMBER
    //        | UNI_OP
    //        | variable
    //        | keyword

    debug('number')

    this.peek()

    if (this.peek_token.type == 'number') {
      this.next_token()
      return {
        type: this.current_token.type,
        value: this.current_token.value,
      }
    }

    if (this.peek_token.type == 'operator') {
      this.next_token()
      if (
        this.current_token.value == 'plus' ||
        this.current_token.value == 'minus'
      ) {
        let prefix = this.current_token.value
        return {
          type: 'uni-operator',
          prefix,
          content: this.number(),
        }
      }
    }

    if (this.peek_token.type == 'variable') {
      this.next_token()
      return {
        type: 'variable',
        value: this.current_token.value,
      }
    }

    if (this.peek_token.type == 'keyword') {
      return this.keyword()
    }

    this.next_token()
    throw Error(
      'Expected number, variable, function or + - found ' +
        JSON.stringify(this.current_token)
    )
  }
}
