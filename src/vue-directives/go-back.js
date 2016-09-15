import Platform from '../platform'

export default {
  bind () {
    if (Platform.is.cordova) {
      this.goBack = () => {
        window.history.go(-1)
      }
    }
    else {
      this.goBack = () => {
        this.vm.$router.go(this.route)
      }
    }

    this.el.addEventListener('click', this.goBack)
  },
  update (route) {
    this.route = route
  },
  unbind () {
    this.el.removeEventListener('click', this.goBack)
  }
}
