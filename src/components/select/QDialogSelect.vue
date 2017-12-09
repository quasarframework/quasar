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

    :focused="focused"
    focusable
    :length="length"
    :additional-length="additionalLength"

    @click.native="pick"
    @focus.native="__onFocus"
    @blur.native="__onBlur"
  >
    <div
      v-if="hasChips"
      class="col row items-center group q-input-chips"
      :class="alignClass"
    >
      <q-chip
        v-for="{label, value, disable: optDisable} in selectedOptions"
        :key="label"
        small
        :closable="!disable && !optDisable"
        :color="color"
        @click.native.stop
        @hide="__toggleMultiple(value, disable || optDisable)"
      >
        {{ label }}
      </q-chip>
    </div>

    <div
      v-else
      class="col row items-center q-input-target"
      :class="alignClass"
      v-html="actualValue"
    ></div>

    <q-icon
      v-if="!disable && clearable && length"
      slot="after"
      name="cancel"
      class="q-if-control"
      @click.stop="clear"
    ></q-icon>
    <q-icon slot="after" :name="$q.icon.select.dropdown" class="q-if-control"></q-icon>
  </q-input-frame>
</template>

<script>
import clone from '../../utils/clone'
import SelectMixin from '../../mixins/select'

export default {
  name: 'q-dialog-select',
  mixins: [SelectMixin],
  props: {
    okLabel: String,
    cancelLabel: String,
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
    type () {
      return this.multiple
        ? (this.toggle ? 'toggle' : 'checkbox')
        : 'radio'
    }
  },
  methods: {
    pick () {
      if (this.disable) {
        return
      }

      // TODO
      this.dialog = this.$q.dialog({
        title: this.title || this.$q.i18n.label.select,
        message: this.message,
        color: this.color,
        options: {
          type: this.type,
          model: clone(this.value),
          items: this.options
        },
        cancel: this.cancelLabel || true,
        ok: this.okLabel || true
      }).then(data => {
        this.dialog = null
        if (JSON.stringify(this.value) !== JSON.stringify(data)) {
          this.$emit('input', data)
          this.$emit('change', data)
        }
      }).catch(() => {
        this.dialog = null
      })
    },
    hide () {
      return this.dialog
        ? this.dialog.hide()
        : Promise.resolve()
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
