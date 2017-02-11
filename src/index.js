import parseLatex from './parser'
import formatLatex from './formatter'

const structure = parseLatex('\\frac{1+1}{2}+21 \\cdot b+\\alpha')
console.log(JSON.stringify(structure, null, 2))

const formattedMath = formatLatex(structure)
console.log(formattedMath)
