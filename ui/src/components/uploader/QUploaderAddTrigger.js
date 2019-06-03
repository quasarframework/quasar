import Vue from 'vue'

export default Vue.extend({
  name: 'WUploaderAddTrigger',

  inject: {
    __qUploaderGetInput: {
      default () {
        console.error('WUploaderAddTrigger needs to be child of WUploader')
      }
    }
  },

  render (h) {
    return this.__qUploaderGetInput(h)
  }
})
