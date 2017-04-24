<template>
  <div
    class="q-message"
    :class="{
      'message-sent': sent,
      'message-received': !sent
    }"
  >
    <p v-if="label" class="q-message-label text-center" v-html="label"></p>

    <div v-if="text" class="q-message-container row items-end">
      <slot name="avatar">
        <img class="q-message-avatar" :src="avatar">
      </slot>
      <div class="column">
        <div v-if="name" class="q-message-name" v-html="name"></div>
        <div
          v-for="(msg, index) in text"
          :key="msg"
          class="q-message-text"
        >
          <div v-html="msg"></div>
          <div class="q-message-stamp" v-html="stamp"></div>
        </div>
        <div v-if="$slots.default" class="q-message-text">
          <slot></slot>
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

    name: String,
    avatar: String,
    text: Array,
    stamp: String
  }
}
</script>
