<template>
  <div>

    <div class="q-mt-lg q-mb-sm rounded-borders overflow-hidden shadow-2">
      <div class="row">
        <div class="col-3 q-pa-md flex flex-center" :class="topL === 'h' ? 'bg-brand-primary text-white' : 'bg-orange text-grey-9'">
          <q-option-group
            inline
            color="white"
            keep-color
            dense
            v-model="topL"
            :options="[{ label: 'l', value: 'l'}, { label: 'h', value: 'h'}]"
          />
        </div>
        <div class="col-6 q-pa-md flex flex-center bg-brand-primary text-white">
          <q-option-group
            inline
            color="white"
            keep-color
            dense
            v-model="topC"
            :options="[{ label: 'h', value: 'h'}, { label: 'H', value: 'H'}]"
          />
        </div>
        <div class="col-3 q-pa-md flex flex-center" :class="topR === 'h' ? 'bg-brand-primary text-white' : 'bg-orange text-grey-9'">
          <q-option-group
            inline
            color="white"
            keep-color
            dense
            v-model="topR"
            :options="[{ label: 'r', value: 'r'}, { label: 'h', value: 'h'}]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-px-md q-py-xl flex flex-center bg-orange text-grey-9">
          <q-option-group
            inline
            color="white"
            keep-color
            dense
            v-model="middleL"
            :options="[{ label: 'l', value: 'l'}, { label: 'L', value: 'L'}]"
          />
        </div>
        <div class="col-6 q-px-md q-py-xl flex flex-center">
          p
        </div>
        <div class="col-3 q-px-md q-py-xl flex flex-center bg-orange text-grey-9">
          <q-option-group
            inline
            color="white"
            keep-color
            dense
            v-model="middleR"
            :options="[{ label: 'r', value: 'r'}, { label: 'R', value: 'R'}]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pa-md flex flex-center" :class="bottomL === 'f' ? 'bg-grey-8 text-white' : 'bg-orange text-grey-9'">
          <q-option-group
            inline
            color="white"
            keep-color
            dense
            v-model="bottomL"
            :options="[{ label: 'l', value: 'l'}, { label: 'f', value: 'f'}]"
          />
        </div>
        <div class="col-6 q-pa-md flex flex-center bg-grey-8 text-white">
          <q-option-group
            inline
            color="white"
            keep-color
            dense
            v-model="bottomC"
            :options="[{ label: 'f', value: 'f'}, { label: 'F', value: 'F'}]"
          />
        </div>
        <div class="col-3 q-pa-md flex flex-center" :class="bottomR === 'f' ? 'bg-grey-8 text-white' : 'bg-orange text-grey-9'">
          <q-option-group
            inline
            color="white"
            keep-color
            dense
            v-model="bottomR"
            :options="[{ label: 'r', value: 'r'}, { label: 'f', value: 'f'}]"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-center">
      <div class="q-pa-sm bg-grey-4 rounded-borders">
        View: <q-badge :label="view" />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      topL: 'h',
      topC: 'H',
      topR: 'h',

      middleL: 'L',
      middleR: 'r',

      bottomL: 'f',
      bottomC: 'F',
      bottomR: 'f'
    }
  },

  computed: {
    view () {
      const
        top = `${this.topL}${this.topC}${this.topR}`,
        middle = `${this.middleL}p${this.middleR}`,
        bottom = `${this.bottomL}${this.bottomC}${this.bottomR}`

      return `${top} ${middle} ${bottom}`
    }
  }
}
</script>
