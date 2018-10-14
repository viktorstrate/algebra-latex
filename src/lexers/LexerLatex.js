import logger from '../logger'
import functions from '../models/functions'

export default class LatexLexer {
  constructor(latex) {
    this.text = latex
    this.pos = 0
    this.ast = []

    this.current_char = () => this.text.charAt(this.pos)
    this.eat = char => {
      if (this.current_char() == char) {
        this.pos += 1
      } else {
        throw Error(`Found ${this.current_char()} expected ${char}`)
      }
    }
  }

  next_token() {
    if (this.pos >= this.text.length) {
      return { type: 'EOF' }
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
        this.pos += blank.length
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
      this.pos += 1
      return { type: 'lbracket' }
    }

    if (this.current_char() == '}') {
      this.pos += 1
      return { type: 'rbracket' }
    }

    if (this.current_char() == '+') {
      this.pos += 1
      return { type: 'operator', value: 'plus' }
    }

    if (this.current_char() == '-') {
      this.pos += 1
      return { type: 'operator', value: 'minus' }
    }

    if (this.current_char() == '*') {
      this.pos += 1
      return { type: 'operator', value: 'multiply' }
    }

    if (this.current_char() == '/') {
      this.pos += 1
      return { type: 'operator', value: 'divide' }
    }

    this.pos += 1
    throw Error('Unknown symbol: ' + this.current_char())
  }

  keyword() {
    this.eat('\\')

    let variable = this.variable()

    if (variable.value == 'cdot') {
      return { type: 'operator', value: 'multiply' }
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
      this.pos += 1
    }

    let result = Number(num)
    if (isNaN(result)) {
      throw Error(`Could not parse number: '${num}'`)
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
      this.pos += 1
    }

    return {
      type: 'variable',
      value: token,
    }
  }
}
