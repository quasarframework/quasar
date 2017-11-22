<template>
  <div
    class="q-collapsible q-item-division relative-position"
    :class="[
      `q-collapsible-${showing ? 'opened' : 'closed'}`,
      {
        'q-item-separator': separator,
        'q-item-inset-separator': insetSeparator
      }
    ]"
  >
    <q-item-wrapper :class="{disabled: disable}" :cfg="cfg" @click="__toggleItem" v-ripple.mat="!iconToggle && !disable">
      <div
        slot="right"
        class="cursor-pointer relative-position inline-block"
        @click.stop="__toggle"
        v-ripple.mat.stop="iconToggle"
      >
        <q-item-tile
          icon="keyboard_arrow_down"
          class="transition-generic"
          :class="{'rotate-180': showing, invisible: disable}"
        ></q-item-tile>
      </div>
    </q-item-wrapper>

    <q-slide-transition>
      <div v-show="showing">
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
import ModelToggleMixin from '../../mixins/model-toggle'

const eventName = 'q:collapsible:close'

export default {
  name: 'q-collapsible',
  mixins: [ModelToggleMixin],
  noShowingHistory: true, // required by ModelToggleMixin
  components: {
    QItemWrapper,
    QItemTile,
    QSlideTransition
  },
  directives: {
    Ripple
  },
  props: {
    disable: Boolean,
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
  watch: {
    showing (val) {
      if (val && this.group) {
        this.$root.$emit(eventName, this)
      }
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
    __toggle () {
      if (!this.disable) {
        this.toggle()
      }
    },
    __toggleItem () {
      if (!this.iconToggle && !this.disable) {
        this.toggle()
      }
    },
    __eventHandler (comp) {
      if (this.group && this !== comp && comp.group === this.group) {
        this.hide()
      }
    }
  },
  created () {
    this.$root.$on(eventName, this.__eventHandler)
  },
  mounted () {
    if (this.value) {
      this.show()
    }
  },
  beforeDestroy () {
    this.$root.$off(eventName, this.__eventHandler)
  }
}
</script>
