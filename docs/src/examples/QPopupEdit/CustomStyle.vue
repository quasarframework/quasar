<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <div class="cursor-pointer" style="width: 100px">
        {{ label }}
        <q-popup-edit v-model="label" content-class="bg-accent text-white">
          <q-input dark color="white" v-model="label" dense autofocus counter>
            <template v-slot:append>
              <q-icon name="edit" />
            </template>
          </q-input>
        </q-popup-edit>
      </div>

      <div class="cursor-pointer" style="width: 100px">
        {{ label2 }}
        <q-popup-edit v-model="label2" :cover="false" :offset="[0, 10]">
          <q-input color="accent" v-model="label2" dense autofocus counter>
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
export default {
  data () {
    return {
      label: 'Click me',
      label2: 'Also click me'
    }
  }
}
</script>
