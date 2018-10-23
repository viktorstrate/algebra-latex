import LexerClass from './lexers/Lexer'
import functions from './models/functions'
import greekLetters from './models/greek-letters'
import { debug } from './logger'

export default class ParserLatex {
  constructor(latex, Lexer) {
    // if (!(Lexer instanceof LexerClass)) {
    //   throw Error('Please parse a valid lexer as second argument')
    // }

    this.lexer = new Lexer(latex)
    this.ast = null
    this.current_token = null
    this.peek_token = null
  }

  parse() {
    debug('\nLatex parser .parse()')
    this.ast = this.equation()

    this.eat('EOF')

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

  error(message) {
    let line = this.lexer.text.split('\n')[this.lexer.line]
    let spacing = ''

    for (let i = 0; i < this.lexer.col; i++) {
      spacing += ' '
    }

    throw Error(
      `Parser error\n${line}\n${spacing}^\nError at line: ${this.lexer.line +
        1} col: ${this.lexer.col + 1}\n${message}`
    )
  }

  eat(token_type) {
    if (this.next_token().type != token_type) {
      this.error(
        `Expected ${token_type} found ${JSON.stringify(this.current_token)}`
      )
    }
  }

  equation() {
    // equation : expr ( EQUAL expr )?
    let lhs = this.expr()

    if (this.peek().type != 'equal') {
      return lhs
    } else {
      this.next_token()
    }

    let rhs = this.expr()

    return {
      type: 'equation',
      lhs,
      rhs,
    }
  }

  expr() {
    // expr : operator

    debug('expr')

    this.peek()

    if (
      this.peek_token.type == 'number' ||
      this.peek_token.type == 'operator' ||
      this.peek_token.type == 'variable' ||
      this.peek_token.type == 'function' ||
      this.peek_token.type == 'keyword' ||
      this.peek_token.type == 'bracket'
    ) {
      return this.operator()
    }

    if (this.peek_token.type == 'bracket' && this.peek_token.open == false) {
      return null
    }

    if (this.peek_token.type == 'EOF') {
      this.next_token()
      return null
    }

    this.next_token()
    this.error(`Unexpected token: ${JSON.stringify(this.current_token)}`)
  }

  keyword() {
    // keyword : KEYWORD
    //         | fraction
    //         | function

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
      this.error(
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
    // function : FUNCTION ( group | number )

    debug('function')

    this.eat('keyword')
    let value = this.current_token.value

    let content
    if (this.peek().type == 'bracket') {
      content = this.group()
    } else {
      content = this.number()
    }

    return {
      type: 'function',
      value,
      content,
    }
  }

  group() {
    // group : LBRACKET expr RBRACKET

    debug('start group')

    this.eat('bracket')
    if (this.current_token.open != true) {
      this.error('Expected opening bracket found ' + this.current_token)
    }

    let content = this.expr()

    this.eat('bracket')
    if (this.current_token.open != false) {
      this.error('Expected closing bracket found ' + this.current_token)
    }

    debug('end group')

    return content
  }

  operator() {
    // operator : operator_term ((PLUS | MINUS) operator)?
    debug('operator left')
    let lhs = this.operator_term()
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
      operator: op.value,
      lhs,
      rhs,
    }
  }

  operator_term() {
    // term : operator_mod ( ((MULTIPLY | DIVIDE) operator_term) | number )?

    debug('term left')

    let lhs = this.operator_mod()
    let op = this.peek()

    if (op.type == 'number' || op.type == 'variable' || op.type == 'keyword') {
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

    let rhs = this.operator_term()

    return {
      type: 'operator',
      operator: op.value,
      lhs,
      rhs,
    }
  }

  operator_mod() {
    // operator_mod : operator_exp ( MODULUS operator_mod )?

    debug('modulus left')

    let lhs = this.operator_exp()
    let op = this.peek()

    if (op.type != 'operator' || op.value != 'modulus') {
      debug('modulus only left side')
      return lhs
    } else {
      // Operator token
      this.next_token()
    }

    debug('modulus right')

    let rhs = this.operator_mod()

    return {
      type: 'operator',
      operator: 'modulus',
      lhs,
      rhs,
    }
  }

  operator_exp() {
    // operator_exp : number ( EXPONENT operator_exp )?

    let lhs = this.number()
    let op = this.peek()

    if (op.type != 'operator' || op.value != 'exponent') {
      debug('modulus only left side')
      return lhs
    } else {
      // Operator token
      this.next_token()
    }

    let rhs = this.operator_exp()

    return {
      type: 'operator',
      operator: 'exponent',
      lhs,
      rhs,
    }
  }

  variable() {
    this.eat('variable')

    return {
      type: 'variable',
      value: this.current_token.value,
    }
  }

  number() {
    // number : NUMBER
    //        | UNI_OP
    //        | variable
    //        | keyword
    //        | symbol
    //        | group

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
        let number = this.number()

        return {
          type: 'number',
          value: prefix == 'minus' ? -number.value : number.value,
        }
      }
    }

    if (this.peek_token.type == 'variable') {
      return this.variable()
    }

    if (this.peek_token.type == 'keyword') {
      return this.keyword()
    }

    if (this.peek_token.type == 'bracket') {
      return this.group()
    }

    this.next_token()
    this.error(
      'Expected number, variable, function, group, or + - found ' +
        JSON.stringify(this.current_token)
    )
  }
}
