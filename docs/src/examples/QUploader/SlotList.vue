<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-uploader
      url="http://localhost:4444/upload"
      label="Custom list"
      multiple
    >
      <q-list slot="list" slot-scope="scope" separator>

        <q-item v-for="file in scope.files" :key="file.name">
          <q-item-section>
            <q-item-label>
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
    </q-uploader>
  </div>
</template>
