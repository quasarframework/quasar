<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
    <div style="max-width: 600px" class="q-gutter-y-md">
      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" :false-value="null" />
        <q-toggle :dark="dark" v-model="dense" label="Dense" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="bottomSlots" label="Bottom Slots" />
        <q-toggle :dark="dark" v-model="hideBottomSpace" label="hide-bottom-space" />
        <q-toggle :dark="dark" v-model="prefSuf" label="Prefix + Suffix" />
        <q-toggle :dark="dark" v-model="placeholder" label="Placeholder" />
        <q-toggle :dark="dark" v-model="hideHint" label="Hide Hint" />
        <q-toggle :dark="dark" v-model="textarea" label="Textarea" />
        <q-toggle :dark="dark" v-model="autogrow" label="Auto Grow (converts to textarea)" />
        <q-toggle :dark="dark" v-model="square" label="Force square borders" />
        <q-input :dark="dark" v-model="rows" :disable="textarea !== true || autogrow === true" label="Rows (for textarea)" class="inline" />
        <q-slider class="q-mt-lg" :dark="dark" v-model="fontSize" :min="8" :max="24" label-always />
      </div>

      <div class="text-h6">
        Lazy (@change)
      </div>
      <q-input class="gigi" v-bind="props" outlined :model-value="text" @change="val => { text = val }" label="Label" label-color="green" />

      <div class="text-h6">
        Standard
      </div>

      <q-input v-bind="props" outlined v-model="text" label="Label" label-color="green">
        <template v-slot:label>
          <div class="ellipsis">
            Label <strong>in slot</strong> that is <em>very long</em> and might overflow the space available if the field is not long enought to hold it all
          </div>
        </template>
      </q-input>

      <q-input v-bind="props" outlined v-model="text" label="Label" label-color="green">
        <template v-slot:label>
          <div class="row items-center">
            <q-icon class="on-left" color="red" name="delete" />
            Label with icon
            <q-icon class="on-right" color="primary" name="event" />
          </div>
        </template>
      </q-input>

      <q-input :dark="false" v-model="text" @focus="onFocus" @blur="onBlur" tabindex="1" />

      <q-input v-bind="props" v-model="text" label="Label (stacked) g" stack-label />

      <q-input v-bind="props" v-model="text" label="Label" label-color="green" />

      <q-input
        v-bind="props"
        v-model="textFill"
        label="Fill value and shadow text"
        hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
        :shadow-text="textFillValue"
        @keydown="onTextFillEvent"
        @focus="onTextFillEvent"
      />

      <q-input
        v-bind="props"
        v-model="textFill"
        placeholder="Fill value and shadow text"
        hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
        :shadow-text="textFillValue"
        @keydown="onTextFillEvent"
        @focus="onTextFillEvent"
      />

      <q-input v-bind="props" v-model="text" required label="Required" placeholder="Write something" color="green" />

      <q-field v-bind="props" v-model="text" required label="Required - Custom input">
        <template v-slot:control="{ id, floatingLabel, modelValue, emitValue }">
          <input :id="id" class="q-field__input" :value="modelValue" @input="e => emitValue(e.target.value)" v-show="floatingLabel">
        </template>
      </q-field>

      <q-input v-bind="props" v-model="invalid" pattern="[a-z]*" label="Only [a-z]" placeholder="Write something" />

      <q-input v-bind="props" v-model="number" type="number" label="Number" placeholder="Write a number" />

      <q-input v-bind="props" v-model="number" type="number" step="0.1" label="Number - step 0.1" placeholder="Write a number" />

      <q-input v-bind="props" v-model="email" type="email" label="eMail" placeholder="Write an email address" />

      <q-input v-bind="props" type="date" v-model="date" label="Date" stack-label clearable />

      <q-input v-bind="props" v-model="text" label="Tooltip and menu">
        <template v-slot:prepend>
          <q-icon name="event">
            <q-tooltip>Tooltip</q-tooltip>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="delete">
            <q-tooltip>Tooltip</q-tooltip>
          </q-icon>
        </template>

        <q-menu fit no-focus>
          <div class="q-pa-md text-center">
            Menu
          </div>
        </q-menu>
      </q-input>

      <q-input v-bind="props" v-model="text">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:prepend><q-icon name="schedule" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <div class="text-h6">
        Filled
      </div>

      <q-input v-bind="props" filled v-model="text" />

      <q-input v-bind="props" filled v-model="text" label="Label (stacked) g" stack-label />

      <q-input v-bind="props" filled v-model="text" label="Label" label-color="green" />

      <q-input :dense="dense" dark filled v-model="text" label="Label" color="orange" bg-color="black">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" filled v-model="text">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" filled v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" filled v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" filled v-model="text" label="Label" counter>
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" filled v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:prepend><q-icon name="schedule" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" filled v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <div class="text-h6">
        Outlined
      </div>

      <q-input v-bind="props" outlined v-model="text" />

      <q-input v-bind="props" outlined v-model="text" label="Label (stacked) g" stack-label />

      <q-input v-bind="props" outlined v-model="text" label="Label" label-color="green" />

      <q-input v-bind="props" outlined v-model="text" label="Label (stacked) g" stack-label>
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input v-bind="props" outlined v-model="text">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input v-bind="props" outlined v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" outlined v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:prepend><q-icon name="schedule" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" outlined v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <div class="text-h6">
        Standout
      </div>

      <q-input v-bind="props" standout v-model="text" />

      <q-input v-bind="props" standout v-model="text" label="Label (stacked) g" stack-label />

      <q-input v-bind="props" standout v-model="text" label="Label" label-color="green" />

      <q-input v-bind="props" standout v-model="text">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" standout v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" standout v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/128/logo.png">
          </q-avatar>
        </template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" standout v-model="text" label="Label" counter maxlength="12">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" standout v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:prepend><q-icon name="schedule" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" standout v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <div class="bg-white q-pa-lg">
        <q-input :dense="dense" standout v-model="text">
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
      </div>

      <div class="bg-white q-pa-lg">
        <q-input :dense="dense" standout="bg-primary text-white" v-model="text">
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
      </div>

      <div class="bg-primary q-pa-lg">
        <q-input :dense="dense" dark standout v-model="text">
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
      </div>

      <div class="text-h6">
        Borderless
      </div>

      <q-input v-bind="props" borderless v-model="text" />

      <q-input v-bind="props" borderless v-model="text" label="Label (stacked) g" stack-label />

      <q-input v-bind="props" borderless v-model="text" label="Label" label-color="green" />

      <q-input v-bind="props" borderless v-model="text" label="Label (stacked) g" stack-label>
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input v-bind="props" borderless v-model="text">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input v-bind="props" borderless v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" borderless v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:prepend><q-icon name="schedule" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" :bottom-slots="bottomSlots" borderless v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before><q-icon name="event" /></template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after><q-icon name="delete" /></template>
      </q-input>

      <div class="text-h6">
        Rounded
      </div>

      <q-input v-bind="props" rounded filled v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="delete" /></template>
      </q-input>

      <q-input v-bind="props" rounded outlined v-model="text" label="Label">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input v-bind="props" rounded standout v-model="text" label="Label" @focus="onFocus" @blur="onBlur">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <div class="text-h6">
        Debounced
      </div>
      <div>Model: {{ debounced }}</div>
      <q-input filled v-model="debounced" debounce="400" label="Debounced">
        <template v-slot:prepend>
          <q-icon name="history" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="debounced = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <div class="text-h6">
        Various tests
      </div>

      <q-input v-bind="props" v-model="undef" label="Model undefined" />

      <q-input :hide-hint="hideHint" :disable="disable" :readonly="readonly" :prefix="prefix" :suffix="suffix" filled v-model="events" label="Events" @update:model-value="onInput" @focus="onFocus" @blur="onBlur">
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append>
          <q-icon name="close" @click="events = ''" class="cursor-pointer" />
          <q-icon name="delete" />
        </template>
      </q-input>

      <q-input placeholder="Gigi" :dark="dark" filled v-model="text" label="With placeholder">
        <template v-slot:append><q-icon name="close" @click="text = ''" class="cursor-pointer" /></template>
      </q-input>

      <q-input placeholder="Gigi" bottom-slots :dark="dark" filled v-model="text" label="With counter slot">
        <template v-slot:append><q-icon name="close" @click="text = ''" class="cursor-pointer" /></template>
        <template v-slot:counter>
          Slotted counter
        </template>
      </q-input>

      <q-input placeholder="Gigi" :dark="dark" filled v-model="text">
        <template v-slot:append><q-icon name="close" @click="text = ''" class="cursor-pointer" /></template>
        <template v-slot:hint>
          With placeholder, no label
        </template>
      </q-input>

      <q-input :dark="dark" :bottom-slots="bottomSlots" :hide-hint="hideHint" :disable="disable" :readonly="readonly" filled suffix="@gmail.com" v-model="text" label="Password" :type="password ? 'password' : 'text'" placeholder="Placeholder">
        <template v-slot:append>
          <q-icon :name="password ? 'visibility_off' : 'visibility'" @click="password = !password" class="cursor-pointer" />
        </template>
        <template v-slot:hint>
          With placeholder & suffix
        </template>
      </q-input>

      <q-input :dark="dark" v-model="text" filled hint="With tooltip">
        <q-tooltip>Some tooltip</q-tooltip>
      </q-input>

      <q-input :dark="dark" v-model="text" filled hint="With menu" style="margin-bottom: 100px">
        <q-menu fit auto-close no-focus>
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

      <q-input v-bind="props" :bottom-slots="bottomSlots" v-model="text" label="Label" counter maxlength="12">
        <template v-slot:before>
          <q-icon name="event" @click="log('before')" />
        </template>

        <template v-slot:prepend>
          <q-icon name="schedule" @click="log('prepend')" />
        </template>

        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="search" @click="log('append')" />
        </template>

        <template v-slot:hint>
          <div @click="log('hint')">
            Field hint
          </div>
        </template>

        <template v-slot:after>
          <q-icon name="delete" @click="log('after')" />
        </template>
      </q-input>

      <q-input :dark="dark" v-model="file" type="file" label="File" stack-label clearable />
      <q-input :dark="dark" v-model="file" type="file" label="Same file as above" stack-label clearable />

      <q-toggle v-model="showFileInput" :dark="dark" label="Show file input" />
      <q-input v-if="showFileInput" :dark="dark" v-model="file" type="file" label="Same file as above" stack-label clearable />
    </div>
  </div>
</template>

<script>
import { event } from 'quasar'

const { stopAndPrevent } = event

export default {
  data () {
    return {
      dark: null,
      dense: false,
      disable: false,
      readonly: false,
      prefSuf: false,
      placeholder: false,
      hideHint: false,
      bottomSlots: true,
      hideBottomSpace: false,
      square: false,

      fontSize: 14,

      textarea: false,
      autogrow: false,
      rows: '6',

      text: '',
      undef: void 0,
      events: '',
      debounced: '',

      textFill: '',
      textFillCancelled: false,

      pass: '',
      password: true,

      invalid: '123',
      number: 1.1,
      email: 'a',
      date: null,

      prefix: null,
      suffix: null,

      file: null,

      showFileInput: false
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
        hideBottomSpace: this.hideBottomSpace,
        dark: this.dark,
        type: this.type,
        autogrow: this.autogrow,
        hideHint: this.hideHint,
        disable: this.disable,
        readonly: this.readonly,
        prefix: this.prefix,
        suffix: this.suffix,
        placeholder: this.placeholder === true ? 'Placeholder text' : null,
        dense: this.dense,
        clearable: true,
        square: this.square,
        style: { fontSize: `${ this.fontSize }px` }
      }

      if (this.rows !== '') {
        props.rows = this.rows
      }

      return props
    },

    length () {
      return this.text.length
    },

    textFillValue () {
      if (this.textFillCancelled === true) {
        return ''
      }

      const
        t = this.textarea === true || this.autogrow === true
          ? '$ | Filled\nfilled\n@ #'
          : '$ | Filled filled @ #',
        empty = typeof this.textFill !== 'string' || this.textFill.length === 0

      if (empty === true) {
        return t.split('\n')[ 0 ]
      }
      else if (t.indexOf(this.textFill) !== 0) {
        return ''
      }

      return t
        .split(this.textFill)
        .slice(1)
        .join(this.textFill)
        .split('\n')[ 0 ]
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
      console.log('@update:model-value', JSON.stringify(val))
    },
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    log (what) {
      console.log('LOG:', what)
    },

    onTextFillEvent (e) {
      if (e === void 0) {
        return
      }

      if (e.keyCode === 27) {
        if (this.textFillCancelled !== true) {
          this.textFillCancelled = true
        }
      }
      else if (e.keyCode === 9) {
        if (this.textFillCancelled !== true && this.textFillValue.length > 0) {
          stopAndPrevent(e)
          this.textFill += this.textFillValue
        }
      }
      else if (this.textFillCancelled === true) {
        this.textFillCancelled = false
      }
    }
  }
}
</script>
