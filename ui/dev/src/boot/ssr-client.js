
export default ({ router }) => {
  console.log('[Quasar] On route change we deliberately load page from server -- in order to test hydration errors')

  let reload = false
  router.beforeEach((to) => {
    if (reload) {
      setTimeout(() => {
        window.location.href = to.fullPath
      }, 0)
      return false
    }
    reload = true
    return true
  })
}
