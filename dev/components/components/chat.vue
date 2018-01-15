<template>
  <div>  
    <div class="layout-padding" style="max-width: 500px;">
      <h4>Chat with avatar</h4>
      <p>To mix messages with avatar and without avatar in the same thread, use a placeholder avatar image.</p>
      <q-chat-message
        v-for="(msg, index) in messages"
        :key="index"
        :label="msg.label"
        :sent="msg.sent"
        :text-color="msg.textColor"
        :bg-color="msg.bgColor"
        :name="msg.name"
        :avatar="msg.avatar"
        :text="msg.text"
        :stamp="msg.stamp"
      />
      <q-chat-message
        name="Vladimir"
        avatar="/statics/boy-avatar.png"
      >
        <q-spinner-dots size="2rem" />
      </q-chat-message>
      
      <br><br><br><br>
      <h4>Chat using avatar slot</h4>
      <q-chat-message
        name="Vladimir"
        :text="['Use your own spacing or class q-message-avatar']"
      >
        <q-icon name="face" size="4em" slot="avatar"/>
      </q-chat-message>
      
      <br><br><br><br>
      <h4>Chat without avatar</h4>
      <q-chat-message
        v-for="(msg, index) in messages"
        :key="1000 + index"
        :label="msg.label"
        :sent="msg.sent"
        :text-color="msg.textColor"
        :bg-color="msg.bgColor"
        :name="msg.name"
        :text="msg.text"
        :stamp="msg.stamp"
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
          textColor: 'white',
          bgColor: 'black',
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
          bgColor: 'amber',
          textColor: 'white',
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
  }
}
</script>
