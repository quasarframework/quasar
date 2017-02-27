<template>
  <div
    class="item"
    :class="{
      active: active || cfg.active,
      dense: dense || cfg.dense,
      'item-link': link || cfg.link,
      'highlight': highlight || cfg.highlight,
      'multiple-lines': multipleLines || cfg.multipleLines,
    }"
    v-ripple.mat="noRipple"
  >
    <div v-if="$slots.primary" class="item-primary" :class="{big: bigPrimary || cfg.bigPrimary}">
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
        'big-inset': bigInset || cfg.bigInset,
        delimiter: delimiter || cfg.delimiter,
        'inset-delimiter': insetDelimiter || cfg.insetDelimiter,
        'big-inset-delimiter': bigInsetDelimiter || cfg.bigInsetDelimiter
      }"
    >
      <slot></slot>
    </div>
    <div v-if="$slots.secondary" class="item-secondary" :class="{big: bigSecondary || cfg.bigSecondary}">
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
    delimiter: Boolean,
    inset: Boolean,
    bigInset: Boolean,
    insetDelimiter: Boolean,
    bigInsetDelimiter: Boolean,
    active: Boolean,
    bigPrimary: Boolean,
    bigSecondary: Boolean,
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
  }
}
</script>
