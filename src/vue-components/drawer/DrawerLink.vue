<template>
  <router-link
    ref="link"
    tag="div"
    :to="to"
    :exact="exact"
    :append="append"
    :replace="replace"
    class="item link"
    :event="routerLinkEventName"
    v-ripple.mat
    @click.native="trigger"
  >
    <slot name="item">
      <div v-if="icon" class="item-primary"><i>{{icon}}</i></div>
      <div class="item-content text">
        <div class="ellipsis">
          <slot></slot>
        </div>
      </div>
    </slot>
  </router-link>
</template>

<script>
import { RouterLinkMixin, routerLinkEvent } from '../../utils/router-link'

export default {
  mixins: [RouterLinkMixin],
  props: {
    icon: String
  },
  inject: ['closeDrawer'],
  methods: {
    trigger () {
      this.closeDrawer(() => {
        this.$el.dispatchEvent(routerLinkEvent)
      }, true)
    }
  }
}
</script>
