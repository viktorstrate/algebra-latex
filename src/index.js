import parseLatex from './parser'

const structure = parseLatex('\\frac{1+1}{2}+21 \\cdot b')
console.log(JSON.stringify(structure, null, 2))
