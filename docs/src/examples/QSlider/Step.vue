<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ basicModel }} (0 to 100, step 50)
    </q-badge>
    <q-slider
      v-model="basicModel"
      :step="50"
    />
    <q-badge color="secondary">
      Model: {{ redModel }} (0 to 100, step 25)
    </q-badge>
    <q-slider
      v-model="redModel"
      color="red"
      :step="25"
    />
    <q-badge color="secondary">
      Model: {{ greenModel }} (0 to 5, step 1)
    </q-badge>
    <q-slider
      v-model="greenModel"
      color="green"
      :min="0"
      :step="1"
      :max="5"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      basicModel: 50,
      redModel: 25,
      greenModel: 2
    }
  }
}
</script>
