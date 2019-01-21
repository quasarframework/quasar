<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <div class="q-layout-padding" style="width: 80%; max-width: 500px; border: 1px solid lightgrey">

        <q-chat-message
          label="Sunday, 19th"
        />
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar-framework.org/img/boy-avatar.png"
          :text="[`I'm waiting for your answer..`]"
          stamp="7 minutes ago"
          sent
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar-framework.org/img/linux-avatar.png"
        >
          <q-spinner-dots size="2rem" />
        </q-chat-message>

      </div>
    </div>
  </div>
</template>
