<template>
  <div :class="classes" :style="styles" @click="emitChange">
    <div class="row justify-between items-center">
      <q-btn :label="index" size="sm" flat dense :class="buttonClasses" @click="emitChange" />
      <q-btn :icon="mdiClose" size="xs" flat dense @click="onDelete"/>
    </div>
    <q-input filled v-model="child.width" dense label="Width (ex: '200px', '20em')" @update:model-value="emitChange">
      <template v-if="child.width.length > 0" v-slot:append>
        <q-btn :icon="mdiClose" size="xs" flat dense @click="child.width = ''"/>
      </template>
    </q-input>

    <q-input filled v-model="child.height" dense label="Height (ex: '300px', '25em')" @update:model-value="emitChange">
      <template v-if="child.height.length > 0" v-slot:append>
        <q-btn :icon="mdiClose" size="xs" flat dense @click="child.height = ''"/>
      </template>
    </q-input>
    <q-select color="blue-12" v-model="child.widthGroup" :options="widthOptions" label="Width" emit-value map-options dense options-dense @update:model-value="emitChange" />
    <q-select color="blue-12" v-model="child.breakpointGroup" :options="breakpointOptions" label="Break Points" multiple emit-value map-options clearable dense options-dense @update:model-value="emitChange" />
    <q-select color="blue-12" v-model="child.alignmentGroup" :options="alignmentOptions" label="Alignment Options" emit-value map-options dense options-dense @update:model-value="emitChange" />
    <q-select color="blue-12" v-model="child.offsetGroup" :options="offsetOptions" label="Offset Options" emit-value map-options dense options-dense @update:model-value="emitChange" />
    <q-select color="blue-12" v-model="child.gutterGroup" :options="gutterOptions" label="Gutter Options" multiple emit-value map-options clearable dense options-dense @update:model-value="emitChange" />
    <q-select color="blue-12" v-model="child.colGutterGroup" :options="colGutterOptions" label="Col Gutter Options" multiple emit-value map-options clearable dense options-dense @update:model-value="emitChange" />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { mdiClose, mdiCloseCircle } from '@quasar/extras/mdi-v5'

const widthOptions = [
  { label: 'none', value: '' },
  { label: 'col', value: 'col' },
  { label: 'col-auto', value: 'col-auto' },
  { label: 'col-grow', value: 'col-grow' },
  { label: 'col-shrink', value: 'col-shrink' },
  { label: 'col-1', value: 'col-1' },
  { label: 'col-2', value: 'col-2' },
  { label: 'col-3', value: 'col-3' },
  { label: 'col-4', value: 'col-4' },
  { label: 'col-5', value: 'col-5' },
  { label: 'col-6', value: 'col-6' },
  { label: 'col-7', value: 'col-7' },
  { label: 'col-8', value: 'col-8' },
  { label: 'col-9', value: 'col-9' },
  { label: 'col-10', value: 'col-10' },
  { label: 'col-11', value: 'col-11' },
  { label: 'col-12', value: 'col-12' }
]

const breakpointOptions = [
  { label: 'col-xs-1', value: 'col-xs-1' },
  { label: 'col-xs-2', value: 'col-xs-2' },
  { label: 'col-xs-3', value: 'col-xs-3' },
  { label: 'col-xs-4', value: 'col-xs-4' },
  { label: 'col-xs-5', value: 'col-xs-5' },
  { label: 'col-xs-6', value: 'col-xs-6' },
  { label: 'col-xs-7', value: 'col-xs-7' },
  { label: 'col-xs-8', value: 'col-xs-8' },
  { label: 'col-xs-9', value: 'col-xs-9' },
  { label: 'col-xs-10', value: 'col-xs-10' },
  { label: 'col-xs-11', value: 'col-xs-11' },
  { label: 'col-xs-12', value: 'col-xs-12' },
  { label: 'col-sm-1', value: 'col-sm-1' },
  { label: 'col-sm-2', value: 'col-sm-2' },
  { label: 'col-sm-3', value: 'col-sm-3' },
  { label: 'col-sm-4', value: 'col-sm-4' },
  { label: 'col-sm-5', value: 'col-sm-5' },
  { label: 'col-sm-6', value: 'col-sm-6' },
  { label: 'col-sm-7', value: 'col-sm-7' },
  { label: 'col-sm-8', value: 'col-sm-8' },
  { label: 'col-sm-9', value: 'col-sm-9' },
  { label: 'col-sm-10', value: 'col-sm-10' },
  { label: 'col-sm-11', value: 'col-sm-11' },
  { label: 'col-sm-12', value: 'col-sm-12' },
  { label: 'col-md-1', value: 'col-md-1' },
  { label: 'col-md-2', value: 'col-md-2' },
  { label: 'col-md-3', value: 'col-md-3' },
  { label: 'col-md-4', value: 'col-md-4' },
  { label: 'col-md-5', value: 'col-md-5' },
  { label: 'col-md-6', value: 'col-md-6' },
  { label: 'col-md-7', value: 'col-md-7' },
  { label: 'col-md-8', value: 'col-md-8' },
  { label: 'col-md-9', value: 'col-md-9' },
  { label: 'col-md-10', value: 'col-md-10' },
  { label: 'col-md-11', value: 'col-md-11' },
  { label: 'col-md-12', value: 'col-md-12' },
  { label: 'col-lg-1', value: 'col-lg-1' },
  { label: 'col-lg-2', value: 'col-lg-2' },
  { label: 'col-lg-3', value: 'col-lg-3' },
  { label: 'col-lg-4', value: 'col-lg-4' },
  { label: 'col-lg-5', value: 'col-lg-5' },
  { label: 'col-lg-6', value: 'col-lg-6' },
  { label: 'col-lg-7', value: 'col-lg-7' },
  { label: 'col-lg-8', value: 'col-lg-8' },
  { label: 'col-lg-9', value: 'col-lg-9' },
  { label: 'col-lg-10', value: 'col-lg-10' },
  { label: 'col-lg-11', value: 'col-lg-11' },
  { label: 'col-lg-12', value: 'col-lg-12' },
  { label: 'col-xl-1', value: 'col-xl-1' },
  { label: 'col-xl-2', value: 'col-xl-2' },
  { label: 'col-xl-3', value: 'col-xl-3' },
  { label: 'col-xl-4', value: 'col-xl-4' },
  { label: 'col-xl-5', value: 'col-xl-5' },
  { label: 'col-xl-6', value: 'col-xl-6' },
  { label: 'col-xl-7', value: 'col-xl-7' },
  { label: 'col-xl-8', value: 'col-xl-8' },
  { label: 'col-xl-9', value: 'col-xl-9' },
  { label: 'col-xl-10', value: 'col-xl-10' },
  { label: 'col-xl-11', value: 'col-xl-11' },
  { label: 'col-xl-12', value: 'col-xl-12' }
]

const alignmentOptions = [
  { label: 'none', value: '' },
  { label: 'self-start', value: 'self-start' },
  { label: 'self-end', value: 'self-end' },
  { label: 'self-center', value: 'self-center' },
  { label: 'self-stretch', value: 'self-stretch' },
  { label: 'self-baseline', value: 'self-baseline' }
]

const offsetOptions = [
  { label: 'none', value: '' },
  { label: 'offset-1', value: 'offset-1' },
  { label: 'offset-2', value: 'offset-2' },
  { label: 'offset-3', value: 'offset-3' },
  { label: 'offset-4', value: 'offset-4' },
  { label: 'offset-5', value: 'offset-5' },
  { label: 'offset-6', value: 'offset-6' },
  { label: 'offset-7', value: 'offset-7' },
  { label: 'offset-8', value: 'offset-8' },
  { label: 'offset-9', value: 'offset-9' },
  { label: 'offset-10', value: 'offset-10' },
  { label: 'offset-11', value: 'offset-11' },
  { label: 'offset-12', value: 'offset-12' }
]

const gutterOptions = [
  { label: 'q-gutter-xs', value: 'q-gutter-xs' },
  { label: 'q-gutter-sm', value: 'q-gutter-sm' },
  { label: 'q-gutter-md', value: 'q-gutter-md' },
  { label: 'q-gutter-lg', value: 'q-gutter-lg' },
  { label: 'q-gutter-xl', value: 'q-gutter-xl' },
  { label: 'q-gutter-x-xs', value: 'q-gutter-x-xs' },
  { label: 'q-gutter-x-sm', value: 'q-gutter-x-sm' },
  { label: 'q-gutter-x-md', value: 'q-gutter-x-md' },
  { label: 'q-gutter-x-lg', value: 'q-gutter-x-lg' },
  { label: 'q-gutter-x-xl', value: 'q-gutter-x-xl' },
  { label: 'q-gutter-y-xs', value: 'q-gutter-y-xs' },
  { label: 'q-gutter-y-sm', value: 'q-gutter-y-sm' },
  { label: 'q-gutter-y-md', value: 'q-gutter-y-md' },
  { label: 'q-gutter-y-lg', value: 'q-gutter-y-lg' },
  { label: 'q-gutter-y-xl', value: 'q-gutter-y-xl' }
]

const colGutterOptions = [
  { label: 'q-col-gutter-xs', value: 'q-col-gutter-xs' },
  { label: 'q-col-gutter-sm', value: 'q-col-gutter-sm' },
  { label: 'q-col-gutter-md', value: 'q-col-gutter-md' },
  { label: 'q-col-gutter-lg', value: 'q-col-gutter-lg' },
  { label: 'q-col-gutter-xl', value: 'q-col-gutter-xl' },
  { label: 'q-col-gutter-x-xs', value: 'q-col-gutter-x-xs' },
  { label: 'q-col-gutter-x-sm', value: 'q-col-gutter-x-sm' },
  { label: 'q-col-gutter-x-md', value: 'q-col-gutter-x-md' },
  { label: 'q-col-gutter-x-lg', value: 'q-col-gutter-x-lg' },
  { label: 'q-col-gutter-x-xl', value: 'q-col-gutter-x-xl' },
  { label: 'q-col-gutter-y-xs', value: 'q-col-gutter-y-xs' },
  { label: 'q-col-gutter-y-sm', value: 'q-col-gutter-y-sm' },
  { label: 'q-col-gutter-y-md', value: 'q-col-gutter-y-md' },
  { label: 'q-col-gutter-y-lg', value: 'q-col-gutter-y-lg' },
  { label: 'q-col-gutter-y-xl', value: 'q-col-gutter-y-xl' }
]

export default {
  name: 'FlexChild',

  props: {
    index: Number,
    selectedIndex: Number,
    child: Object
  },

  setup (props, { emit }) {
    function onDelete () {
      emit('delete', props.index)
    }

    function emitChange () {
      emit('change', props.index)
    }

    onMounted(emitChange)

    const buttonClasses = computed(() => {
      return 'text-white ' + (props.index === props.selectedIndex ? 'bg-brand-primary' : 'bg-grey')
    })

    const styles = computed(() => {
      return ('overflow: auto;' +
        (props.child.height ? (' min-height: ' + props.child.height + '; max-height: ' + props.child.height + '; ') : '') +
        (props.child.width ? (' min-width: ' + props.child.width + '; max-width: ' + props.child.width + ';') : '')
      ).trim()
    })

    const classes = computed(() => {
      return (props.child.widthGroup +
        ' ' + (props.child.breakpointGroup === null ? '' : props.child.breakpointGroup) +
        ' ' + props.child.alignmentGroup +
        ' ' + props.child.offsetGroup +
        ' ' + (props.child.gutterGroup === null ? '' : props.child.gutterGroup) +
        ' ' + (props.child.colGutterGroup === null ? '' : props.child.colGutterGroup))
        .replace(/,/g, ' ')
        .replace(/  +/g, ' ')
        .trim()
    })

    return {
      mdiClose,
      mdiCloseCircle,

      widthOptions,
      breakpointOptions,
      alignmentOptions,
      offsetOptions,
      gutterOptions,
      colGutterOptions,

      onDelete,
      emitChange,

      buttonClasses,
      styles,
      classes
    }
  }
}
</script>

<style lang="sass" scoped>
.child
  min-width: 100px
</style>
