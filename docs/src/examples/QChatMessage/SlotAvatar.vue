<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px">
      <q-chat-message
        name="me"
        stamp="7 minutes ago"
        :text="['Have you seen Quasar?']"
        sent
        text-color="white"
        bg-color="primary"
      >
        <template v-slot:avatar>
          <img
            class="q-message-avatar q-message-avatar--sent"
            src="https://cdn.quasar.dev/img/avatar4.jpg"
          >
        </template>
      </q-chat-message>

      <q-chat-message
        name="Jane"
        :text="['Already building an app with it..']"
        bg-color="amber"
      >
        <template v-slot:avatar>
          <img
            class="q-message-avatar q-message-avatar--received"
            src="https://cdn.quasar.dev/img/avatar2.jpg"
          >
        </template>

        <q-spinner-dots size="2rem" />
      </q-chat-message>
    </div>
  </div>
</template>
