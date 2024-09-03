<template>
  <div class="q-layout-padding">
    <div class="q-gutter-y-md" style="max-width: 300px">
      <div>
        Search in console for $$('[data-test-attr]') and $$('[aria-owns]')
      </div>

      <q-field for="test1" label="QField - no slot" stack-label data-test-attr="test" />

      <q-field for="test2" label="QField - slot" stack-label data-test-attr="test">
        <template #control>
          <div>Control slot</div>
        </template>
      </q-field>

      <q-input for="test3" label="QInput" v-model="text" data-test-attr="test" />

      <q-select for="test4" label="QSelect - menu" v-model="sel" :options="options" behavior="menu" data-test-attr="test" />

      <q-select for="test5" label="QSelect - dialog" v-model="sel" :options="options" behavior="dialog" data-test-attr="test" />

      <q-select for="test6" label="QSelect - use input - menu" v-model="sel" :options="options" use-input behavior="menu" data-test-attr="test" />

      <q-select for="test7" label="QSelect - use input - dialog" v-model="sel" :options="options" use-input behavior="dialog" data-test-attr="test" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      sel: null,
      options: [ 'Opt 1', 'Opt 2' ]
    }
  }
}
</script>
