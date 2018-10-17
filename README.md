# algebra-latex

[![Build Status](https://travis-ci.org/viktorstrate/algebra-latex.svg?branch=master)](https://travis-ci.org/viktorstrate/algebra-latex)

An npm module, with no dependencies, for parsing LaTeX math to a regular math string ([ascii math](http://asciimath.org/)),
that can be parsed to other algebra or math libraries like [algebrite](http://algebrite.org/) and [algebra.js](http://algebra.js.org/)

## Example

```javascript
const AlgebraLatex = require('algebra-latex')

const latexInput = '\\frac{1}{\\sqrt{2}}\\cdot x=10'
const algebraObj = new AlgebraLatex(latexInput)

console.log(algebraObj.toMath()) // output: 1/sqrt(2)*x=10
```

### Parse to other libraries

**Supported libraries**

- [algebra.js](http://algebra.js.org/)
- [algebrite](http://algebrite.org/)
- [coffeequate](http://coffeequate.readthedocs.io/)

> NOTE: The above libraries are optional, and have to be installed before use

_continuing from example above_

```javascript
...

var algebraJS = require('algebra.js')
var algebrite = require('algebrite')
var coffeequate = require('coffeequate')

// For algebra.js
algebraObj.toAlgebra(algebraJS) // Will either return an algebra.js expression or equation

// For algebrite
algebraObject.toAlgebrite(algebrite)

// For coffequate
algebraObject.toCoffeequate(coffeequate)
```
