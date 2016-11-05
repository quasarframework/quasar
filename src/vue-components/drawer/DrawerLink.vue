<template>
  <div class="item item-link drawer-closer" @click.prevent.stop="click">
    <router-link
      ref="link"
      :to="to"
      :replace="replace"
      :append="append"
      :exact="exact"
      style="display: none"
      @click.stop
    ></router-link>
    <i v-if="icon" class="item-primary">{{icon}}</i>
    <div class="item-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['icon', 'to', 'replace', 'append', 'exact'],
  methods: {
    click () {
      setTimeout(() => {
        this.$refs.link.$el.click()
      }, 500)
    }
  }
}
</script>
