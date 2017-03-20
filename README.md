# latex-algebra.js
[![Build Status](https://travis-ci.org/viktorstrate/algebra-latex.svg?branch=master)](https://travis-ci.org/viktorstrate/algebra-latex)

An npm module for parsing LaTeX math to [algebra.js](http://algebra.js.org/)

## Example

```javascript
const AlgebraLatex = require('algebra-latex')

const latexInput = '3*x+2^{10}=10'
const latexObj = new AlgebraLatex(latexInput)

console.log(latexObj.toMath()) // output: 3*x+2^(10)=10
console.log(latexObj.toAlgebra()) // a parsed algebra.js object
```

