import formatter from '../src/formatter'
import assert from 'assert'

describe('formatter', () => {
  it('should format latex', () => {
    const parsedLatex = [
      {
        type: 'token',
        value: 'frac'
      },
      {
        type: 'group',
        value: [
          {
            type: 'number',
            value: '2'
          },
          {
            type: 'operator',
            value: '^'
          },
          {
            type: 'group',
            value: [
              {
                type: 'number',
                value: '3'
              }
            ]
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
            type: 'operator',
            value: '+'
          },
          {
            type: 'number',
            value: '3'
          }
        ]
      }
    ]

    assert.equal(formatter(parsedLatex), '((2^(3)+3)/(+3))', 'Should format valid object')
  })

  describe('error handling', () => {
    it('Should return error for fragments', () => {
      const latex1 = [
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
            }
          ]
        },
        {
          type: 'number',
          value: '2'
        }
      ]

      const latex2 = [
        {
          type: 'token',
          value: 'frac'
        },
        {
          type: 'number',
          value: '2'
        }
      ]

      const expectedError = /Fraction must have 2 following parameters/

      assert.throws(() => { throw formatter(latex1) }, expectedError, 'Example with one parameter following fraction')
      assert.throws(() => { throw formatter(latex2) }, expectedError, 'Example with no parameters following fraction')
    })
  })
})
