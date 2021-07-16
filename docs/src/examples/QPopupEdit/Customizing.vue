<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <div class="cursor-pointer" style="width: 100px">
        {{ label }}
        <q-popup-edit v-model="label" class="bg-accent text-white" v-slot="scope">
          <q-input dark color="white" v-model="scope.value" dense autofocus counter @keyup.enter="scope.set">
            <template v-slot:append>
              <q-icon name="edit" />
            </template>
          </q-input>
        </q-popup-edit>
      </div>

      <div class="cursor-pointer" style="width: 100px">
        {{ label2 }}
        <q-popup-edit v-model="label2" :cover="false" :offset="[0, 10]" v-slot="scope">
          <q-input color="accent" v-model="scope.value" dense autofocus counter @keyup.enter="scope.set">
            <template v-slot:prepend>
              <q-icon name="record_voice_over" color="accent" />
            </template>
          </q-input>
        </q-popup-edit>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      label: ref('Click me'),
      label2: ref('Also click me')
    }
  }
}
</script>
