import algebra from 'algebra.js'
import parseLatex from './parser'
import formatLatex from './formatter'

const structure = parseLatex('2^{10}')
console.log(JSON.stringify(structure, null, 2))

const stripParenthesis = mathString => mathString.substr(1, mathString.length - 2)
const formattedMath = stripParenthesis(formatLatex(structure))
console.log('Formatted math:', formattedMath)

// eslint-disable-next-line new-cap
const exp = new algebra.parse(formattedMath)
console.log('Parsed math:', exp)
