const Parser = (latexMath) => {
  const rawLatex = latexMath

  const getRawLatex = () => {
    return rawLatex
  }

  const mathified = () => {
    return ''
  }

  return {
    getRawLatex,
    mathified
  }
}

export default Parser
