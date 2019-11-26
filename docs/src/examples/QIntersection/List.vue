<template>
  <div class="q-pa-md flex justify-center">
    <div style="max-width: 90%; width: 300px;">
      <q-intersection
        v-for="index in 60"
        :key="index"
        transition="flip-right"
        class="example-item"
      >
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              Q
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Contact #{{ index }}</q-item-label>
            <q-item-label caption lines="1">some@email.com</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chat_bubble" color="green" />
          </q-item-section>
        </q-item>
      </q-intersection>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.example-item
  height: 56px
</style>
