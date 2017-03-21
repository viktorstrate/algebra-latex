# algebra-latex
[![Build Status](https://travis-ci.org/viktorstrate/algebra-latex.svg?branch=master)](https://travis-ci.org/viktorstrate/algebra-latex)

An npm module for parsing LaTeX math to a regular math string,
that can be parsed to other algebra or math libraries like [algebrite](http://algebrite.org/) and [algebra.js](http://algebra.js.org/)

## Example

```javascript
const AlgebraLatex = require('algebra-latex')

const latexInput = '3*x+2^{10}=10'
const algebraObj = new AlgebraLatex(latexInput)

console.log(latexObj.toMath()) // output: 3*x+2^(10)=10
```


### Parse to other libraries

__Supported libraries__
- [algebra.js](http://algebra.js.org/)
- [algebrite](http://algebrite.org/)
- [coffeequate](http://coffeequate.readthedocs.io/)

> NOTE: The above libraries are optional, and has to be installed before use

*continuing from example above*
```javascript
...

// For algebra.js
algebraObj.toAlgebra() // Will either return an algebra.js expression or equation

// For algebrite
algebraObject.toAlgebrite()

// For coffequate
algebraObject.toCoffeequate()
```
