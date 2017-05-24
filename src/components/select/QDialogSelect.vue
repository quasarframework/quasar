<template>
  <q-input-frame
    ref="input"
    class="q-select"

    :prefix="prefix"
    :suffix="suffix"
    :stack-label="stackLabel"
    :float-label="floatLabel"
    :error="error"
    :disable="disable"
    :inverted="inverted"
    :dark="dark"
    :before="before"
    :after="after"
    :color="frameColor"
    :align="align"

    :focused="focused"
    focusable
    :length="length"

    @click.native="pick"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
  >
    <div class="col row group">
      <template v-if="hasChips">
        <q-chip
          v-for="{label, value} in selectedOptions"
          :key="label"
          small
          :closable="!disable"
          color="color"
          @click.native.stop
          @close="__toggle(value)"
        >
          {{ label }}
        </q-chip>
      </template>

      <div v-else class="q-input-target" :class="[`text-${align}`]" v-html="actualValue"></div>
    </div>

    <q-icon slot="control" name="arrow_drop_down" class="q-if-control"></q-icon>
  </q-input-frame>
</template>

<script>
import Dialog from '../dialog'
import SelectMixin from './select-mixin'

export default {
  name: 'q-dialog-select',
  mixins: [SelectMixin],
  props: {
    value: {
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: v => ['radio', 'checkbox', 'toggle'].includes(v)
    },
    okLabel: {
      type: String,
      default: 'OK'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    title: {
      type: String,
      default: 'Select'
    },
    message: String
  },
  data () {
    return {
      focused: false
    }
  },
  computed: {
    actualValue () {
      if (this.customValue) {
        return this.customValue
      }
      if (!this.multiple) {
        let option = this.options.find(option => option.value === this.value)
        return option ? option.label : ''
      }

      let options = this.selectedOptions.map(opt => opt.label)
      return !options.length ? '' : options.join(', ')
    },
    selectedOptions () {
      if (this.multiple) {
        return this.options.filter(opt => this.value.includes(opt.value))
      }
    },
    multiple () {
      return ['checkbox', 'toggle'].includes(this.type)
    }
  },
  methods: {
    pick () {
      if (this.disable) {
        return
      }

      let options = this.options.map(opt => {
        return {
          value: opt.value,
          label: opt.label,
          color: opt.color,
          model: this.multiple ? this.value.includes(opt.value) : this.value === opt.value
        }
      })

      this.dialog = Dialog.create({
        title: this.title,
        message: this.message,
        onDismiss: () => {
          this.dialog = null
        },
        form: {
          select: {type: this.type, model: this.value, items: options}
        },
        buttons: [
          this.cancelLabel,
          {
            label: this.okLabel,
            handler: data => {
              this.$emit('input', data.select)
            }
          }
        ]
      })
    },
    close () {
      if (this.dialog) {
        this.dialog.close()
      }
    },

    __toggle (value) {
      const
        index = this.value.indexOf(value),
        model = this.value.slice(0)

      if (index > -1) {
        model.splice(index, 1)
      }
      else {
        model.push(value)
      }

      this.$emit('input', model)
    },
    __onFocus () {
      this.focused = true
      this.$emit('focus')
    },
    __onBlur (e) {
      this.focused = false
      this.$emit('blur')
    }
  }
}
</script>
