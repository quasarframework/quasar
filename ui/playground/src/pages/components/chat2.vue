<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px">
      <q-chat-message
        v-for="(msg,i) in messages"
        :name="msg.name"
        :avatar="msg.avatar"
        :stamp="msg.stamp"
        :text="msg.text"
        :sent="msg.status === 'sent'"
        :bg-color="msg.bgColor"
        :text-color="msg.textColor"
        :key="'a'+i"
      />

      <q-chat-message
        v-for="(msg,i) in messages"
        :name="msg.name"
        :avatar="msg.avatar"
        :stamp="msg.stamp"
        :sent="msg.status === 'sent'"
        :bg-color="msg.bgColor"
        :text-color="msg.textColor"
        :key="'b'+i"
      >
        <div v-for="(text, j) in msg.text" :key="'c'+j">{{ text }}</div>
      </q-chat-message>

      <q-chat-message
        v-for="(msg,i) in messages"
        :name="msg.name"
        :avatar="msg.avatar"
        :stamp="msg.stamp"
        :sent="msg.status === 'sent'"
        :bg-color="msg.bgColor"
        :text-color="msg.textColor"
        :key="'d'+i"
      >
        <div>A</div>
        <div>B</div>
      </q-chat-message>

      <q-chat-message
        v-for="(msg,i) in messages"
        :name="msg.name"
        :avatar="msg.avatar"
        :stamp="msg.stamp"
        :sent="msg.status === 'sent'"
        :bg-color="msg.bgColor"
        :text-color="msg.textColor"
        :key="'e'+i"
      >
        Weeee
      </q-chat-message>
    </div>

    <div class="q-pa-md">
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        stamp="7 minutes ago"
        sent
        text-color="white"
        bg-color="primary"
      >
        <div>
          Hey there!
        </div>

        <div>
          Have you seen Quasar?
          <img src="https://cdn.quasar.dev/img/discord-omq.png" class="my-emoticon">
        </div>
      </q-chat-message>

      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
        bg-color="amber"
      >
        <q-spinner-dots size="2rem" />
      </q-chat-message>

      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
        bg-color="amber"
      >
        <template v-slot:stamp>My stamp!</template>
        <template v-slot:name>My name!</template>
        Hello
      </q-chat-message>
    </div>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      messages: [
        {
          avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
          text: [ '> message 1 should support markdown', '> message 2  should support markdown', '> message 3 should support markdown' ],
          action: {
            icon: 'check',
            color: 'positive',
            name: 'check me'
          },
          stamp: '14 minutes ago',
          status: 'sent',
          name: 'ping',
          bgColor: 'primary',
          textColor: 'white'
        }
      ],

      someAction (something) {
        console.log(something)
      }
    }
  }
}
</script>

<style lang="sass">
.my-emoticon
  width: 24px
  height: 24px
  vertical-align: middle
</style>
