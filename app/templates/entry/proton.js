/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * Please whitelist these API functions in quasar.conf.js
 *
 **/

/**
 * @module proton
 * @description This API interface makes powerful interactions available
 * to be run on client side applications. They are opt-in features, and
 * must be enabled in quasar.conf.js
 *
 * Each binding MUST provide these interfaces in order to be compliant,
 * and also whitelist them based upon the developer's settings.
 */

import { uid } from 'quasar'

<% if (ctx.dev) { %>
/**
 * @name __whitelistWarning
 * @description Present a stylish warning to the developer that their API
 * call has not been whitelisted in quasar.conf.js
 * @param {String} func - function name to warn
 * @private
 */
const __whitelistWarning = function (func) {
  console.warn('%c[Proton] Danger \nproton.' + func + ' not whitelisted 💣\n%c\nAdd to quasar.conf.js: \n\nproton: \n  whitelist: { \n    ' + func + ': true \n\nReference: https://quasar.dev/quasar-cli/creating-proton-apps/api#' + func , 'background: red; color: white; font-weight: 800; padding: 2px; font-size:1.5em', ' ')
}
<% } %>

/**
 * @name __reject
 * @description is a private promise used to deflect un-whitelisted proton API calls
 * Its only purpose is to maintain thenable structure in client code without
 * breaking the application
 *  * @type {Promise<any>}
 * @private
 */
const __reject = new Promise((reject) => { reject })

export default class Proton {
<% if (ctx.dev) { %>
  /**
   * @name invoke
   * @description Calls a Quasar Core feature, such as setTitle
   * @param {Object} args
   */
<% } %>
  static invoke (args) {
  Object.freeze(args)
    external.invoke(JSON.stringify(args))
  }

<% if (ctx.dev) { %>
  /**
   * @name transformCallback
   * @description Registers a callback with a uid
   * @param {Function} callback
   * @returns {*}
   */
<% } %>
  static transformCallback (callback) {
    const identifier = Object.freeze(uid())
    window[identifier] = (result) => {
      delete window[identifier]
      callback(result)
    }
    return identifier
  }

<% if (ctx.dev) { %>
  /**
   * @name promisified
   * @description Turns a request into a chainable promise
   * @param {Object} args
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
   * @name readTextFile
   * @description Accesses a non-binary file on the user's filesystem
   * and returns the content. Permissions based on the app's PID owner
   * @param {String} path
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static readTextFile (path) {
  <% if (proton.whitelist.readTextFile === true || proton.whitelist.all === true) { %>
    Object.freeze(path)
    return this.promisified({ cmd: 'readAsString', path })
      <% } else { %>
  <% if (ctx.dev) { %>
      __whitelistWarning('readTextFile')
      <% } %>
    return __reject
      <% } %>
  }

<% if (ctx.dev) { %>
  /**
   * @name readBinaryFile
   * @description Accesses a binary file on the user's filesystem
   * and returns the content. Permissions based on the app's PID owner
   * @param {String} path
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static readBinaryFile (path) {
  <% if (proton.whitelist.readBinaryFile === true || proton.whitelist.all === true) { %>
    Object.freeze(path)
    return this.promisified({ cmd: 'readAsBinary', path })
      <% } else { %>
  <% if (ctx.dev) { %>
      __whitelistWarning('readBinaryFile')
      <% } %>
    return __reject
      <% } %>
  }

<% if (ctx.dev) { %>
  /**
   * @name writeFile
   * @description Write a file to the Local Filesystem.
   * Permissions based on the app's PID owner
   * @param {Object} cfg
   * @param {String} cfg.file
   * @param {String|Binary} cfg.contents
   */
<% } %>
  static writeFile (cfg) {
  Object.freeze(cfg)
  <% if (proton.whitelist.writeFile === true || proton.whitelist.all === true) { %>
    this.invoke({ cmd: 'write', file: cfg.file, contents: cfg.contents })
    <% } else { %>
  <% if (ctx.dev) { %>
      __whitelistWarning('writeFile')
      <% } %>
    return __reject
      <% } %>  }

<% if (ctx.dev) { %>
  /**
   * @name listFiles
   * @description Get the files in a path.
   * Permissions based on the app's PID owner
   * @param {String} path
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static listFiles (path) {
  <% if (proton.whitelist.listFiles === true || proton.whitelist.all === true) { %>
    Object.freeze(path)
    return this.promisified({ cmd: 'list', path })
      <% } else { %>
  <% if (ctx.dev) { %>
      __whitelistWarning('listFiles')
      <% } %>
    return __reject
      <% } %>
  }

<% if (ctx.dev) { %>
  /**
   * @name listDirs
   * @description Get the directories in a path.
   * Permissions based on the app's PID owner
   * @param {String} path
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static listDirs (path) {
  <% if (proton.whitelist.listDirs === true || proton.whitelist.all === true) { %>
    Object.freeze(path)
    return this.promisified({ cmd: 'read', path })
      <% } else { %>
  <% if (ctx.dev) { %>
      __whitelistWarning('listDirs')
      <% } %>
    return __reject
      <% } %>
  }

<% if (ctx.dev) { %>
  /**
   * @name setTitle
   * @description Set the application's title
   * @param {String} title
   */
<% } %>
  static setTitle (title) {
    <% if (proton.whitelist.setTitle === true || proton.whitelist.all === true) { %>
    Object.freeze(title)
    this.invoke({ cmd: 'setTitle', title })
      <% } else { %>
  <% if (ctx.dev) { %>
      __whitelistWarning('setTitle')
      <% } %>
    return __reject
      <% } %>
  }

<% if (ctx.dev) { %>
  /**
   * @name execute
   * @description Execute a program with arguments.
   * Permissions based on the app's PID owner
   * @param {String} command
   * @param {String|Array} args
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static execute (command, args) {
    <% if (proton.whitelist.execute === true || proton.whitelist.all === true) { %>
    Object.freeze(command)
    if (typeof args === 'string' || typeof args === 'object') {
      Object.freeze(args)
    }
    return this.promisified({ cmd: 'execute', command, args: typeof (args) === 'string' ? [args] : args })
  <% } else { %>
  <% if (ctx.dev) { %>
    __whitelistWarning('execute')
    <% } %>
    return __reject
      <% } %>
  }

<% if (ctx.dev) { %>
  /**
   * @name bridge
   * @description Securely pass a message to the backend.
   * @example
   *  this.$q.proton.bridge('QBP/1/ping/client-1', 'pingback')
   * @param {String} command - a compressed, slash-delimited and
   * versioned API call to the backend.
   * @param {String|Object}payload
   * @returns {*|Promise<any>|Promise}
   */
<% } %>
  static bridge (command, payload) {
<% if (proton.whitelist.bridge === true || proton.whitelist.all === true) { %>
    Object.freeze(command)
    if (typeof args === 'string' || typeof args === 'object') {
      Object.freeze(payload)
    }
    return this.promisified({ cmd: 'bridge', command, payload: typeof (payload) === 'object' ? [payload] : payload })
<% } else { %>
<% if (ctx.dev) { %>
    __whitelistWarning('bridge')
<% } %>
      return __reject
<% } %>
  }
}
