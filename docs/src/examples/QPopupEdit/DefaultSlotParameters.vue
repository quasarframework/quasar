<template>
  <div class="q-pa-md">
    <div class="cursor-pointer">
      {{ nickname }}
      <q-popup-edit v-model="nickname" :validate="val => val.length > 5">
        <template v-slot="scope">
          <q-input
            autofocus
            dense
            :model-value="scope.value"
            hint="Your nickname"
            :rules="[
              val => scope.validate(scope.value) || 'More than 5 chars required'
            ]"
            @update:model-value="scope.emitValue"
          >
            <template v-slot:after>
              <q-btn
                flat dense color="negative" icon="cancel"
                @click.stop="scope.cancel"
              />

              <q-btn
                flat dense color="positive" icon="check_circle"
                @click.stop="scope.set"
                :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
              />
            </template>
          </q-input>
        </template>
      </q-popup-edit>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      nickname: ref('Click me')
    }
  }
}
</script>
