<template>
  <router-link
    :tag="tag"
    :to="to"
    :exact="exact"
    :append="append"
    :replace="replace"
    :event="routerLinkEventName"
    :class="classes"
    v-ripple.mat
    @click.native="trigger"
  >
    <slot></slot>
  </router-link>
</template>

<script>
import { RouterLinkMixin, routerLinkEvent } from '../../utils/router-link'
import { ItemMixin, itemClasses } from '../list/list-utils'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-side-link',
  directives: {
    Ripple
  },
  mixins: [RouterLinkMixin, ItemMixin],
  props: {
    item: Boolean
  },
  inject: ['layout'],
  computed: {
    classes () {
      this.link = true
      return this.item ? itemClasses(this) : 'relative-position'
    }
  },
  methods: {
    trigger () {
      this.layout.hideCurrentSide(() => {
        this.$el.dispatchEvent(routerLinkEvent)
      })
    }
  }
}
</script>
