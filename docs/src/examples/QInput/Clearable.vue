<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input clearable filled color="purple-12" v-model="text" label="Label" />

      <!-- equivalent -->
      <q-input color="orange" filled v-model="text" label="Label">
        <template v-if="text" v-slot:append>
          <q-icon name="close" @click.stop="text = null" class="cursor-pointer" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Some text'
    }
  }
}
</script>
