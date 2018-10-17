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

  printHelp()
}

function printResult(algebraLatex) {
  console.log(`     latex: ${algebraLatex.texInput}`)
  console.log(`ascii math: ${algebraLatex.toMath()}`)
}

function printHelp() {
  console.log(`usage: algebra-latex [-l latex]`)
  console.log('                     [-l]: convert from latex')
}
