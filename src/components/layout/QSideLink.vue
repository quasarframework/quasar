<template>
  <router-link
    ref="link"
    :tag="tag"
    :to="to"
    :exact="exact"
    :append="append"
    :replace="replace"
    :event="routerLinkEventName"
    v-ripple.mat
    @click.native="trigger"
  >
    <slot></slot>
  </router-link>
</template>

<script>
import { RouterLinkMixin, routerLinkEvent } from '../../utils/router-link'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-side-link',
  directives: {
    Ripple
  },
  mixins: [RouterLinkMixin],
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  inject: ['layout'],
  methods: {
    trigger () {
      this.layout.hideCurrentSide(() => {
        this.$el.dispatchEvent(routerLinkEvent)
      })
    }
  }
}
</script>
