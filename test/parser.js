import parser from '../src/parser'
import assert from 'assert'

describe('parser', () => {
  it('should parse basic latex example', () => {
    const latex = '\\sqrt{  \\frac{1\\cdot 2   + 3}{\\Delta t} -3 }* 54/399'

    const expectedVal = [
      {
        type: 'token',
        value: 'sqrt'
      }, {
        type: 'group',
        value: [
          {
            type: 'token',
            value: 'frac'
          },
          {
            type: 'group',
            value: [
              {
                type: 'number',
                value: '1'
              },
              {
                type: 'token',
                'value': 'cdot'
              },
              {
                type: 'number',
                value: '2'
              },
              {
                type: 'operator',
                value: '+'
              },
              {
                type: 'number',
                value: '3'
              }
            ]
          },
          {
            type: 'group',
            value: [
              {
                type: 'token',
                value: 'Delta'
              },
              {
                type: 'variable',
                value: 't'
              }
            ]
          },
          {
            type: 'operator',
            value: '-'
          },
          {
            type: 'number',
            value: '3'
          }
        ]
      },
      {
        type: 'operator',
        value: '*'
      },
      {
        type: 'number',
        value: '54'
      },
      {
        type: 'operator',
        value: '/'
      },
      {
        type: 'number',
        value: '399'
      }
    ]

    assert.deepEqual(parser(latex), expectedVal)
  })

  describe('greek letters', () => {
    it('should parse lower case', () => {
      const latex = '\\alpha\\delta\\gamma'

      const expected = [
        {
          type: 'token',
          value: 'alpha'
        }, {
          type: 'token',
          value: 'delta'
        }, {
          type: 'token',
          value: 'gamma'
        }
      ]

      assert.deepEqual(parser(latex), expected)
    })

    it('should parse upper case', () => {
      const latex = '\\Alpha\\Delta\\Gamma'

      const expected = [
        {
          type: 'token',
          value: 'Alpha'
        }, {
          type: 'token',
          value: 'Delta'
        }, {
          type: 'token',
          value: 'Gamma'
        }
      ]

      assert.deepEqual(parser(latex), expected)
    })
  })

  describe('error handling', () => {
    it('should return error for mismatched brackets', () => {
      const latex = '{{23}'

      const expectedError = /Brackets do not match up/

      assert.throws(() => { throw parser(latex) }, expectedError, 'mismatched brackets in the end')
    })
  })
})
