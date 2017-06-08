<template>
  <div
    class="q-message"
    :class="{
      'q-message-sent': sent,
      'q-message-received': !sent
    }"
  >
    <p v-if="label" class="q-message-label text-center" v-html="label"></p>

    <div v-if="avatar" class="q-message-container row items-end">
      <slot name="avatar">
        <img class="q-message-avatar" :src="avatar">
      </slot>
      <div class="column">
        <div v-if="name" class="q-message-name" v-html="name"></div>
        <div
          v-for="(msg, index) in text"
          :key="msg"
          class="q-message-text"
          :class="messageClass"
        >
          <span class="q-message-text-content" :class="textClass">
            <div v-html="msg"></div>
            <div v-if="stamp" class="q-message-stamp" v-html="stamp"></div>
          </span>
        </div>
        <div v-if="!text || !text.length" class="q-message-text" :class="messageClass">
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
  name: 'q-chat-message',
  props: {
    sent: Boolean,
    label: String,

    bgColor: String,
    textColor: String,

    name: String,
    avatar: String,
    text: Array,
    stamp: String
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
    }
  }
}
</script>
