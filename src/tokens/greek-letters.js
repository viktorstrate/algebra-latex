export const letters = [
  {
    name: 'alpha',
    symbol: 'α'
  }, {
    name: 'beta',
    symbol: 'β'
  }, {
    name: 'gamma',
    symbol: 'γ'
  }, {
    name: 'delta',
    symbol: 'δ'
  }, {
    name: 'epsilon',
    symbol: 'ϵ'
  }, {
    name: 'zeta',
    symbol: 'ζ'
  }, {
    name: 'eta',
    symbol: 'η'
  }, {
    name: 'theta',
    symbol: 'θ'
  }, {
    name: 'iota',
    symbol: 'ι'
  }, {
    name: 'kappa',
    symbol: 'κ'
  }, {
    name: 'lambda',
    symbol: 'λ'
  }, {
    name: 'mu',
    symbol: 'μ'
  }, {
    name: 'nu',
    symbol: 'ν'
  }, {
    name: 'omicron',
    symbol: 'ο'
  }, {
    name: 'pi',
    symbol: 'π'
  }, {
    name: 'rho',
    symbol: 'ρ'
  }, {
    name: 'sigma',
    symbol: 'σ'
  }, {
    name: 'tau',
    symbol: 'τ'
  }, {
    name: 'upsilon',
    symbol: 'υ'
  }, {
    name: 'phi',
    symbol: 'ϕ'
  }, {
    name: 'chi',
    symbol: 'χ'
  }, {
    name: 'psi',
    symbol: 'ψ'
  }, {
    name: 'omega',
    symbol: 'ω'
  }
]

export function toUpperCase (x) {
  return x.charAt(0).toUpperCase() + x.slice(1)
}

export function isUpperCase (x) {
  return x.charAt(0).toUpperCase() === x.charAt(0)
}

export function getSymbol (name) {
  let symbol = letters.find((x) => x.name === name.toLowerCase())
  if (symbol == null) return null
  symbol = symbol.symbol
  if (isUpperCase(name)) symbol = toUpperCase(symbol)
  return symbol
}

export function getName (symbol) {
  let name = letters.find((x) => x.symbol === symbol.toLowerCase())
  if (name == null) return null
  name = name.name
  if (isUpperCase(symbol)) name = toUpperCase(name)
  return name
}
