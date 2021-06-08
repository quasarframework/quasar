<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-file filled v-model="model" label="Label (stacked)" stack-label />

      <q-file outlined v-model="model">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <q-file standout v-model="model">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>
      </q-file>

      <q-file filled bottom-slots v-model="model" label="Label" counter>
        <template v-slot:prepend>
          <q-icon name="cloud_upload" @click.stop />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-file>

      <q-file rounded outlined bottom-slots v-model="model" label="Label" counter max-files="12">
        <template v-slot:before>
          <q-icon name="attachment" />
        </template>

        <template v-slot:append>
          <q-icon v-if="model !== null" name="close" @click.stop="model = null" class="cursor-pointer" />
          <q-icon name="search" @click.stop />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-file>

      <q-file filled bottom-slots v-model="model" label="Label" counter max-files="12">
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg">
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon v-if="model !== null" name="close" @click.stop="model = null" class="cursor-pointer" />
          <q-icon name="create_new_folder" @click.stop />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-file>

      <q-file filled bottom-slots v-model="model" label="Label" counter max-files="12">
        <template v-slot:before>
          <q-icon name="folder_open" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" @click.stop />
        </template>
      </q-file>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null)
    }
  }
}
</script>
