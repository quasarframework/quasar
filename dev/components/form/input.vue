<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div style="max-width: 600px" class="q-gutter-y-md">

      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" />
        <q-toggle :dark="dark" v-model="dense" label="Dense" />
      </div>

      <div class="text-h6">Standard</div>

      <q-input :dark="dark" :dense="dense" v-model="text" />

      <q-input :dark="dark" :dense="dense" v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :dense="dense" v-model="text" label="Label" />

      <q-input :dark="dark" :dense="dense" v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" v-model="text" label="Label" counter="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="message">Field message</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">Filled</div>

      <q-input :dark="dark" :dense="dense" filled v-model="text" />

      <q-input :dark="dark" :dense="dense" filled v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :dense="dense" filled v-model="text" label="Label" />

      <q-input :dense="dense" dark filled v-model="text" label="Label" color="orange" bg-color="black">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" filled v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" filled v-model="text" label="Label" counter>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />

        <div slot="message">Field message</div>
      </q-input>

      <q-input :dark="dark" :dense="dense" filled v-model="text" label="Label" counter="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="message">Field message</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">Outline</div>

      <q-input :dark="dark" :dense="dense" outlined v-model="text" />

      <q-input :dark="dark" :dense="dense" outlined v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :dense="dense" outlined v-model="text" label="Label" />

      <q-input :dark="dark" :dense="dense" outlined v-model="text" label="Label (stacked)" stack-label>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" outlined v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" outlined v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" outlined v-model="text" label="Label" counter="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="message">Field message</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">Standout</div>

      <q-input :dark="dark" :dense="dense" standout v-model="text" />

      <q-input :dark="dark" :dense="dense" standout v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :dense="dense" standout v-model="text" label="Label" />

      <q-input :dark="dark" :dense="dense" standout v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" standout v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" standout v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" standout v-model="text" label="Label" counter="12">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />

        <div slot="message">Field message</div>
      </q-input>

      <q-input :dark="dark" :dense="dense" standout v-model="text" label="Label" counter="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="message">Field message</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="bg-white q-pa-lg">
        <q-input :dense="dense" standout v-model="text">
          <q-icon slot="append" name="search" />
        </q-input>
      </div>

      <div class="bg-primary q-pa-lg">
        <q-input :dense="dense" dark standout v-model="text">
          <q-icon slot="append" name="search" />
        </q-input>
      </div>

      <div class="text-h6">Borderless</div>

      <q-input :dark="dark" :dense="dense" borderless v-model="text" />

      <q-input :dark="dark" :dense="dense" borderless v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :dense="dense" borderless v-model="text" label="Label" />

      <q-input :dark="dark" :dense="dense" borderless v-model="text" label="Label (stacked)" stack-label>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" borderless v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" borderless v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" borderless v-model="text" label="Label" counter="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="message">Field message</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">Rounded</div>

      <q-input :dark="dark" :dense="dense" rounded filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" rounded outlined v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :dense="dense" rounded standout v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false,
      dense: false,
      text: ''
    }
  },
  computed: {
    length () {
      return this.text.length
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onBlur (val) {
      console.log('@blur', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>

<style lang="stylus">
.q-field
  // border 1px solid black
.q-input
  // border 1px solid black
</style>
