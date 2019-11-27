import Vue from 'vue'

export default Vue.extend({
  name: 'QUploaderAddTrigger',

  inject: {
    __qUploaderGetInput: {
      default () {
        console.error('QUploaderAddTrigger needs to be child of QUploader')
      }
    }
  },

  render (h) {
    return this.__qUploaderGetInput(h)
  }
})
