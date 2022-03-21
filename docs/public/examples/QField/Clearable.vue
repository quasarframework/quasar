<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field color="orange" filled v-model="text" label="Label" stack-label clearable>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">Text is <q>{{text === null ? 'null' : text}}</q></div>
        </template>
        <template v-if="text === null" v-slot:append>
          <q-icon name="short_text" @click.stop="text = 'Some text'" class="cursor-pointer" />
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      text: ref('Some text')
    }
  }
}
</script>
