import Lexer from './Lexer'
import functions from '../models/functions'

export default class LatexLexer extends Lexer {
  constructor(mathString) {
    super(mathString)
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

    const blank_chars = [' ', '\n']

    for (let blank of blank_chars) {
      if (this.text.startsWith(blank, this.pos)) {
        this.increment(blank.length)
        return this.next_token()
      }
    }

    if (this.current_char().match(/[0-9]/)) {
      return this.number()
    }

    if (this.current_char().match(/[a-zA-Z]/)) {
      return this.alphabetic()
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

    this.error('Unknown symbol: ' + this.current_char())
  }

  // Token contains string of alphabetic characters
  alphabetic() {
    let token = ''
    while (
      this.current_char().match(/[a-zA-Z]/) &&
      this.pos <= this.text.length
    ) {
      token += this.current_char()
      this.increment()
    }

    if (functions.includes(token)) {
      return {
        type: 'keyword',
        value: token,
      }
    }

    return {
      type: 'variable',
      value: token,
    }
  }
}
