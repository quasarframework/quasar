/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * Please whitelist these API functions in quasar.conf.js
 *
 **/

import { uid } from 'quasar'
<% if (ctx.dev) { %>
/**
 *
 * @param {String} func - function name to warn
 * @private
 */
const __whitelistWarning = function (func) {
  console.warn('%c[Proton] Danger \nproton.' + func + ' not whitelisted 💣\n%c\nAdd to quasar.conf.js: \n\nproton: \n  whitelist: { \n    ' + func + ': true \n\nReference: https://quasar.dev/quasar-cli/creating-proton-apps/api#' + func , 'background: red; color: white; font-weight: 800; padding: 2px; font-size:1.5em', ' ')
}
<% } %>

/**
 *
 * @type {Promise<any>}
 * @private
 */
const __reject = new Promise((reject) => { reject })

/**
 *
 * @param name
 * @returns {boolean|*}
 * @private
 */
const __whitelist = function (name) {
  // seems that this isn't available in lodash.template :(
  return proton.whitelist[name] === true;
}

export default class Proton {

<% if (ctx.dev) { %>
  /**
   *
   * @param {Object} args
   */
<% } %>
  static invoke (args) {
    external.invoke(JSON.stringify(args))
  }


<% if (ctx.dev) { %>
  /**
   *
   * @param callback
   * @returns {*}
   */
<% } %>
  static transformCallback (callback) {
    const identifier = uid()
    window[identifier] = (result) => {
      delete window[identifier]
      callback(result)
    }
    return identifier
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param args
   * @returns {Promise<any>}
   */
<% } %>
  static promisified (args) {
    return new Promise((resolve, reject) => {
      this.invoke({
        callback: this.transformCallback(resolve),
        error: this.transformCallback(reject),
        ...args
      })
    })
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param path
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static readTextFile (path) {
  <% if (proton.whitelist.readTextFile === true) { %>
    return this.promisified({ cmd: 'readAsString', path })
  <% } %>
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param path
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static readBinaryFile (path) {
  <% if (proton.whitelist.readBinaryFile === true) { %>
    return this.promisified({ cmd: 'readAsBinary', path })
  <% } %>
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param cfg
   */
<% } %>
  static writeFile (cfg) {
  <% if (proton.whitelist.writeFile === true) { %>
    this.invoke({ cmd: 'write', file: cfg.file, contents: cfg.contents })
  <% } %>
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param path
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static listFiles (path) {
  <% if (proton.whitelist.listFiles === true) { %>
    return this.promisified({ cmd: 'list', path })
  <% } %>
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param path
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static listDirs (path) {
  <% if (proton.whitelist.listDirs === true) { %>
    return this.promisified({ cmd: 'read', path })
  <% } %>
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param title
   */
<% } %>
  static setTitle (title) {
    <% if (proton.whitelist.setTitle === true) { %>
      this.invoke({ cmd: 'setTitle', title })
    <% } %>
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param command
   * @param args
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static execute (command, args) {
    <% if (proton.whitelist.execute === true) { %>
    return this.promisified({ cmd: 'call', command, args: typeof (args) === 'string' ? [args] : args })
  <% } else { %>
  <% if (ctx.dev) { %>
    __whitelistWarning('execute')
    <% } %>
    return __reject
      <% } %>
  }

<% if (ctx.dev) { %>
  /**
   *
   * @param command
   * @param payload
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static bridge (command, payload) {
<% if (proton.whitelist.bridge === true) { %>
    return this.promisified({ cmd: 'bridge', command, payload: typeof (payload) === 'object' ? [payload] : payload })
<% } else { %>
<% if (ctx.dev) { %>
    __whitelistWarning('bridge')
<% } %>
      return __reject
<% } %>
  }
}
