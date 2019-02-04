<template>
  <div class="q-pa-md">
    <q-uploader
      style="width: 100%"
      url="http://localhost:4444/upload"
      label="Custom list"
      bordered
      multiple
    >
      <q-list separator dense class="q-pa-sm" slot="list" slot-scope="props">

        <q-item v-ripple v-for="file in props.files" :key="file.name">
          <q-item-section v-if="file.__img" top thumbnail class="q-ml-none">
            <img :src="file.__img.src">
          </q-item-section>

          <q-item-section top>
            <q-item-label>{{ file.name }}</q-item-label>
            <q-item-label caption>{{ humanFileSize(file) }}</q-item-label>
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat dense round icon="delete" ></q-btn>
              <q-btn class="gt-xs" size="12px" flat dense round icon="done" ></q-btn>
              <q-btn size="12px" flat dense round icon="more_vert" ></q-btn>
            </div>
          </q-item-section>

        </q-item>

      </q-list>
    </q-uploader>
  </div>
</template>

<script>
export default {
  methods: {
    humanFileSize (file) {
      let i = Math.floor(Math.log(file.size) / Math.log(1024))
      return (file.size / Math.pow(1024, i)).toFixed(1) * 1 + ['B', 'kB', 'MB', 'GB', 'TB'][i]
    }
  }
}
</script>
