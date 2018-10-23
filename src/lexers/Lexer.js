/**
 * An abstract class shared between lexers
 */
export default class Lexer {
  constructor(text) {
    this.text = text
    this.pos = 0

    this.col = 0
    this.line = 0
    this.prev_col = 0
    this.prev_line = 0
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

  current_char() {
    return this.text.charAt(this.pos)
  }

  eat(char) {
    if (this.current_char() == char) {
      this.pos += 1
    } else {
      this.error(`Expected ${char} found ${this.current_char()}`)
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
}
