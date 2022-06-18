<template>
  <div class="q-px-sm q-py-lg">
    <div class="column items-center" style="margin-top: 100px; margin-bottom: 100px;">
      <q-fab color="purple" icon="keyboard_arrow_up" direction="up">
        <q-fab-action color="primary" @click="onClick" icon="mail" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" />
      </q-fab>

      <br>

      <q-fab color="amber" text-color="black" icon="keyboard_arrow_left" direction="left">
        <q-fab-action color="amber" text-color="black" @click="onClick" icon="mail" />
        <q-fab-action color="amber" text-color="black" @click="onClick" icon="alarm" />
      </q-fab>

      <br>

      <q-fab color="secondary" push icon="keyboard_arrow_right" direction="right">
        <q-fab-action color="primary" @click="onClick" icon="mail" />
        <q-fab-action color="accent" @click="onClick" icon="alarm" />
      </q-fab>

      <br>

      <q-fab color="accent" glossy icon="keyboard_arrow_down" direction="down">
        <q-fab-action color="amber" text-color="black" @click="onClick" icon="mail" />
        <q-fab-action color="amber" text-color="black" @click="onClick" icon="alarm" />
      </q-fab>
    </div>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      onClick () {
        // console.log('Clicked on a fab action')
      }
    }
  }
}
</script>
