<template>
  <router-link
    tag="div"
    :to="to"
    :replace="replace"
    :append="append"
    :exact="exact"
    :event="routerLinkEventName"
    class="q-tab column items-center justify-center relative-position"
    :class="classes"
    v-ripple.mat
    @click.native="select"
  >
    <q-icon :name="icon" v-if="icon" class="q-tab-icon"></q-icon>
    <span v-if="label" class="q-tab-label" v-html="label"></span>
    <span v-if="count" class="floating label circular">{{count}}</span>
    <div v-else-if="alert" class="q-dot"></div>

    <slot></slot>

    <div
      v-if="$q.theme !== 'ios'"
      class="q-tabs-bar"
      :style="barStyle"
    ></div>
  </router-link>
</template>

<script>
import { RouterLinkMixin, routerLinkEvent } from '../../utils/router-link'
import TabMixin from './tab-mixin'
import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'

export default {
  name: 'q-route-tab',
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  mixins: [TabMixin, RouterLinkMixin],
  watch: {
    $route () {
      this.checkIfSelected()
    }
  },
  methods: {
    select () {
      if (!this.disable) {
        this.$el.dispatchEvent(routerLinkEvent)
        this.selectTab(this.name)
      }
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
