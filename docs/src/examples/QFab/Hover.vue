<template>
  <div class="q-px-sm q-py-lg">
    <div class="row justify-center q-gutter-xl" style="margin: 100px 0">
      <q-fab hover color="primary" icon="keyboard_arrow_left" direction="left">
        <q-fab-action color="primary" @click="onClick" icon="mail" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" />
      </q-fab>

      <q-fab
        hover
        :hover-delay="300"
        :hover-hide-delay="600"
        color="purple"
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action color="primary" @click="onClick" icon="mail" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" />
      </q-fab>
    </div>
  </div>
</template>

<script setup>
function onClick() {
  console.log('Clicked on a fab action')
}
</script>
