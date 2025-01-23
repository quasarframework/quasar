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
            @click="copyToClipboard(props.row.name)"
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

<script>
import { copyToClipboard } from 'quasar'

export default {
  props: {
    rows: {
      type: Array,
      required: true
    },
    additionalColumns: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data () {
    return {
      requiredColumns: [
        { name: 'name', label: 'Class Name', align: 'left', field: row => row.name, headerStyle: 'font-weight: bold; font-size: 1rem;' },
        { name: 'description', label: 'Description', align: 'left', field: row => row.description, headerStyle: 'font-weight: bold; font-size: 1rem;' }
      ]
    }
  },
  computed: {
    validatedColumns () {
      return [ ...this.requiredColumns, ...this.additionalColumns ]
    }
  },
  methods: {
    copyToClipboard (text) {
      copyToClipboard(text)
        .then(() => {
          this.$q.notify('Copied to clipboard')
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            message: 'Failed to copy to clipboard'
          })
        })
    },
    formatDescription (description) {
      return description.replace(/`([^`]+)`/g, '<code class="doc-token">$1</code>')
    }
  }
}
</script>
