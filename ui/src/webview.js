import { uid } from 'quasar'

export default class WebView {
  static invoke (args) {
    external.invoke(JSON.stringify(args))
  }

  static transformCallback (callback) {
    const identifier = uid()
    window[identifier] = (result) => {
      delete window[identifier]
      callback(result)
    }
    return identifier
  }

  static promisified (args) {
    return new Promise((resolve, reject) => {
      this.invoke({
        callback: this.transformCallback(resolve),
        error: this.transformCallback(reject),
        ...args
      })
    })
  }

  static readTextFile (path) {
    return this.promisified({ cmd: 'readAsString', path })
  }

  static readBinaryFile (path) {
    return this.promisified({ cmd: 'readAsBinary', path })
  }

  static writeFile (cfg) {
    this.invoke({ cmd: 'write', file: cfg.file, contents: cfg.contents })
  }

  static listFiles (path) {
    return this.promisified({ cmd: 'list', path })
  }

  static listDirs (path) {
    return this.promisified({ cmd: 'read', path })
  }

  static setTitle (title) {
    this.invoke({ cmd: 'setTitle', title })
  }

  static execute (command, args) {
    return this.promisified({ cmd: 'call', command, args: typeof (args) === 'string' ? [args] : args })
  }
}
