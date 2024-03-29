<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-uploader
      ref="uploaderRef"
      url="http://localhost:4444/upload"
      label="Custom list"
      multiple
    >
      <template v-slot:list="scope">
        <q-list separator>

          <q-item v-for="file in scope.files" :key="file.__key">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>

              <q-item-label caption>
                Status: {{ file.__status }}
              </q-item-label>

              <q-item-label caption>
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </q-item-label>
            </q-item-section>

            <q-item-section
              v-if="file.__img"
              thumbnail
              class="gt-xs"
            >
              <img :src="file.__img.src">
            </q-item-section>

            <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="scope.removeFile(file)"
               />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-uploader>

    <q-btn class="q-mt-md" color="primary" label="Notify files.length" no-caps @click="logFiles" />

    <div class="q-ml-sm text-h6">Files Count: {{ files.length }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Notify } from 'quasar'

const uploaderRef = ref()
const files = computed(() => uploaderRef.value?.files || [])

function logFiles () {
  Notify.create({
    message: `There are ${ uploaderRef.value?.files.length } files`
  })
}
</script>
