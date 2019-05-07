<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div class="q-gutter-xs">
      <q-radio :dark="dark" v-model="type" val="filled" label="Filled" />
      <q-radio :dark="dark" v-model="type" val="outlined" label="Outlined" />
      <q-radio :dark="dark" v-model="type" val="standout" label="Standout" />
      <q-radio :dark="dark" v-model="type" val="standard" label="Standard" />
      <q-radio :dark="dark" v-model="type" val="borderless" label="Borderless" />
    </div>
    <div class="q-gutter-xs">
      <q-toggle :dark="dark" v-model="dark" label="Dark" />
      <q-toggle :dark="dark" v-model="dense" label="Dense" />
      <q-toggle :dark="dark" v-model="disable" label="Disable" />
      <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
      <q-toggle :dark="dark" v-model="hideBottomSpace" label="hide-bottom-space" />
      <q-toggle :dark="dark" v-model="prefSuf" label="Prefix + Suffix" />
      <q-toggle :dark="dark" v-model="hideHint" label="Hide Hint" />
      <q-toggle :dark="dark" v-model="square" label="Force square borders" />
      <div class="q-ma-lg">
        <q-slider v-model="fontSize" :min="8" :max="24" label-always />
      </div>
    </div>

    <div class="q-my-md">
      QField with/without label (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field class="col-6" v-bind="props" label="Field label" stack-label bottom-slots>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #hint>
          Hint
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>

      <q-field class="col-6" v-bind="props" bottom-slots>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #hint>
          Hint
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>

    <div class="q-my-md">
      QField with/without label and bottom slot (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field class="col-6" v-bind="props" label="Field label" stack-label bottom-slots>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #hint>
          Hint
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>

      <q-field class="col-6" v-bind="props">
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>

    <div class="q-my-md">
      QField with/without label and without bottom slot (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field class="col-6" v-bind="props" label="Field label" stack-label>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>

      <q-field class="col-6" v-bind="props">
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>

    <div class="q-my-md">
      QField , QInput, QSelect, QSelect use-input with label and bottom slot (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field class="col-3" v-bind="props" label="Field label" stack-label bottom-slots>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #hint>
          Hint
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>

      <q-input class="col-3" v-bind="props" v-model="text" label="Field label" stack-label bottom-slots>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #hint>
          Hint
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select class="col-3" v-bind="props" v-model="text" :options="options" label="Field label" stack-label bottom-slots>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #hint>
          Hint
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-select>

      <q-select class="col-3" v-bind="props" v-model="text" :options="options" use-input label="Field label" stack-label bottom-slots>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #hint>
          Hint
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-select>
    </div>

    <div class="q-my-md">
      QField , QInput, QSelect, QSelect use-input with label and bottom slot and without marginalia (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field class="col-3" v-bind="props" label="Field label" stack-label bottom-slots>
        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #hint>
          Hint
        </template>
      </q-field>

      <q-input class="col-3" v-bind="props" v-model="text" label="Field label" stack-label bottom-slots>
        <template #hint>
          Hint
        </template>
      </q-input>

      <q-select class="col-3" v-bind="props" v-model="text" :options="options" label="Field label" stack-label bottom-slots hide-dropdown-icon>
        <template #hint>
          Hint
        </template>
      </q-select>

      <q-select class="col-3" v-bind="props" v-model="text" :options="options" use-input label="Field label" stack-label bottom-slots hide-dropdown-icon>
        <template #hint>
          Hint
        </template>
      </q-select>
    </div>

    <div class="q-my-md">
      QField , QInput, QSelect, QSelect use-input with bottom slot and without label and marginalia (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field class="col-3" v-bind="props" bottom-slots>
        <template #control>
          <div>
            $$TSP
          </div>
        </template>

        <template #hint>
          Hint
        </template>
      </q-field>

      <q-input class="col-3" v-bind="props" v-model="text" bottom-slots>
        <template #hint>
          Hint
        </template>
      </q-input>

      <q-select class="col-3" v-bind="props" v-model="text" :options="options" bottom-slots hide-dropdown-icon>
        <template #hint>
          Hint
        </template>
      </q-select>

      <q-select class="col-3" v-bind="props" v-model="text" :options="options" use-input bottom-slots hide-dropdown-icon>
        <template #hint>
          Hint
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 'outlined',
      dark: false,
      dense: false,
      disable: false,
      readonly: false,
      prefSuf: true,
      hideHint: false,
      hideBottomSpace: false,
      square: false,

      prefix: '$',
      suffix: 'TSP',

      fontSize: 14,

      text: '$$TSP',
      options: ['$$TSP', '$$$$$']
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
    props () {
      return {
        [this.type]: true,
        hideBottomSpace: this.hideBottomSpace,
        dark: this.dark,
        hideHint: this.hideHint,
        disable: this.disable,
        readonly: this.readonly,
        prefix: this.prefix,
        suffix: this.suffix,
        dense: this.dense,
        square: this.square,
        style: { fontSize: `${this.fontSize}px` }
      }
    }
  }
}
</script>
