const debug = msg => {
  if (typeof process === 'object') {
    if (process.env.TEX_DEBUG) {
      console.log(msg)
    }
  }
}

export default {
  debug,
}
