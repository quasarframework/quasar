<template>
  <div class="q-layout-padding q-gutter-y-md">
    <q-input filled v-model="inputModel" label="QInput 1" />
    <q-input autofocus filled v-model="inputModel" label="QInput 2" />
    <q-select filled v-model="selectModel" :options="options" use-input behavior="menu" label="QSelect 1 (menu)" />
    <q-select filled v-model="selectModel" :options="options" use-input behavior="dialog" label="QSelect 2 (dialog)" />

    <div>
      <q-separator spaced />
    </div>

    <q-input filled v-model="inputModel" label="QInput 3 (set ID)" :for="forInput" />
    <q-input filled v-model="forInput" label="ID for above QInput" />

    <div>
      <q-separator spaced />
    </div>

    <q-select filled v-model="selectModel" :options="options" use-input behavior="menu" label="QSelect 3 (menu) (set ID) (autofocus)" :for="`menu_${forSelect}`" />
    <q-select filled v-model="selectModel" :options="options" use-input behavior="dialog" label="QSelect 3 (dialog) (set ID)" :for="`dialog_${forSelect}`" />
    <q-input filled v-model="forSelect" label="ID for above QSelect" />

    <div>
      <q-separator spaced />
    </div>

    <q-btn label="Toggle" @click="show = !show" />
    <q-input filled v-if="show" v-model="inputModel" label="QInput 4" />
    <q-select filled v-if="show" v-model="selectModel" :options="options" use-input behavior="menu" label="QSelect 5 (menu)" />
    <q-select filled v-if="show" v-model="selectModel" :options="options" use-input behavior="dialog" label="QSelect 5 (dialog)" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false,

      inputModel: '',
      selectModel: null,

      forInput: 'QInputId',
      forSelect: 'QSelectId',

      options: [ 'Option 1', 'Option 2', 'Option 3' ]
    }
  }
}
</script>
