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
        <q-toggle :dark="dark" v-model="textarea" label="Textarea" />
        <q-toggle :dark="dark" v-model="autogrow" label="Auto Grow (converts to textarea)" />
        <q-toggle :dark="dark" v-model="square" label="Force square borders" />
        <q-input :dark="dark" v-model="rows" :disable="textarea !== true || autogrow === true" label="Rows (for textarea)" class="inline" />
      </div>

      <div class="text-h6">
        Standard
      </div>

      <q-input v-bind="props" v-model="text" @focus="onFocus" @blur="onBlur" tabindex="1" />

      <q-input v-bind="props" v-model="text" label="Label (stacked) g" stack-label />

      <q-input v-bind="props" v-model="text" label="Label" />

      <q-input v-bind="props" v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">
        Filled
      </div>

      <q-input v-bind="props" filled v-model="text" />

      <q-input v-bind="props" filled v-model="text" label="Label (stacked)" stack-label />

      <q-input v-bind="props" filled v-model="text" label="Label" />

      <q-input :dense="dense" dark filled v-model="text" label="Label" color="orange" bg-color="black">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" filled v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" filled v-model="text" label="Label" counter>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />

        <div slot="hint">
          Field hint
        </div>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" filled v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" filled v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">
        Outlined
      </div>

      <q-input v-bind="props" outlined v-model="text" />

      <q-input v-bind="props" outlined v-model="text" label="Label (stacked)" stack-label />

      <q-input v-bind="props" outlined v-model="text" label="Label" />

      <q-input v-bind="props" outlined v-model="text" label="Label (stacked)" stack-label>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" outlined v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" outlined v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" outlined v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" outlined v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">
        Standout
      </div>

      <q-input v-bind="props" standout v-model="text" />

      <q-input v-bind="props" standout v-model="text" label="Label (stacked)" stack-label />

      <q-input v-bind="props" standout v-model="text" label="Label" />

      <q-input v-bind="props" standout v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" standout v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" standout v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-avatar slot="append">
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
        </q-avatar>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" standout v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />

        <div slot="hint">
          Field hint
        </div>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" standout v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" standout v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">
          Field hint
        </div>

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

      <div class="text-h6">
        Borderless
      </div>

      <q-input v-bind="props" borderless v-model="text" />

      <q-input v-bind="props" borderless v-model="text" label="Label (stacked)" stack-label />

      <q-input v-bind="props" borderless v-model="text" label="Label" />

      <q-input v-bind="props" borderless v-model="text" label="Label (stacked)" stack-label>
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" borderless v-model="text">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" borderless v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" borderless v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <q-icon slot="prepend" name="schedule" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" borderless v-model="text" label="Label" counter maxlength="12">
        <q-icon slot="before" name="event" />

        <div slot="hint">
          Field hint
        </div>

        <q-icon slot="after" name="delete" />
      </q-input>

      <div class="text-h6">
        Rounded
      </div>

      <q-input v-bind="props" rounded filled v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" rounded outlined v-model="text" label="Label">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input v-bind="props" rounded standout v-model="text" label="Label" @focus="onFocus" @blur="onBlur">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <div class="text-h6">
        Debounced
      </div>
      <div>Model: {{ debounced }}</div>
      <q-input filled v-model="debounced" debounce="400" label="Debounced">
        <q-icon slot="prepend" name="history" />
        <q-icon slot="append" name="close" @click="debounced = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <div class="text-h6">
        Various tests
      </div>

      <q-input :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" filled v-model="events" label="Events" @input="onInput" @focus="onFocus" @blur="onBlur">
        <q-icon slot="prepend" name="event" />
        <q-icon slot="append" name="close" @click="events = ''" class="cursor-pointer" />
        <q-icon slot="append" name="delete" />
      </q-input>

      <q-input placeholder="Gigi" :dark="dark" filled v-model="text" label="With placeholder">
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
      </q-input>

      <q-input placeholder="Gigi" bottom-slots :dark="dark" filled v-model="text" label="With counter slot">
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <div slot="counter">
          Slotted counter
        </div>
      </q-input>

      <q-input placeholder="Gigi" :dark="dark" filled v-model="text">
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <div slot="hint">
          With placeholder, no label
        </div>
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" filled suffix="@gmail.com" v-model="text" label="Password" :type="password ? 'password' : 'text'" placeholder="Placeholder">
        <q-icon slot="append" :name="password ? 'visibility_off' : 'visibility'" @click="password = !password" class="cursor-pointer" />
        <div slot="hint">
          With placeholder & suffix
        </div>
      </q-input>

      <q-input v-model="text" filled hint="With tooltip">
        <q-tooltip>Some tooltip</q-tooltip>
      </q-input>

      <q-input v-model="text" filled hint="With menu" style="margin-bottom: 100px">
        <q-menu fit auto-close>
          <q-list padding style="min-width: 100px">
            <q-item
              v-for="n in 2"
              :key="n"
              clickable
            >
              <q-item-section>Label</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-input>

      <q-input v-model="file" type="file" />
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
      square: false,

      textarea: false,
      autogrow: false,
      rows: '6',

      text: '',
      events: '',
      debounced: '',

      pass: '',
      password: true,

      prefix: null,
      suffix: null,

      file: null
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
    type () {
      return 'text' + (this.textarea ? 'area' : '')
    },

    props () {
      const props = {
        dark: this.dark,
        type: this.type,
        autogrow: this.autogrow,
        hideHint: this.hideHint,
        disable: this.disable,
        readonly: this.readonly,
        prefix: this.prefix,
        suffix: this.suffix,
        dense: this.dense,
        clearable: true,
        square: this.square
      }

      if (this.rows !== '') {
        props.rows = this.rows
      }

      return props
    },

    length () {
      return this.text.length
    }
  },
  methods: {
    onBlur (e) {
      console.log('@blur', e)
    },
    onFocus (e) {
      console.log('@focus', e)
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
