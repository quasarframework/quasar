<template>
  <div class="q-px-sm q-py-lg">
    <div class="row justify-center q-gutter-xl" style="margin: 260px 0 20px">
      <q-fab hover color="purple" icon="keyboard_arrow_up" direction="up">
        <q-fab-action
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <q-fab-action
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>

      <q-fab
        :stagger="0"
        hover
        color="purple"
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <q-fab-action
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>

      <q-fab
        :stagger="120"
        hover
        color="purple"
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <q-fab-action
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>
    </div>
  </div>
</template>

<script setup>
function onClick() {
  console.log('Clicked on a fab action')
}
</script>
