<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field
        :loading="loadingState"
        filled
        label="Label"
        stack-label
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>
      </q-field>
      <q-toggle v-model="loadingState" label="Loading state" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Field content',
      loadingState: false
    }
  }
}
</script>
