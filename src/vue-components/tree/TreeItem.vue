<template>
  <li class="quasar-tree-item">
    <div
      :class="{'quasar-tree-expandable-item': isExpandable, 'quasar-tree-link': model.handler}"
      @click="toggle"
    >
      <i v-if="model.icon">{{model.icon}}</i>
      <span class="quasar-tree-label">{{model.title}}</span>
      <span v-if="isExpandable" v-html="model.expanded ? contractHtml : expandHtml"></span>
    </div>
    <quasar-transition name="slide">
      <ul v-show="isExpandable && model.expanded">
        <quasar-tree-item v-for="item in model.children" :model="item" :contract-html="contractHtml" :expand-html="expandHtml"></quasar-tree-item>
      </ul>
    </quasar-transition>
  </li>
</template>

<script>
export default {
  name: 'quasar-tree-item',
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
