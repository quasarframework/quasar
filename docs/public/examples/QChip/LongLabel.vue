<template>
  <div class="q-pa-md">
    <div class="q-gutter-xs row" style="max-width: 300px" :class="{ 'truncate-chip-labels': truncate }">
      <q-chip
        removable
        v-model="vanilla"
        color="primary"
        text-color="white"
        icon="cake"
        :label="vanillaLabel"
        :title="vanillaLabel"
      />
      <q-chip
        removable
        v-model="chocolate"
        color="teal"
        text-color="white"
        icon="cake"
        :label="chocolateLabel"
      >
        <q-tooltip>{{ chocolateLabel }}</q-tooltip>
      </q-chip>
      <q-chip
        removable
        v-model="strawberry"
        color="orange"
        text-color="white"
        icon="cake"
      >
        <div class="ellipsis">
          {{ strawberryLabel }}
          <q-tooltip>{{ strawberryLabel }}</q-tooltip>
        </div>
      </q-chip>
      <q-chip
        removable
        v-model="cookies"
        color="red"
        text-color="white"
      >
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
        <div class="ellipsis">
          {{ cookiesLabel }}
          <q-tooltip>{{ cookiesLabel }}</q-tooltip>
        </div>
      </q-chip>
    </div>

    <div class="row items-center q-mt-sm">
      <q-btn color="primary" label="Reset" @click="onResetClick" class="q-mr-sm" />
      <q-toggle v-model="truncate" label="Truncate labels" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const vanilla = ref(true)
    const chocolate = ref(true)
    const strawberry = ref(true)
    const cookies = ref(true)

    return {
      truncate: ref(true),

      vanilla,
      chocolate,
      strawberry,
      cookies,

      vanillaLabel: 'I want vanilla flavoured ice cream',
      chocolateLabel: 'I want chocolate flavoured ice cream',
      strawberryLabel: 'I want strawberry flavoured ice cream',
      cookiesLabel: 'I want cookies flavoured ice cream',

      onResetClick () {
        vanilla.value = true
        chocolate.value = true
        strawberry.value = true
        cookies.value = true
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.truncate-chip-labels > .q-chip
  max-width: 140px
</style>
