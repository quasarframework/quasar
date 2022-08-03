<template>
  <div class="q-px-sm q-py-lg">
    <div class="column items-center" style="margin-top: 100px; margin-bottom: 100px;">
      <q-fab color="purple" direction="up">
        <template v-slot:icon="{ opened }">
          <q-icon :class="{ 'example-fab-animate--hover': opened !== true }" name="keyboard_arrow_up" />
        </template>

        <template v-slot:active-icon="{ opened }">
          <q-icon :class="{ 'example-fab-animate': opened === true }" name="close" />
        </template>

        <q-fab-action color="primary" external-label @click="onClick">
          <template v-slot:icon>
            <q-icon name="mail" />
          </template>
          <template v-slot:label>
            Mail
          </template>
        </q-fab-action>

        <q-fab-action color="secondary" external-label @click="onClick" icon="alarm" label="Alarm" />
      </q-fab>

      <br>

      <q-fab color="amber" text-color="black" icon="keyboard_arrow_left" direction="left">
        <template v-slot:label="{ opened }">
          <div :class="{ 'example-fab-animate--hover': opened !== true }">
            {{ opened !== true ? 'Open' : 'Close' }}
          </div>
        </template>

        <q-fab-action color="primary" @click="onClick" icon="mail" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" />
      </q-fab>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onClick () {
      // console.log('Clicked on a fab action')
    }
  }
}
</script>

<style lang="sass" scoped>
.example-fab-animate,
.q-fab:hover .example-fab-animate--hover
  animation: example-fab-animate 0.82s cubic-bezier(.36,.07,.19,.97) both
  transform: translate3d(0, 0, 0)
  backface-visibility: hidden
  perspective: 1000px

@keyframes example-fab-animate
  10%, 90%
    transform: translate3d(-1px, 0, 0)

  20%, 80%
    transform: translate3d(2px, 0, 0)

  30%, 50%, 70%
    transform: translate3d(-4px, 0, 0)

  40%, 60%
    transform: translate3d(4px, 0, 0)
</style>
