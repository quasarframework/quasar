<template>
  <div>
    <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
      <q-toggle v-model="dark" :dark="dark" label="Dark" />
      <q-toggle v-model="square" :dark="dark" label="Square" />
      <q-toggle v-model="flat" :dark="dark" label="Flat" />
      <q-toggle v-model="bordered" :dark="dark" label="Bordered" />
      <q-toggle v-model="inline" :dark="dark" label="Inline" />

      <div class="q-gutter-sm">
        <q-uploader v-bind="props" multiple xhr-url="http://localhost:4444/upload" />
        <q-uploader v-bind="props" multiple xhr-url="http://localhost:4444/upload">
          <div slot="header" slot-scope="scope" class="row no-wrap items-center q-gutter-xs">
            <div class="col">
              <div class="q-uploader__title">
                {{ scope.uploadSizeLabel }} ( {{ scope.queue.length }} files )
              </div>
              <div class="q-uploader__subtitle">
                {{ scope.uploadedPercentageLabel }} / {{ scope.uploadedSizeLabel }}
              </div>
            </div>
            <q-btn v-if="scope.files.length > 0" icon="clear" @click="scope.isIdle ? scope.reset() : scope.abort()" round dense flat />
            <q-btn v-if="scope.isIdle" icon="add_box" @click="scope.pick" round dense flat />
            <q-btn v-if="scope.isIdle && scope.queue.length > 0" icon="cloud_upload" @click="scope.upload" round dense flat />
          </div>
        </q-uploader>
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
      inline: false
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        square: this.square,
        flat: this.flat,
        bordered: this.bordered,
        inline: this.inline
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
