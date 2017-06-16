<template>
  <li class="q-tree-item">
    <div
      class="row inline items-center"
      :class="{'q-tree-link': model.handler || isExpandable}"
      @click="toggle"
    >
      <div class="q-tree-label relative-position row items-center" v-ripple.mat>
        <q-icon v-if="model.icon" :name="model.icon" class="on-left"></q-icon>
        <span v-html="model.title"></span>
      </div>
      <span v-if="isExpandable" class="on-right" v-html="model.expanded ? contractHtml : expandHtml"></span>
    </div>
    <q-slide-transition>
      <ul v-show="isExpandable && model.expanded">
        <q-tree-item v-for="item in model.children" :key="item" :model="item" :contract-html="contractHtml" :expand-html="expandHtml"></q-tree-item>
      </ul>
    </q-slide-transition>
  </li>
</template>

<script>
import { QIcon } from '../icon'
import { QSlideTransition } from '../slide-transition'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-tree-item',
  components: {
    QIcon,
    QSlideTransition
  },
  directives: {
    Ripple
  },
  props: ['model', 'contractHtml', 'expandHtml'],
  methods: {
    toggle () {
      if (this.isExpandable) {
        this.model.expanded = !this.model.expanded
        return
      }

      if (typeof this.model.handler === 'function') {
        this.model.handler(this.model)
      }
    }
  },
  computed: {
    isExpandable () {
      return this.model.children && this.model.children.length
    }
  }
}
</script>
