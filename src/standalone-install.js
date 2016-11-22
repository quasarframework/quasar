export default function (Quasar) {
  // auto install in standalone mode
  if (typeof window !== 'undefined' && window.Vue) {
    if (!Quasar.theme.current) {
      Quasar.theme.set('mat')
    }

    window.Quasar = Quasar
    window.Vue.use(Quasar)
  }
}
