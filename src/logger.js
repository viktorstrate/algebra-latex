const debug = (msg) => {
  if (process.env.TEX_DEBUG) {
    console.log(msg)
  }
}

export default {
  debug
}
