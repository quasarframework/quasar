import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'
import { PanelParentMixin } from '../../mixins/panel.js'

import { hDir } from '../../utils/render.js'

export default defineComponent({
  name: 'QTabPanels',

  mixins: [ DarkMixin, PanelParentMixin ],

  computed: {
    classes () {
      return 'q-tab-panels q-panel-parent' +
        (this.isDark === true ? ' q-tab-panels--dark q-dark' : '')
    }
  },

  methods: {
    __renderPanels () {
      return hDir(
        'div',
        { class: this.classes },
        this.__getPanelContent(),
        'pan',
        this.swipeable,
        () => this.panelDirectives
      )
    }
  }
})
