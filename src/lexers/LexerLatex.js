import Lexer from './Lexer'
import greekLetters from '../models/greek-letters'

export default class LatexLexer extends Lexer {
  constructor(latex) {
    super(latex)
  }

  next_token() {
    this.prev_col = this.col
    this.prev_line = this.line

    if (this.pos >= this.text.length) {
      return { type: 'EOF' }
    }

    if (this.current_char() == '\n') {
      this.col = 0
      this.line++
    }

    const blank_chars = [
      ' ',
      '\n',
      '\\ ',
      '\\!',
      '&',
      '\\,',
      '\\:',
      '\\;',
      '\\quad',
      '\\qquad',
    ]

    for (let blank of blank_chars) {
      if (this.text.startsWith(blank, this.pos)) {
        this.increment(blank.length)
        return this.next_token()
      }
    }

    if (this.current_char() == '\\') {
      return this.keyword()
    }

    if (this.current_char().match(/[0-9]/)) {
      return this.number()
    }

    if (this.current_char().match(/[a-zA-Z]/)) {
      return this.variable()
    }

    if (this.current_char() == '{') {
      this.increment()
      return { type: 'bracket', open: true, value: '{' }
    }

    if (this.current_char() == '}') {
      this.increment()
      return { type: 'bracket', open: false, value: '}' }
    }

    if (this.current_char() == '(') {
      this.increment()
      return { type: 'bracket', open: true, value: '(' }
    }

    if (this.current_char() == ')') {
      this.increment()
      return { type: 'bracket', open: false, value: ')' }
    }

    if (this.current_char() == '+') {
      this.increment()
      return { type: 'operator', value: 'plus' }
    }

    if (this.current_char() == '-') {
      this.increment()
      return { type: 'operator', value: 'minus' }
    }

    if (this.current_char() == '*') {
      this.increment()
      return { type: 'operator', value: 'multiply' }
    }

    if (this.current_char() == '/') {
      this.increment()
      return { type: 'operator', value: 'divide' }
    }

    if (this.current_char() == '^') {
      this.increment()
      return { type: 'operator', value: 'exponent' }
    }

    if (this.current_char() == '=') {
      this.increment()
      return { type: 'equal' }
    }

    if (this.current_char() == '_') {
      this.increment()
      return { type: 'underscore' }
    }

    this.error('Unknown symbol: ' + this.current_char())
  }

  keyword() {
    this.eat('\\')

    let variable = this.variable()

    if (variable.value == 'cdot') {
      return { type: 'operator', value: 'multiply' }
    }

    if (variable.value == 'mod') {
      return { type: 'operator', value: 'modulus' }
    }

    if (variable.value == 'left') {
      let bracket = this.next_token()

      if (bracket.type != 'bracket' && bracket.open != true) {
        this.error('Expected opening bracket found ' + JSON.stringify(bracket))
      }

      return bracket
    }

    if (variable.value == 'right') {
      let bracket = this.next_token()

      if (bracket.type != 'bracket' && bracket.open != false) {
        this.error('Expected closing bracket found ' + JSON.stringify(bracket))
      }

      return bracket
    }

    if (greekLetters.map(x => x.name).includes(variable.value.toLowerCase())) {
      return { type: 'variable', value: variable.value }
    }

    return {
      type: 'keyword',
      value: variable.value,
    }
  }

  variable() {
    let token = ''
    while (
      this.current_char().match(/[a-zA-Z]/) &&
      this.pos <= this.text.length
    ) {
      token += this.current_char()
      this.increment()
    }

    return {
      type: 'variable',
      value: token,
    }
  }
}
