<template>
  <div class="q-pa-md q-gutter-sm">
    <q-toggle
      :label="`Model is ${blueModel} (default behaviour)`"
      v-model="blueModel"/>
    <br>
    <q-toggle
      :label="pinkModel"
      color="pink"
      false-value="Disagreed"
      true-value="Agreed"
      v-model="pinkModel"
    />
    <br>
    <q-toggle
      :false-value="42"
      :label="`Model is number ${greenModel}`"
      :true-value="13"
      color="green"
      v-model="greenModel"
    />
    <br>
    <q-toggle
      :false-value="true"
      :label="`Model is ${redModel} (flipped boolean)`"
      :true-value="false"
      color="red"
      v-model="redModel"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      blueModel: true,
      pinkModel: 'Agreed',
      greenModel: 42,
      redModel: true
    }
  }
}
</script>
