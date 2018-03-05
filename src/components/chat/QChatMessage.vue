<template>
  <div
    class="q-message"
    :class="{
      'q-message-sent': sent,
      'q-message-received': !sent
    }"
  >

    <p v-if="label" class="q-message-label text-center" v-html="label"></p>

    <div class="q-message-container row items-end no-wrap">
      <slot v-if="hasAvatarSlot()" name="avatar"></slot>
      <img v-if='avatar && !hasAvatarSlot()' class="q-message-avatar" :src="avatar" />

      <div :class="sizeClass">
        <div v-if="name" class="q-message-name" v-html="name"></div>
        <template v-if="text">
          <div
            v-for="(msg, index) in text"
            :key="index"
            class="q-message-text"
            :class="messageClass"
          >
            <span class="q-message-text-content" :class="textClass">
              <div v-html="msg"></div>
              <div v-if="stamp" class="q-message-stamp" v-html="stamp"></div>
            </span>
          </div>
        </template>
        <div v-if="hasDefaultSlot()" class="q-message-text" :class="messageClass">
          <span class="q-message-text-content" :class="textClass">
            <slot></slot>
            <div v-if="stamp" class="q-message-stamp" v-html="stamp"></div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QChatMessage',
  props: {
    sent: Boolean,
    label: String,
    bgColor: String,
    textColor: String,
    name: String,
    avatar: String,
    text: Array,
    stamp: String,
    size: String
  },
  computed: {
    textClass () {
      if (this.textColor) {
        return `text-${this.textColor}`
      }
    },
    messageClass () {
      if (this.bgColor) {
        return `text-${this.bgColor}`
      }
    },
    sizeClass () {
      if (this.size) {
        return `col-${this.size}`
      }
    }
  },
  methods: {
    hasDefaultSlot () {
      return Boolean(this.$slots['default'])
    },
    hasAvatarSlot () {
      return Boolean(this.$slots['avatar'])
    }
  }
}
</script>
