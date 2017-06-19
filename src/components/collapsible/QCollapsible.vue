<template>
  <div
    class="q-collapsible q-item-division relative-position"
    :class="{ 'q-item-separator': separator, 'q-item-inset-separator': insetSeparator }"
  >
    <q-item-wrapper :cfg="cfg" @click="__toggleItem" v-ripple.mat="!iconToggle">
      <div
        slot="right"
        class="cursor-pointer relative-position inline-block"
        @click.stop="toggle"
        v-ripple.mat.stop="iconToggle"
      >
        <q-item-tile
          icon="keyboard_arrow_down"
          class="transition-generic"
          :class="{'rotate-180': active}"
        ></q-item-tile>
      </div>
    </q-item-wrapper>

    <q-slide-transition>
      <div v-show="active">
        <div class="q-collapsible-sub-item relative-position" :class="{indent: indent}">
          <slot></slot>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>
import { QItemWrapper, QItemTile } from '../list'
import { QSlideTransition } from '../slide-transition'
import Ripple from '../../directives/ripple'
import Events from '../../features/events'

const eventName = 'q:collapsible:close'

export default {
  name: 'q-collapsible',
  components: {
    QItemWrapper,
    QItemTile,
    QSlideTransition
  },
  directives: {
    Ripple
  },
  props: {
    opened: Boolean,
    indent: Boolean,
    group: String,
    iconToggle: Boolean,

    dense: Boolean,
    sparse: Boolean,
    multiline: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,

    icon: String,
    image: String,
    avatar: String,
    letter: String,
    label: String,
    sublabel: String,
    labelLines: [String, Number],
    sublabelLines: [String, Number]
  },
  data () {
    return {
      active: this.opened
    }
  },
  watch: {
    opened (value) {
      this.active = value
    },
    active (val) {
      if (val && this.group) {
        Events.$emit(eventName, this)
      }

      this.$emit(val ? 'open' : 'close')
    }
  },
  computed: {
    cfg () {
      return {
        link: !this.iconToggle,

        dark: this.dark,
        dense: this.dense,
        sparse: this.sparse,
        multiline: this.multiline,

        icon: this.icon,
        image: this.image,
        avatar: this.avatar,
        letter: this.letter,

        label: this.label,
        sublabel: this.sublabel,
        labelLines: this.labelLines,
        sublabelLines: this.sublabelLines
      }
    }
  },
  methods: {
    toggle () {
      this.active = !this.active
    },
    open () {
      this.active = true
    },
    close () {
      this.active = false
    },
    __toggleItem () {
      if (!this.iconToggle) {
        this.toggle()
      }
    },
    __eventHandler (comp) {
      if (this.group && this !== comp && comp.group === this.group) {
        this.close()
      }
    }
  },
  created () {
    Events.$on(eventName, this.__eventHandler)
  },
  beforeDestroy () {
    Events.$off(eventName, this.__eventHandler)
  }
}
</script>
