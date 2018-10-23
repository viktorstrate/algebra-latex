#!/usr/bin/env node

const AlgebraLatex = require('./index')

const args = process.argv

main()

function main() {
  if (args[2] == '-l' || args[2] == '--latex') {
    if (args.length != 4) {
      return printHelp()
    }

    const latexInput = args[3]
    const algebraLatex = new AlgebraLatex(latexInput)

    return printResult(algebraLatex)
  }

  if (args[2] == '-m' || args[2] == '--math') {
    if (args.length != 4) {
      return printHelp()
    }

    const mathInput = args[3]
    const algebraLatex = new AlgebraLatex()
    algebraLatex.parseMath(mathInput)

    return printResult(algebraLatex)
  }

  printHelp()
}

function printResult(algebraLatex) {
  console.log(`     latex: ${algebraLatex.toLatex()}`)
  console.log(`ascii math: ${algebraLatex.toMath()}`)
}

function printHelp() {
  console.log(`usage: algebra-latex [-l latex][-m math]`)
  console.log('                     [-l]: convert from latex')
  console.log('                     [-m]: convert from math string')
}
