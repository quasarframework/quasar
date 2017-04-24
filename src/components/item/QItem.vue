<template>
  <div
    class="item"
    :class="{
      active: __prop('active'),
      dense: __prop('dense'),
      large: __prop('large'),
      link: __prop('link'),
      highlight: __prop('highlight'),
      'multiple-lines': __prop('multipleLines'),
    }"
    v-ripple.mat="noRipple"
  >
    <slot name="img">
      <img v-if="cImg" :src="cImg" />
    </slot>
    <div v-if="hasPrimary" class="item-primary">
      <slot name="primary">
        <q-icon :name="cIcon" v-if="cIcon"></q-icon>
        <div v-else-if="cLetter" class="item-letter">{{ cLetter }}</div>
        <img v-else-if="cAvatar" :src="cAvatar" />
      </slot>
    </div>
    <div
      class="item-content"
      :class="{
        text: hasText,
        inset: __prop('inset'),
        delimiter: __prop('delimiter'),
        'inset-delimiter': __prop('insetDelimiter')
      }"
    >
      <template v-if="cLabel">
        <div class="ellipsis" v-html="cLabel"></div>
        <div
          v-if="cDescription"
          class="ellipsis-2-lines"
          v-html="cDescription"
        ></div>
      </template>

      <slot v-else></slot>
    </div>
    <slot name="secondImg">
      <img v-if="cSecondImg" :src="cSecondImg" />
    </slot>
    <div v-if="hasSecondary" class="item-secondary">
      <slot name="secondary">
        <div v-if="cStamp" class="item-stamp" v-html="cStamp"></div>
        <q-icon :name="cSecondIcon" v-if="cSecondIcon"></q-icon>
        <div v-else-if="cSecondLetter" class="item-letter">{{ cSecondLetter }}</div>
        <img v-else-if="cSecondAvatar" class="avatar" :src="cSecondAvatar" />
      </slot>
    </div>
  </div>
</template>

<script>
import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'

export default {
  name: 'q-item',
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  props: {
    cfg: {
      type: Object,
      default () {
        return {}
      }
    },
    highlight: Boolean,
    link: Boolean,
    multipleLines: Boolean,
    text: Boolean,
    dense: Boolean,
    large: Boolean,
    delimiter: Boolean,
    inset: Boolean,
    insetDelimiter: Boolean,
    active: Boolean,
    noRipple: Boolean,

    label: String,
    description: String,

    icon: String,
    secondIcon: String,
    avatar: String,
    secondAvatar: String,
    img: String,
    secondImg: String,
    letter: String,
    secondLetter: String,
    stamp: String
  },
  computed: {
    hasPrimary () {
      return this.$slots.primary || this.__hasAnyProp('icon', 'avatar', 'letter')
    },
    hasSecondary () {
      return this.$slots.secondary || this.__hasAnyProp('secondIcon', 'secondAvatar', 'secondLetter', 'stamp')
    },
    hasText () {
      return this.text || this.cLabel
    },
    cLabel () {
      return this.__prop('label')
    },
    cDescription () {
      return this.__prop('description')
    },
    cIcon () {
      return this.__prop('icon')
    },
    cSecondIcon () {
      return this.__prop('secondIcon')
    },
    cAvatar () {
      return this.__prop('avatar')
    },
    cSecondAvatar () {
      return this.__prop('secondAvatar')
    },
    cImg () {
      return this.__prop('img')
    },
    cSecondImg () {
      return this.__prop('secondImg')
    },
    cStamp () {
      return this.__prop('stamp')
    },
    cLetter () {
      return this.__prop('letter')
    },
    cSecondLetter () {
      return this.__prop('secondLetter')
    }
  },
  methods: {
    __prop (prop) {
      return this[prop] || this.cfg[prop]
    },
    __hasAnyProp (...props) {
      return props.some(prop => this.__prop(prop))
    }
  }
}
</script>
