<template>
  <div>
    <div class="text-subtitle2 q-pb-md">Parent Properties (container)</div>
    <div class="row wrap justify-start content-stretch">
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="containerGroup" :options="containerOptions" label="Container" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="directionGroup" :options="directionOptions" label="Direction" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="wrapGroup" :options="wrapOptions" label="Wrap" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="justifyGroup" :options="justifyOptions" label="Justify Content" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="itemsGroup" :options="itemsOptions" label="Align Items" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="contentGroup" :options="contentOptions" label="Align Content" emit-value map-options dense options-dense />
      </div>
    </div>
    <div class="text-weight-medium q-mt-sm">Container Classes</div>
    <q-input filled v-model="classes" dense readonly class="q-py-sm" />
    <div class="text-subtitle2 float-left">Results <span class="text-weight-thin">(children: {{ children.length }}/10)</span></div>
    <q-btn class="float-right" label="Add Child" icon="add" dense flat :disabled="children.length >= 10" @click="addChild" />
    <div class="row full-width bg-blue-grey-2" style="min-height: 400px">
      <div id="parent" :class="classes" style="overflow: hidden;">
        <child v-for="(child, index) in children" :key="index"
          :ref="'child' + index"
          :index="index"
          :selected-index="selectedIndex"
          @delete="onDelete"
          @change="onChange"
        />
      </div>
    </div>
    <div class="text-weight-medium q-mt-sm">Child Classes</div>
    <q-input filled v-model="childClasses" dense readonly class="q-py-sm" />
    <div class="text-weight-medium q-mt-sm">Child Styles</div>
    <q-input filled v-model="childStyles" dense readonly class="q-py-sm" />
  </div>
</template>

<script>
import Child from './FlexChild'

export default {
  name: 'FlexPlayground',

  components: {
    Child
  },

  data () {
    return {
      containerGroup: 'fit',
      containerOptions: [
        { label: 'none', value: '' },
        { label: 'fit', value: 'fit' },
        { label: 'full-width', value: 'full-width' },
        { label: 'full-height', value: 'full-height' }
      ],
      directionGroup: 'row',
      directionOptions: [
        { label: 'row', value: 'row' },
        { label: 'row inline', value: 'row inline' },
        { label: 'column', value: 'column' },
        { label: 'column inline', value: 'column inline' },
        { label: 'row reverse', value: 'row reverse' },
        { label: 'column reverse', value: 'column reverse' }
      ],
      wrapGroup: 'wrap',
      wrapOptions: [
        { label: 'none', value: '' },
        { label: 'wrap', value: 'wrap' },
        { label: 'no-wrap', value: 'no-wrap' },
        { label: 'reverse-wrap', value: 'reverse-wrap' }
      ],
      justifyGroup: 'justify-start',
      justifyOptions: [
        { label: 'none', value: '' },
        { label: 'justify-start', value: 'justify-start' },
        { label: 'justify-end', value: 'justify-end' },
        { label: 'justify-center', value: 'justify-center' },
        { label: 'justify-between', value: 'justify-between' },
        { label: 'justify-around', value: 'justify-around' },
        { label: 'justify-evenly', value: 'justify-evenly' }
      ],
      itemsGroup: 'items-start',
      itemsOptions: [
        { label: 'none', value: '' },
        { label: 'items-start', value: 'items-start' },
        { label: 'items-end', value: 'items-end' },
        { label: 'items-center', value: 'items-center' },
        { label: 'items-stretch', value: 'items-stretch' },
        { label: 'items-baseline', value: 'items-baseline' }
      ],
      contentGroup: 'content-start',
      contentOptions: [
        { label: 'none', value: '' },
        { label: 'content-start', value: 'content-start' },
        { label: 'content-end', value: 'content-end' },
        { label: 'content-center', value: 'content-center' },
        { label: 'content-stretch', value: 'content-stretch' },
        { label: 'content-between', value: 'content-between' },
        { label: 'content-around', value: 'content-around' }
      ],
      children: [],
      childClasses: '',
      childStyles: '',
      selectedIndex: 0
    }
  },

  mounted () {
    this.addChild()
  },

  computed: {
    classes () {
      return (this.containerGroup +
        ' ' + this.directionGroup +
        ' ' + this.wrapGroup +
        ' ' + this.justifyGroup +
        ' ' + this.itemsGroup +
        ' ' + this.contentGroup)
        .replace(/,/g, ' ')
        .replace(/' '/g, ' ')
    }
  },

  methods: {
    addChild () {
      if (this.children.length < 10) {
        this.children.push({})
      }
    },
    onDelete (index) {
      this.children.splice(index, 1)
    },
    onChange (index) {
      this.selectedIndex = index
      let child = this.$refs['child' + index][0]
      this.childClasses = child.classes
      this.childStyles = child.styles
    }
  }
}
</script>

<style lang="sass" scoped>
.row > div
  padding: 8px
  background: rgba(227,242,253,.6)
  border: 1px solid rgba(187,222,251,.9)

.row + .row
  margin-top: 1rem

.column > div
  padding: 8px
  background: rgba(227,242,253,.6)
  border: 1px solid rgba(187,222,251,.9)

.column > .col
  padding: 5px 2px
</style>
