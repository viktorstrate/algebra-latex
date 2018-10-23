import assert from 'assert'

import algebraJS from 'algebra.js'
import algebrite from 'algebrite'
import coffeequate from 'coffeequate'

import AlgebraLatex from '../src/index'

describe('API tests', () => {
  const latexEquation = 'x+\\frac{2}{3}-4=8'
  const algebraEquation = new AlgebraLatex(latexEquation)

  const latexExpression = 'x\\cdot\\frac{3}{9}'
  const algebraExpression = new AlgebraLatex(latexExpression)

  const mathEquation = algebraEquation.toMath()
  const mathExpression = algebraExpression.toMath()

  it('should parse math equation', () => {
    assert.equal(mathEquation, 'x+2/3-4=8')
  })

  it('should parse math expression', () => {
    assert.equal(mathExpression, 'x*3/9')
  })

  it('format latex equation', () => {
    assert.equal(algebraEquation.toLatex(), 'x+\\frac{2}{3}-4=8')
  })

  it('format latex expression', () => {
    assert.equal(algebraExpression.toLatex(), 'x\\cdot \\frac{3}{9}')
  })

  it('chain functions', () => {
    const result = new AlgebraLatex().parseMath('1/sqrt(2)').toLatex()
    assert.equal(result, '\\frac{1}{\\sqrt\\left(2\\right)}')
  })

  describe('algebra.js', () => {
    const algebraJSEquation = algebraEquation.toAlgebra(algebraJS)
    const algebraJSExpression = algebraExpression.toAlgebra(algebraJS)

    it('should solve equation', () => {
      assert.equal(algebraJSEquation.solveFor('x').toString(), '34/3')
    })

    it('should solve expression', () => {
      assert.equal(algebraJSExpression.toString(), '1/3x')
    })

    it('should parse greek letters correctly', () => {
      const latex = '\\alpha + \\alpha - \\Delta'
      const obj = new AlgebraLatex(latex)

      assert.equal(obj.toAlgebra(algebraJS).toTex(), '2\\alpha - \\Delta')
    })
  })

  describe('algebrite', () => {
    const algebriteExpression = algebraExpression.toAlgebrite(algebrite)
    const algebriteEquation = algebraEquation.toAlgebrite(algebrite)

    it('should solve expression', () => {
      assert.equal(algebriteExpression.toString(), '1/3 x')
    })

    it('should fail to parse equation', () => {
      assert.throws(() => {
        throw algebriteEquation
      }, /Algebrite can not handle equations, only expressions/)
    })

    it('should parse greek letters correctly', () => {
      const latex = '\\alpha + \\alpha - \\Delta'
      const obj = new AlgebraLatex(latex)

      assert.equal(obj.toAlgebrite(algebrite).toString(), '-Delta + 2 alpha')
    })
  })

  describe('coffeequate', () => {
    const coffeequateEquation = algebraEquation.toCoffeequate(coffeequate)
    const coffeequateExpression = algebraExpression.toCoffeequate(coffeequate)

    it('should solve equation', () => {
      assert.equal(coffeequateEquation.toString(), '8 - 10/-3 + x')
    })

    it('should solve expression', () => {
      assert.equal(coffeequateExpression.toString(), 'x/3')
    })
  })
})
