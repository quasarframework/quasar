<template>
  <div
    class="item"
    :class="{
      active: active || cfg.active,
      dense: dense || cfg.dense,
      large: large || cfg.large,
      link: link || cfg.link,
      highlight: highlight || cfg.highlight,
      'multiple-lines': multipleLines || cfg.multipleLines,
    }"
    v-ripple.mat="noRipple"
  >
    <div v-if="hasPrimary" class="item-primary">
      <slot name="primary">
        <i v-if="icon">{{ icon }}</i>
        <div v-else-if="letter" class="item-letter">{{ letter }}</div>
        <img v-else-if="avatar" class="avatar" :src="avatar" />
        <img v-else-if="img" :src="img" />
      </slot>
    </div>
    <div
      class="item-content"
      :class="{
        text: text || cfg.text,
        inset: inset || cfg.inset,
        delimiter: delimiter || cfg.delimiter,
        'inset-delimiter': insetDelimiter || cfg.insetDelimiter
      }"
    >
      <slot></slot>
    </div>
    <div v-if="hasSecondary" class="item-secondary">
      <slot name="secondary">
        <div v-if="stamp" class="item-stamp">{{ stamp}}</div>
        <i v-if="secondIcon">{{ secondIcon }}</i>
        <div v-else-if="secondLetter" class="item-letter">{{ secondLetter }}</div>
        <img v-else-if="secondAvatar" class="avatar" :src="secondAvatar" />
        <img v-else-if="secondImg" :src="secondImg" />
      </slot>
    </div>
  </div>
</template>

<script>
export default {
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
      return this.$slots.primary || this.icon || this.avatar || this.img || this.letter
    },
    hasSecondary () {
      return this.$slots.secondary || this.secondIcon || this.secondAvatar || this.secondImg || this.secondLetter
    }
  }
}
</script>
