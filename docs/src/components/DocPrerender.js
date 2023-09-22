import { h, ref, computed } from 'vue'
import { QCard, QTabs, QTab, QTabPanels, QSeparator } from 'quasar'

export default {
  props: {
    title: String,
    tabs: Array
  },

  setup (props, { slots }) {
    const currentTab = ref(props.tabs !== void 0 ? props.tabs[ 0 ] : null)

    const hasHeader = computed(() => props.title !== void 0 || props.tabs !== void 0)
    const classes = computed(() => (
      hasHeader.value === true
        ? { root: null, content: 'relative-position' }
        : { root: 'relative-position', content: null }
    ))

    function getContent () {
      const acc = []

      props.title !== void 0 && acc.push(
        h('div', { class: 'header-toolbar row items-center' }, [
          h('div', { class: 'doc-card-title q-my-xs q-mr-sm' }, props.title)
        ])
      )

      props.tabs !== void 0 && acc.push(
        h(QTabs, {
          class: 'header-tabs',
          align: 'left',
          activeColor: 'brand-primary',
          indicatorColor: 'brand-primary',
          dense: true,
          breakpoint: 0,
          shrink: true,
          modelValue: currentTab.value,
          'onUpdate:modelValue': v => { currentTab.value = v }
        }, () => props.tabs.map(
          tab => h(QTab, { name: tab, class: 'header-btn', noCaps: true }, () => tab)
        ))
      )

      hasHeader.value === true && acc.push(
        h(QSeparator)
      )

      if (props.tabs !== void 0) {
        acc.push(
          h(QTabPanels, {
            animated: true,
            modelValue: currentTab.value
          }, slots.default)
        )
      }
      else if (classes.value.content !== null) {
        acc.push(
          h('div', { class: classes.value.content }, slots.default())
        )
      }
      else {
        acc.push(
          slots.default()
        )
      }

      return acc
    }

    return () => h(QCard, { flat: true, bordered: true, class: classes.value.root }, getContent)
  }
}
