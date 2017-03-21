# latex-algebra.js
[![Build Status](https://travis-ci.org/viktorstrate/algebra-latex.svg?branch=master)](https://travis-ci.org/viktorstrate/algebra-latex)

An npm module for parsing LaTeX math to a regular math string,
that can be parsed to other algebra or math libraries like [algebrite](http://algebrite.org/) and [algebra.js](http://algebra.js.org/)

## Example

```javascript
const AlgebraLatex = require('algebra-latex')

const latexInput = '3*x+2^{10}=10'
const latexObj = new AlgebraLatex(latexInput)

console.log(latexObj.toMath()) // output: 3*x+2^(10)=10
```


### Parse to algebra.js or algebrite

continuing from example above
```javascript
...

// For algebra.js
algebra.parse(latexObj.toMath())

// For algebrite
Algebrite.eval(latexObj.toMath())
```
