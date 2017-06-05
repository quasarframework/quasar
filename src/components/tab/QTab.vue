<template>
  <div
    class="q-tab column items-center justify-center relative-position"
    :class="classes"
    @click="select"
    v-ripple.mat
  >
    <q-icon v-if="icon" :name="icon" class="q-tab-icon"></q-icon>
    <span v-if="label" class="q-tab-label" v-html="label"></span>
    <q-chip v-if="count" floating>{{count}}</q-chip>
    <div v-else-if="alert" class="q-dot"></div>

    <slot></slot>

    <div
      v-if="$q.theme !== 'ios'"
      class="q-tab-border"
      :class="borderClasses"
    ></div>
  </div>
</template>

<script>
import TabMixin from './tab-mixin'
import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'

export default {
  name: 'q-tab',
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  mixins: [TabMixin],
  props: {
    default: Boolean
  },
  methods: {
    select () {
      if (!this.disable) {
        this.selectTab(this.name)
      }
    }
  },
  mounted () {
    if (this.default && !this.disable) {
      this.select()
    }
  }
}
</script>
