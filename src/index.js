import parseLatex from './parser'
import formatLatex from './formatter'

const structure = parseLatex('\\frac{1+1}{2}+21 \\cdot b+\\alpha + \\Omega \\cdot (1+2)')
console.log(JSON.stringify(structure, null, 2))

const formattedMath = formatLatex(structure)
console.log('Formatted math:', formattedMath)
