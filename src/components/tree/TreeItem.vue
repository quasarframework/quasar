<template>
  <li class="q-tree-item">
    <div
      class="row inline items-center"
      :class="{'q-tree-link': hasHandler || isExpandable}"
    >
      <div @click="tap" class="q-tree-label relative-position row items-center" v-ripple.mat="hasHandler || isExpandable">
        <q-icon v-if="item.icon" :name="item.icon" class="on-left"></q-icon>
        <span v-if="item.safe" v-html="item.title"></span>
        <span v-else>{{item.title}}</span>
      </div>
      <span v-if="isExpandable" @click="toggle" class="on-right" v-html="item.expanded ? contractHtml : expandHtml"></span>
    </div>
    <q-slide-transition>
      <ul v-show="isExpandable && item.expanded">
        <q-tree-item
          v-for="item in item.children"
          :key="item.id || item.title"
          :model="item"
          :contract-html="contractHtml"
          :expand-html="expandHtml"
        ></q-tree-item>
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
  data () {
    return {
      item: {
        expanded: false,
        children: [],
        ...this.model
      }
    }
  },
  watch: {
    model (value) {
      this.item = {
        expanded: false,
        children: [],
        ...value
      }
    }
  },
  methods: {
    tap () {
      if (this.hasHandler) {
        return this.item.handler(this.model)
      }
      this.toggle()
    },
    toggle () {
      this.item.expanded = !this.item.expanded
    }
  },
  computed: {
    isExpandable () {
      return this.item.children && this.item.children.length > 0
    },
    hasHandler () {
      return typeof this.item.handler === 'function'
    }
  }
}
</script>
