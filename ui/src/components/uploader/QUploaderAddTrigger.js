import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QUploaderAddTrigger',

  inject: {
    __qUploaderGetInput: {
      default () {
        console.error('QUploaderAddTrigger needs to be child of QUploader')
      }
    }
  },

  render () {
    return this.__qUploaderGetInput()
  }
})
