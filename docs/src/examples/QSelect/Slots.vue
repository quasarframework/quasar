<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
        :options="[]"
        filled
        label="Slot for empty options"
        v-model="empty">
      <div class="q-pa-sm" slot="no-option">
        There are no options :(
      </div>
    </q-select>

    <q-select
        :options="options"
        filled
        label="Custom slot for selected values"
        stack-label
        v-model="selected">
      <div class="q-pa-sm" slot="selected">
        Selected company:
        <q-chip icon="person" v-if="selected">{{selected}}</q-chip>
      </div>
    </q-select>

    <q-select
        :options="options"
        filled
        label="Scoped slot for selected value"
        stack-label
        v-model="selected">
      <div class="q-pa-sm" slot="selected" slot-scope="props">
        {{props.opt}} is on index {{props.index}}
      </div>
    </q-select>

    <q-select
        :options="options"
        filled
        label="Scoped slot for option"
        stack-label
        v-model="selected">
      <q-item @click.native="props.toggleOption(props.opt)"
              @mouseover.native="props.setOptionIndex(props.index)"
              clickable
              slot="option"
              slot-scope="props">
        {{props.opt}} {{props.focused? ` is focused on index ${props.index}` : ''}}
      </q-item>
    </q-select>

    <q-select
        :options="options"
        bottom-slots
        filled
        label="With bottom slots enabled"
        stack-label
        v-model="selected">
      <div slot="hint">
        I am hinting you from bottom slot ;)
      </div>
    </q-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      empty: undefined,
      selected: 'Facebook',
      options: ['Google', 'Facebook', 'Twitter']
    }
  }
}
</script>
