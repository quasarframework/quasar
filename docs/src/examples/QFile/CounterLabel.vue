<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        v-model="files"
        label="Pick files"
        filled
        counter
        :counter-label="counterLabelFn"
        max-files="3"
        multiple
        style="max-width: 300px"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      files: null
    }
  },

  methods: {
    counterLabelFn ({ totalSize, filesNumber, maxFiles }) {
      return `${filesNumber} files of ${maxFiles} | ${totalSize}`
    }
  }
}
</script>
