<template>
  <router-link
    tag="div"
    :to="to"
    :replace="replace"
    :append="append"
    :exact="exact"
    :event="routerLinkEventName"
    class="q-tab items-center justify-center relative-position"
    :class="{
      active: active,
      hidden: hidden,
      disabled: disable,
      'icon-and-label': icon && label,
      'hide-icon': hide === 'icon',
      'hide-label': hide === 'label'
    }"
    v-ripple.mat
    @click.native="select"
  >
    <i v-if="icon" class="q-tabs-icon">{{icon}}</i>
    <span v-if="label" class="q-tab-label" v-html="label"></span>
    <div v-if="alert" class="q-dot"></div>
    <slot></slot>
    <div class="q-tab-border"></div>
  </router-link>
</template>

<script>
import { RouterLinkMixin, routerLinkEvent } from '../../utils/router-link'
import TabMixin from './tab-mixin'

export default {
  mixins: [TabMixin, RouterLinkMixin],
  watch: {
    $route () {
      this.checkIfSelected()
    }
  },
  methods: {
    select () {
      this.$el.dispatchEvent(routerLinkEvent)
      this.selectTab(this.name)
    },
    checkIfSelected () {
      this.$nextTick(() => {
        if (this.$el.classList.contains('router-link-active')) {
          this.selectTab(this.name)
        }
      })
    }
  },
  created () {
    this.checkIfSelected()
  }
}
</script>
