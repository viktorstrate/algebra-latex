import logger from '../logger'
import functions from '../models/functions'
import greekLetters from '../models/greek-letters'

export default class LatexLexer {
  constructor(latex) {
    this.text = latex
    this.pos = 0
    this.ast = []

    this.col = 0
    this.line = 0
    this.prev_col = 0
    this.prev_line = 0

    this.current_char = () => this.text.charAt(this.pos)
    this.eat = char => {
      if (this.current_char() == char) {
        this.pos += 1
      } else {
        this.error(`Expected ${char} found ${this.current_char()}`)
      }
    }
  }

  increment(amount = 1) {
    this.pos += amount
    this.col += amount
  }

  error(message) {
    let line = this.text.split('\n')[this.prev_line]
    let spacing = ''

    for (let i = 0; i < this.prev_col; i++) {
      spacing += ' '
    }

    throw Error(
      `Lexer error\n${line}\n${spacing}^\nError at line: ${this.prev_line +
        1} col: ${this.prev_col + 1}\n${message}`
    )
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

  number() {
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
      this.increment()
    }

    let result = Number(num)
    if (isNaN(result)) {
      this.error(`Could not parse number: '${num}'`)
    }

    return {
      type: 'number',
      value: result,
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
