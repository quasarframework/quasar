<template>
  <div
    class="q-message"
    :class="{
      'q-message-sent': sent,
      'q-message-received': !sent
    }"
  >
    <template v-if="label">
      <p v-if="safe" class="q-message-label text-center" v-html="label"></p>
      <p v-else class="q-message-label text-center">{{label}}</p>
    </template>

    <div v-if="avatar" class="q-message-container row items-end no-wrap">
      <slot name="avatar">
        <img class="q-message-avatar" :src="avatar">
      </slot>
      <div class="column">
        <template v-if="name">
          <div v-if="safe" class="q-message-name" v-html="name"></div>
          <div v-else class="q-message-name">{{name}}</div>
        </template>
        <div
          v-for="msg in text"
          :key="msg"
          class="q-message-text"
          :class="messageClass"
        >
          <span class="q-message-text-content" :class="textClass">
            <div v-html="msg"></div>
            <template v-if="stamp">
              <div v-if="safe" class="q-message-stamp" v-html="stamp"></div>
              <div v-else class="q-message-stamp">{{stamp}}</div>
            </template>
          </span>
        </div>
        <div v-if="!text || !text.length" class="q-message-text" :class="messageClass">
          <span class="q-message-text-content" :class="textClass">
            <slot></slot>
            <template v-if="stamp">
              <div v-if="safe" class="q-message-stamp" v-html="stamp"></div>
              <div v-else class="q-message-stamp">{{stamp}}</div>
            </template>
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
    stamp: String,
    safe: Boolean
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
