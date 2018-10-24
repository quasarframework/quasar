<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div style="max-width: 600px" class="q-gutter-y-md">

      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" />
        <q-toggle :dark="dark" v-model="dense" label="Dense" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="bottomSlots" label="Bottom Slots" />
        <q-toggle :dark="dark" v-model="prefSuf" label="Prefix + Suffix" />
        <q-toggle :dark="dark" v-model="hideHint" label="Hide Hint" />
      </div>

      <div class="text-h6">Standard</div>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" v-model="text" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" v-model="text" label="Label" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">Filled</div>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text" label="Label" />

      <q-input :dense="dense" dark filled v-model="text" label="Label" color="orange" bg-color="black">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text" label="Label" counter>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />

        <div slot="hint">Field hint</div>
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" filled v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">Outline</div>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" outlined v-model="text" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" outlined v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" outlined v-model="text" label="Label" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" outlined v-model="text" label="Label (stacked)" stack-label>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" outlined v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" outlined v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" outlined v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" outlined v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">Standout</div>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text" label="Label" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-avatar slot="append">
          <img src="statics/quasar-logo.png">
        </q-avatar>
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />

        <div slot="hint">Field hint</div>
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" standout v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">Field hint</div>

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

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" borderless v-model="text" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" borderless v-model="text" label="Label (stacked)" stack-label/>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" borderless v-model="text" label="Label" />

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" borderless v-model="text" label="Label (stacked)" stack-label>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" borderless v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" borderless v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" borderless v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" borderless v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">Field hint</div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">Rounded</div>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" rounded filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" rounded outlined v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" :dense="dense" rounded standout v-model="text" label="Label" @focus="onFocus" @blur="onBlur">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <div class="text-h6">Various tests</div>

      <q-input :dark="dark" :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" filled v-model="events" label="Events" @input="onInput" @focus="onFocus" @blur="onBlur">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="events = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input placeholder="Gigi" :dark="dark" filled v-model="text" label="With placeholder">
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
      </q-input>

      <q-input placeholder="Gigi" :dark="dark" filled v-model="text">
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <div slot="hint">With placeholder, no label</div>
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" filled suffix="@gmail.com" v-model="text" label="Password" :type="password ? 'password' : 'text'">
        <q-icon slot="append" :name="password ? 'visibility_off' : 'visibility'" @click="password = !password" class="cursor-pointer" />
        <div slot="hint">With placeholder, no label</div>
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
      disable: false,
      readonly: false,
      prefSuf: false,
      hideHint: false,
      bottomSlots: true,

      text: '',
      events: '',

      pass: '',
      password: true,

      prefix: null,
      suffix: null
    }
  },
  watch: {
    prefSuf (v) {
      if (v) {
        this.prefix = '$'
        this.suffix = 'TSP'
      }
      else {
        this.prefix = this.suffix = null
      }
    }
  },
  computed: {
    length () {
      return this.text.length
    }
  },
  methods: {
    onBlur () {
      console.log('@blur')
    },
    onFocus () {
      console.log('@focus')
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    },
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    }
  }
}
</script>

<style lang="stylus">
</style>
