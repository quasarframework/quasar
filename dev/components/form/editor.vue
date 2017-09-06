<template>
  <div class="layout-padding">
    <q-editor
      v-model="model"
      :toolbar="[
        ['bold', 'italic', 'h1', 'p', 'link', 'gigi'],
        ['gogu', 'print'],
        ['bullet'],
        [{
          label: 'Font Size',
          options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
        }],
        [{
          label: 'Formatting',
          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
        }],
        [{
          label: 'Dropdown Test',
          options: ['gogu', 'outdent', 'indent', 'gigi']
        }],
        ['undo', 'redo']
      ]"
      :definitions="{
        gigi: {cmd: 'bold', icon: 'map', tip: 'Gigi bold'},
        bold: {icon: 'content_paste'},
        gogu: {tip: 'Custom', icon: 'account_balance', handler: vm => vm.runCmd('print')}
      }"
    />

    <p class="caption bg-yellow">Model</p>
    <span>{{ model }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: ''
    }
  }
}
</script>
