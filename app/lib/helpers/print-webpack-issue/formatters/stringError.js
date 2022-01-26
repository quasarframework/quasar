const errRe = /Error: ([\w ]+): /

function extract (message) {
  const parts = message.match(errRe)

  if (parts === null) {
    return { title: '', message }
  }

  return {
    title: parts[1],
    message: message.substring(`Error: ${parts[1]}: `.length + 1)
  }
}

module.exports = function format (error, printLog, titleFn) {
  const { title, message } = extract(error.webpackError)

  printLog(titleFn(title))
  printLog()
  printLog(message)
}
