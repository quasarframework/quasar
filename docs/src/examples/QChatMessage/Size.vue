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
          :text="['hey, how are you?']"
          stamp="7 minutes ago"
          sent
          :size="2"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar-framework.org/img/linux-avatar.png"
          :text="[`doing fine, how r you?`, 'I just feel like typing a really, really, REALY long message to annoy you...']"
          stamp="4 minutes ago"
          :size="10"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar-framework.org/img/linux-avatar.png"
          :text="[`Did it work?`]"
          stamp="1 minutes ago"
          :size="10"
        />

      </div>
    </div>
  </div>
</template>
