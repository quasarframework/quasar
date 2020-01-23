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
      <q-btn color="primary" label="Reset" @click="reset" class="q-mr-sm" />
      <q-toggle v-model="truncate" label="Truncate labels" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.truncate-chip-labels > .q-chip
  max-width: 140px
</style>

<script>
export default {
  data () {
    return {
      truncate: true,

      vanilla: true,
      chocolate: true,
      strawberry: true,
      cookies: true,

      vanillaLabel: 'I want vanilla flavoured ice cream',
      chocolateLabel: 'I want chocolate flavoured ice cream',
      strawberryLabel: 'I want strawberry flavoured ice cream',
      cookiesLabel: 'I want cookies flavoured ice cream'
    }
  },

  methods: {
    reset () {
      this.vanilla = true
      this.chocolate = true
      this.strawberry = true
      this.cookies = true
    }
  }
}
</script>
