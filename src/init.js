export default function (Quasar) {
  // auto install in standalone mode
  if (typeof window !== 'undefined' && window.Vue) {
    window.Quasar = Quasar
    window.Vue.use(Quasar)
  }
}
