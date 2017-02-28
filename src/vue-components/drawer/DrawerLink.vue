<template>
  <router-link
    ref="link"
    tag="div"
    :to="to"
    :exact="exact"
    :append="append"
    :replace="replace"
    class="item link"
    event="drawerlinkclick"
    v-ripple.mat
    @click.native="__trigger"
  >
    <div v-if="icon" class="item-primary"><i>{{icon}}</i></div>
    <div class="item-content text">
      <div class="ellipsis">
        <slot></slot>
      </div>
    </div>
  </router-link>
</template>

<script>
const evt = new Event('drawerlinkclick')

export default {
  props: {
    icon: String,
    to: {
      type: [String, Object],
      required: true
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean
  },
  inject: ['closeDrawer'],
  methods: {
    __trigger () {
      this.closeDrawer(() => {
        this.$el.dispatchEvent(evt)
      }, true)
    }
  }
}
</script>
