<template>
  <div class="layout-padding button-toggle-group-test">
    <p class="caption">
      <span>Model: </span>
      <strong>{{ model }}</strong>
    </p>

    <q-btn-toggle-group
      v-model="model"
      toggle-color="primary"
      push
      glossy
      :options="[
        {label: 'One', value: 'one'},
        {label: 'Two', value: 'two'},
        {label: 'Three', value: 'three'}
      ]"
    />

    <q-btn-toggle-group
      v-model="model"
      toggle-color="primary"
      push
      glossy
      :options="[
        {label: 'One', icon: 'filter_1', value: 'one'},
        {label: 'Two', icon: 'filter_2', value: 'two'},
        {label: 'Three', icon: 'filter_3', value: 'three'}
      ]"
    />

    <q-btn-toggle-group
      v-model="model"
      toggle-color="primary"
      push
      glossy
      :options="[
        {icon: 'filter_1', value: 'one'},
        {icon: 'filter_2', value: 'two'},
        {icon: 'filter_3', value: 'three'}
      ]"
    />

    <q-btn-toggle-group
      v-model="model"
      toggle-color="primary"
      push
      glossy
      :options="[
        {label: 'One', iconRight: 'filter_1', value: 'one'},
        {label: 'Two', iconRight: 'filter_2', value: 'two'},
        {label: 'Three', iconRight: 'filter_3', value: 'three'}
      ]"
    />

    <q-btn-toggle-group
      v-model="model"
      toggle-color="primary"
      push
      glossy
      :options="[
        {label: 'One', value: 'one'},
        {label: 'Two', toggleColor: 'yellow', value: 'two'},
        {label: 'Three', toggleColor: 'red', value: 'three'}
      ]"
    />
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

<style lang="stylus">
.button-toggle-group-test .q-btn-toggle-group
  margin 15px
</style>
