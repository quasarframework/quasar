<template>
  <div class="q-layout-padding">
    <div style="max-width: 600px;" class="q-gutter-y-md">
      <q-file filled v-model="fileS" label="Single" clearable />
      <q-file color="yellow" filled v-model="fileM" multiple label="Multiple" clearable />

      <q-file color="accent" filled v-model="fileS" use-chips label="Single chips" clearable />
      <q-file color="accent" filled v-model="fileM" multiple use-chips label="Multiple chips" clearable counter max-files="3" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fileS: null,
      fileM: null
    }
  }
}
</script>
