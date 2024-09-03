<template>
  <div>
    <div class="q-layout-padding" style="max-width: 500px;">
      <h4>Chat with avatar</h4>
      <p>To mix messages with avatar and without avatar in the same thread, use a placeholder avatar image.</p>
      <q-chat-message
        v-for="(msg, index) in messages"
        :key="index"
        v-bind="msg"
      />
      <q-chat-message
        name="Vladimir"
        avatar="https://cdn.quasar.dev/img/blueish.jpg"
      >
        <q-spinner-dots size="2rem" />
      </q-chat-message>

      <br><br><br><br>
      <h4>Chat using avatar slot</h4>
      <q-chat-message
        name="Vladimir"
        :text="['Use your own spacing or class q-message-avatar']"
      >
        <template v-slot:avatar>
          <q-icon name="face" size="4em" />
        </template>
      </q-chat-message>

      <br><br><br><br>
      <h4>Chat without avatar</h4>
      <q-chat-message
        v-for="(msg, index) in messagesWithoutAvatar"
        :key="1000 + index"
        v-bind="msg"
      />
      <q-chat-message
        name="Vladimir"
      >
        <q-spinner-dots size="2rem" />
      </q-chat-message>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const messages = [
      {
        label: 'Sunday, 19th'
      },
      {
        name: 'Vladimir',
        text: [ 'How are you?' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: 'Yesterday 13:34'
      },
      {
        name: 'Jane',
        text: [ 'I\'m good, thank you!', 'And you?' ],
        sent: true,
        textColor: 'white',
        bgColor: 'black',
        avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
        stamp: 'Yesterday at 13:50'
      },
      {
        name: 'Jane',
        text: [ 'And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? And you? ' ],
        sent: true,
        avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
        stamp: 'Yesterday at 13:51'
      },
      {
        name: '<strong class="text-uppercase">Trusted Vladimir</strong>',
        nameHtml: true,
        text: [ 'I\'m also fine, thank you. <span class="text-primary">But I feel like writing a very long text here too test the avatar.</span>' ],
        textHtml: true,
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: 'Yesterday 13:34'
      },
      {
        name: '<strong class="text-uppercase">Untrusted Vladimir</strong>',
        text: [ 'I\'m also fine, thank you. <span class="text-primary">But I feel like writing a very long text here too test the avatar.</span>' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: 'Yesterday 13:34'
      },
      {
        name: 'Vladimir',
        text: [ 'I\'m also fine, thank you. <span class="text-primary">But I feel like writing a very long text here too test the avatar.</span>' ],
        textHtml: true,
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: 'Yesterday 13:34'
      },
      {
        label: '<span class="bg-primary text-white q-pa-sm rounded-borders">Sunday, 19th (labelHtml: true)</span>',
        labelHtml: true
      },
      {
        name: 'Vladimir',
        bgColor: 'amber',
        textColor: 'white',
        text: [ 'Fine. Nice weather today, right?', 'Hmm...' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: '13:55'
      },

      {
        label: 'Sunday, 19th'
      },
      {
        name: 'Vladimir',
        text: [ 'How are you?' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: 'Yesterday 13:34'
      },
      {
        name: 'Jane',
        text: [ 'I\'m good, thank you!', 'And you?' ],
        sent: true,
        avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
        stamp: 'Yesterday at 13:50'
      },
      {
        name: 'Jane',
        text: [ 'And you?' ],
        sent: true,
        avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
        stamp: 'Yesterday at 13:51'
      },
      {
        label: 'Sunday, 19th'
      },
      {
        name: 'Vladimir',
        text: [ 'Fine. Nice weather today, right?', 'Hmm...' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: '13:55'
      },

      {
        label: 'Sunday, 19th'
      },
      {
        name: 'Vladimir',
        text: [ 'How are you?' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: 'Yesterday 13:34'
      },
      {
        name: 'Jane',
        text: [ 'I\'m good, thank you!', 'And you?' ],
        sent: true,
        avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
        stamp: 'Yesterday at 13:50'
      },
      {
        name: 'Jane',
        text: [ 'And you?' ],
        sent: true,
        avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
        stamp: 'Yesterday at 13:51'
      },
      {
        label: 'Sunday, 19th'
      },
      {
        name: 'Vladimir',
        text: [ 'Fine. Nice weather today, right?', 'Hmm...' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: '13:55'
      },

      {
        label: 'Sunday, 19th'
      },
      {
        name: 'Vladimir',
        text: [ 'How are you?' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: 'Yesterday 13:34'
      },
      {
        name: 'Jane',
        text: [ 'I\'m good, thank you!', 'And you?' ],
        sent: true,
        avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
        stamp: 'Yesterday at 13:50'
      },
      {
        name: 'Jane',
        text: [ 'And you?' ],
        sent: true,
        avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
        stamp: 'Yesterday at 13:51'
      },
      {
        label: 'Sunday, 19th'
      },
      {
        name: 'Vladimir',
        text: [ 'Fine. Nice weather today, right?', 'Hmm...' ],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        stamp: '13:55'
      }
    ]
    return {
      message: '',
      messages,
      messagesWithoutAvatar: messages.map((msg) => ({
        ...msg,
        avatar: void 0
      }))
    }
  }
}
</script>
