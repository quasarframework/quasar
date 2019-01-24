<template>
  <div>
    <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
      <div class="q-gutter-sm q-mb-md">
        <q-toggle v-model="dark" :dark="dark" label="Dark" />
        <q-toggle v-model="square" :dark="dark" label="Square" />
        <q-toggle v-model="flat" :dark="dark" label="Flat" />
        <q-toggle v-model="bordered" :dark="dark" label="Bordered" />
        <q-toggle v-model="inline" :dark="dark" label="Inline" />
        <q-toggle v-model="noThumbnails" :dark="dark" label="No Thumbnails" />
        <q-toggle v-model="label" :dark="dark" label="Label" />
      </div>

      <div class="q-gutter-sm">
        <q-uploader v-bind="props" multiple url="http://localhost:4444/upload" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false,
      square: false,
      flat: false,
      bordered: false,
      inline: true,
      noThumbnails: false,
      label: true
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        square: this.square,
        flat: this.flat,
        bordered: this.bordered,
        inline: this.inline,
        noThumbnails: this.noThumbnails,
        label: this.label ? 'Upload files' : null
      }
    }
  },

  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
