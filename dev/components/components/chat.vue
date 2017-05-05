<template>
  <div>
    <div class="layout-padding" style="max-width: 500px;">
      <q-chat-message
        v-for="msg in messages"
        :key="msg"
        :label="msg.label"
        :sent="msg.sent"
        :name="msg.name"
        :avatar="msg.avatar"
        :text="msg.text"
        :stamp="msg.stamp"
      />
      <div class="row">
        <q-input v-model="message" />
        <q-btn class="primary" @click="send">Send</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
const { format } = date

export default {
  data () {
    return {
      message: '',
      messages: [
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['How are you?'],
          avatar: '/statics/boy-avatar.png',
          stamp: 'Yesterday 13:34'
        },
        {
          name: 'Jane',
          text: ['I\'m good, thank you!', 'And you?'],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: 'Yesterday at 13:50'
        },
        {
          name: 'Jane',
          text: ['And you?'],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: 'Yesterday at 13:51'
        },
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['Fine. Nice weather today, right?', 'Hmm...'],
          avatar: '/statics/boy-avatar.png',
          stamp: '13:55'
        },

        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['How are you?'],
          avatar: '/statics/boy-avatar.png',
          stamp: 'Yesterday 13:34'
        },
        {
          name: 'Jane',
          text: ['I\'m good, thank you!', 'And you?'],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: 'Yesterday at 13:50'
        },
        {
          name: 'Jane',
          text: ['And you?'],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: 'Yesterday at 13:51'
        },
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['Fine. Nice weather today, right?', 'Hmm...'],
          avatar: '/statics/boy-avatar.png',
          stamp: '13:55'
        },

        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['How are you?'],
          avatar: '/statics/boy-avatar.png',
          stamp: 'Yesterday 13:34'
        },
        {
          name: 'Jane',
          text: ['I\'m good, thank you!', 'And you?'],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: 'Yesterday at 13:50'
        },
        {
          name: 'Jane',
          text: ['And you?'],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: 'Yesterday at 13:51'
        },
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['Fine. Nice weather today, right?', 'Hmm...'],
          avatar: '/statics/boy-avatar.png',
          stamp: '13:55'
        },

        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['How are you?'],
          avatar: '/statics/boy-avatar.png',
          stamp: 'Yesterday 13:34'
        },
        {
          name: 'Jane',
          text: ['I\'m good, thank you!', 'And you?'],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: 'Yesterday at 13:50'
        },
        {
          name: 'Jane',
          text: ['And you?'],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: 'Yesterday at 13:51'
        },
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['Fine. Nice weather today, right?', 'Hmm...'],
          avatar: '/statics/boy-avatar.png',
          stamp: '13:55'
        }
      ]
    }
  },
  methods: {
    send () {
      if (this.message.length) {
        this.messages.push({
          name: 'Jane',
          text: [this.message],
          sent: true,
          avatar: '/statics/linux-avatar.png',
          stamp: format(new Date(), 'HH:mm')
        })
      }
    }
  }
}
</script>
