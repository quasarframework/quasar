import createUploaderComponent from '../../utils/create-uploader-component/create-uploader-component.js'
import xhrUploaderPlugin from './xhr-uploader-plugin.js'

/**
 * Slot for custom header; Scope is the QUploader instance itself
 *
 * @api slot header
 * @scope ...self {Component} QUploader instance
 */

/**
 * Slot for custom list; Scope is the QUploader instance itself
 *
 * @api slot list
 * @scope ...self {Component} QUploader instance
 */
export default createUploaderComponent(xhrUploaderPlugin)
