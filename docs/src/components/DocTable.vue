<template>
  <div>
    <q-table
      :rows="rows"
      :columns="validatedColumns"
      row-key="name"
      flat
      bordered
      hide-bottom
      :rows-per-page-options="[0]"
      style="width: fit-content;"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-badge
            color="brand-primary cursor-pointer"
            outline
            :label="props.row.name"
            @click="copy(props.row.name)"
            class="text-subtitle1"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props" class="text-body1" style="font-size: 1rem;">
          <span v-html="formatDescription(props.row.description)"></span>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { copyToClipboard, useQuasar } from 'quasar'

const props = defineProps({
  rows: {
    type: Array,
    required: true
  },
  additionalColumns: {
    type: Array,
    required: false,
    default: () => []
  }
})

const $q = useQuasar()

const requiredColumns = ref([
  { name: 'name', label: 'Class Name', align: 'left', field: row => row.name, headerStyle: 'font-weight: bold; font-size: 1rem;' },
  { name: 'description', label: 'Description', align: 'left', field: row => row.description, headerStyle: 'font-weight: bold; font-size: 1rem;' }
])

const validatedColumns = computed(() => {
  return [ ...requiredColumns.value, ...props.additionalColumns ]
})

const copy = (text) => {
  copyToClipboard(text)
    .then(() => {
      $q.notify('Copied to clipboard')
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        message: 'Failed to copy to clipboard'
      })
    })
}

const formatDescription = (description) => {
  return description.replace(/`([^`]+)`/g, '<code class="doc-token">$1</code>')
}
</script>
