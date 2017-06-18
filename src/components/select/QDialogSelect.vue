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
    :color="frameColor || color"
    :align="align"

    :focused="focused"
    focusable
    :length="length"
    :additional-length="additionalLength"

    @click.native="pick"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
  >
    <div v-if="hasChips" class="col row items-center group q-input-chips">
      <q-chip
        v-for="{label, value} in selectedOptions"
        :key="label"
        small
        :closable="!disable"
        :color="color"
        @click.native.stop
        @close="__toggle(value)"
      >
        {{ label }}
      </q-chip>
    </div>

    <div
      v-else
      class="col row items-center q-input-target"
      :class="[`text-${align}`]"
      v-html="actualValue"
    ></div>

    <q-icon slot="after" name="arrow_drop_down" class="q-if-control"></q-icon>
  </q-input-frame>
</template>

<script>
import clone from '../../utils/clone'
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
      default: 'radio',
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
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.multiple) {
        const opt = this.options.find(opt => opt.value === this.value)
        return opt ? opt.label : ''
      }

      const opt = this.selectedOptions.map(opt => opt.label)
      return opt.length ? opt.join(', ') : ''
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

      this.dialog = Dialog.create({
        title: this.title,
        message: this.message,
        onDismiss: () => {
          this.dialog = null
        },
        form: {
          select: {
            type: this.type,
            model: clone(this.value),
            items: this.options
          }
        },
        buttons: [
          this.cancelLabel,
          {
            label: this.okLabel,
            handler: data => {
              if (JSON.stringify(this.value) !== JSON.stringify(data.select)) {
                this.$emit('input', data.select)
                this.$emit('change', data.select)
              }
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
