<template>
  <div class="q-pa-md">
    <div class="cursor-pointer">
      {{ nickname }}
      <q-popup-edit v-model="nickname" :validate="val => val.length > 5">
        <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
          <q-input
            autofocus
            dense
            :value="nickname"
            hint="Your nickname"
            :rules="[
              val => validate(value) || 'More than 5 chars required'
            ]"
            @input="emitValue"
          >
            <template v-slot:after>
              <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
              <q-btn flat dense color="positive" icon="check_circle" @click.stop="set" :disable="validate(value) === false || initialValue === value" />
            </template>
          </q-input>
        </template>
      </q-popup-edit>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nickname: 'Click me'
    }
  }
}
</script>
