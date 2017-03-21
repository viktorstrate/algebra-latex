import * as greekLetters from '../src/tokens/greek-letters'
import assert from 'assert'

describe('greek letters', () => {
  const lowerName = 'delta'
  const lowerSymbol = 'δ'

  const upperName = 'Delta'
  const upperSymbol = 'Δ'

  describe('get upper and lower case', () => {
    it('should get lower name of symbol', () => {
      assert.equal(greekLetters.getName(lowerSymbol), lowerName)
    })

    it('should get lower symbol of name', () => {
      assert.equal(greekLetters.getSymbol(lowerName), lowerSymbol)
    })

    it('should get upper name of symbol', () => {
      assert.equal(greekLetters.getName(upperSymbol), upperName)
    })

    it('should get upper symbol of name', () => {
      assert.equal(greekLetters.getSymbol(upperName), upperSymbol)
    })
  })

  describe('functors', () => {
    it('should determine case of symbol', () => {
      assert(greekLetters.isUpperCase(upperSymbol))
      assert(!greekLetters.isUpperCase(lowerSymbol))
    })

    it('should determine case of name', () => {
      assert(greekLetters.isUpperCase(upperName))
      assert(!greekLetters.isUpperCase(lowerName))
    })

    it('should set name to uppercase', () => {
      assert.equal(greekLetters.toUpperCase(lowerName), upperName)
    })

    it('should set symbol to uppercase', () => {
      assert.equal(greekLetters.toUpperCase(lowerSymbol), upperSymbol)
    })
  })

  describe('invalid input', () => {
    it('should fail to find invalid symbol', () => {
      assert.equal(greekLetters.getSymbol('nonSymbol'), null)
    })

    it('should fail to find invalid name', () => {
      assert.equal(greekLetters.getName('noName'), null)
    })
  })
})
