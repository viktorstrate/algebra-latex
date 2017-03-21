import assert from 'assert'
import AlgebraLatex from '../src/index'

import algebraJS from 'algebra.js'
import algebrite from 'algebrite'
import coffeequate from 'coffeequate'

describe('API tests', () => {
  const latexEquation = 'x+\\frac{2}{3}-4=8'
  const algebraEquation = new AlgebraLatex(latexEquation)

  const latexExpression = 'x\\cdot\\frac{3}{9}'
  const algebraExpression = new AlgebraLatex(latexExpression)

  const mathEquation = algebraEquation.toMath()
  const mathExpression = algebraExpression.toMath()

  it('should parse math equation', () => {
    assert.equal(mathEquation, 'x+(2)/(3)-4=8')
  })

  it('should parse math expression', () => {
    assert.equal(mathExpression, 'x*(3)/(9)')
  })

  describe('algebra.js', () => {
    const algebraJSEquation = algebraEquation.toAlgebra()
    const algebraJSExpression = algebraExpression.toAlgebra()

    it('should solve equation', () => {
      assert.equal(algebraJSEquation.solveFor('x').toString(), '34/3')
    })

    it('should solve expression', () => {
      assert.equal(algebraJSExpression.toString(), '1/3x')
    })
  })

  describe('algebrite', () => {
    const algebriteExpression = algebraExpression.toAlgebrite()
    const algebriteEquation = algebraEquation.toAlgebrite()

    it('should solve expression', () => {
      assert.equal(algebriteExpression.toString(), '1/3 x')
    })

    it('should fail to parse equation', () => {
      assert.throws(() => { throw algebriteEquation }, /Algebrite can not handle equations, only expressions/)
    })
  })

  describe('coffeequate', () => {
    const coffeequateEquation = algebraEquation.toCoffeequate()
    const coffeequateExpression = algebraExpression.toCoffeequate()

    it('should solve equation', () => {
      assert.equal(coffeequateEquation.toString(), '8 - 10/-3 + x')
    })

    it('should solve expression', () => {
      assert.equal(coffeequateExpression.toString(), 'x/3')
    })
  })
})
