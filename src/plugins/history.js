import Platform from './platform'

export default {
  __history: [],
  add: () => {},
  remove: () => {},

  __installed: false,
  install () {
    if (this.__installed || !Platform.is.cordova) {
      return
    }

    this.__installed = true
    this.add = definition => {
      console.log('pushing', definition.handler)
      this.__history.push(definition)
    }
    this.remove = definition => {
      console.log('removing', definition.handler)
      const index = this.__history.indexOf(definition)
      if (index >= 0) {
        this.__history.splice(index, 1)
      }
    }

    document.addEventListener('deviceready', () => {
      console.log('installing')
      document.addEventListener('backbutton', () => {
        console.log('backbutton')
        if (this.__history.length) {
          console.log('backbutton we have history')
          const fn = this.__history.pop().handler
          console.log('backbutton executing', fn)
          fn()
        }
        else {
          console.log('backbutton go(-1)')
          window.history.back()
        }
      }, false)
    })
  }
}
