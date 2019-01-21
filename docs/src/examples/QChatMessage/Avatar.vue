<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <div class="q-layout-padding" style="width: 80%; max-width: 500px; border: 1px solid lightgrey">

        <q-chat-message
          name="me"
          avatar="https://cdn.quasar-framework.org/img/boy-avatar.png"
          :text="['hey, how are you?']"
          sent
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar-framework.org/img/linux-avatar.png"
          :text="[`doing fine, how r you?`]"
        />

      </div>
    </div>
  </div>
</template>
