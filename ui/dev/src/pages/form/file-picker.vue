<template>
  <div class="q-layout-padding">
    <form action="http://localhost:4444/upload" method="post" enctype="multipart/form-data" target="wind1" style="max-width: 600px;" class="q-gutter-y-md">
      <q-file name="file1" filled v-model="fileS" label="Single" clearable />
      <q-file name="file2" color="yellow" filled v-model="fileM" multiple label="Multiple" clearable />

      <q-file name="file3" color="accent" filled v-model="fileS" use-chips label="Single chips" clearable />
      <q-file name="file4" color="accent" filled v-model="fileM" multiple use-chips label="Multiple chips" clearable counter max-files="3" />

      <q-toggle v-model="showFileInput" label="Show copy file pickers" />

      <template v-if="showFileInput">
        <q-file name="file5" color="accent" filled v-model="fileS" use-chips label="Single chips" clearable />
        <q-file name="file6" color="accent" filled v-model="fileM" multiple use-chips label="Multiple chips" clearable counter max-files="3" />
      </template>

      <q-btn label="Move first file to single" @click="testMove" />

      <q-btn type="submit" label="Submit" />
    </form>

    <div class="q-mt-md">
      <q-file name="file1" filled v-model="multiAppend" label="Mutiple & Append" clearable multiple append />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      multiAppend: null,
      fileS: null,
      fileM: null,

      showFileInput: false
    }
  },

  methods: {
    testMove () {
      if (Array.isArray(this.fileM) === false || this.fileM.length === 0) {
        return
      }

      this.fileS = this.fileM.splice(0, 1)[ 0 ]
    }
  }
}
</script>
