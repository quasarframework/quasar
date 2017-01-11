<template>
  <div class="item" :class="itemClass">
    <i v-if="item.icon" class="item-primary">{{item.icon}}</i>
    <img v-if="item.img" class="item-primary thumbnail" :src="item.img" />

    <div class="item-content" :class="{'has-secondary': item.secondIcon || item.secondImg || item.stamp}">
      <div v-html="item.label"></div>
      <div v-if="item.secondLabel" v-html="item.secondLabel"></div>
    </div>

    <div v-if="item.stamp" class="item-secondary stamp" v-html="item.stamp"></div>
    <i v-if="item.secondIcon" class="item-secondary">{{item.secondIcon}}</i>
    <img v-if="item.secondImg" class="item-secondary thumbnail" :src="item.secondImg" />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    active: Boolean,
    link: Boolean
  },
  computed: {
    itemClass () {
      return {
        active: this.active,
        'item-link': this.link,
        'multiple-lines': this.item.multiline,
        'two-lines': !this.item.multiline && this.item.secondLabel
      }
    }
  }
}
</script>
