<template>
  <li class="q-tree-item">
    <div
      :class="{'q-tree-expandable-item': isExpandable, 'q-tree-link': model.handler}"
      @click="toggle"
    >
      <i v-if="model.icon">{{model.icon}}</i>
      <span class="q-tree-label">{{model.title}}</span>
      <span v-if="isExpandable" v-html="model.expanded ? contractHtml : expandHtml"></span>
    </div>
    <q-transition name="slide">
      <ul v-show="isExpandable && model.expanded">
        <q-tree-item v-for="item in model.children" :model="item" :contract-html="contractHtml" :expand-html="expandHtml"></q-tree-item>
      </ul>
    </q-transition>
  </li>
</template>

<script>
export default {
  name: 'q-tree-item',
  props: ['model', 'contract-html', 'expand-html'],
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
