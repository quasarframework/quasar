<template>
  <div class="q-pa-md">
    <h5 class="q-mb-md">Column Resize Demo</h5>
    <p class="q-mb-md text-caption">
      Drag the edge of column headers to resize. Double-click to reset to auto width.
    </p>

    <div class="q-gutter-sm q-mb-md">
      <q-toggle v-model="dark" label="Dark mode" />
      <q-toggle v-model="dense" label="Dense" />
      <q-btn
        color="primary"
        label="Reset all widths"
        size="sm"
        @click="resetWidths"
      />
      <q-btn
        color="secondary"
        label="Set initial widths"
        size="sm"
        @click="setInitialWidths"
      />
    </div>

    <q-table
      title="Resizable Columns"
      :rows="rows"
      :columns="columns"
      row-key="id"
      resizable-columns
      :column-widths="columnWidths"
      :dark="dark"
      :dense="dense"
      bordered
      flat
      @column-resize="onColumnResize"
    />

    <q-card flat bordered class="q-mt-md" :dark="dark">
      <q-card-section>
        <div class="text-subtitle2">Current Column Widths:</div>
        <pre class="q-mt-sm">{{ JSON.stringify(columnWidths, null, 2) }}</pre>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mt-md" :dark="dark">
      <q-card-section>
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle2">Resize Events Log:</div>
          <q-space />
          <q-btn
            flat
            dense
            size="sm"
            label="Clear"
            @click="resizeEvents = []"
          />
        </div>
        <div v-if="resizeEvents.length === 0" class="text-grey">
          No resize events yet. Drag a column edge to resize.
        </div>
        <div
          v-for="(event, index) in resizeEvents"
          :key="index"
          class="text-caption q-mb-xs"
        >
          <q-badge :color="event.width === 'auto' ? 'orange' : 'primary'" class="q-mr-sm">
            {{ event.width === 'auto' ? 'reset' : 'resize' }}
          </q-badge>
          Column "{{ event.col.label }}" {{ event.width === 'auto' ? 'reset to auto' : `set to ${ event.width }px` }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const dark = ref(false)
    const dense = ref(false)
    const columnWidths = ref({})
    const resizeEvents = ref([])

    const columns = [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'amount', label: 'Amount', field: 'amount', align: 'right', format: val => `$${ val.toFixed(2) }` },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'date', label: 'Date', field: 'date', align: 'left' }
    ]

    const rows = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', amount: 1234.56, status: 'Active', date: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', amount: 2345.67, status: 'Pending', date: '2024-01-16' },
      { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', amount: 345.89, status: 'Active', date: '2024-01-17' },
      { id: 4, name: 'Alice Williams', email: 'alice.williams@example.com', amount: 4567.12, status: 'Inactive', date: '2024-01-18' },
      { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com', amount: 678.90, status: 'Active', date: '2024-01-19' }
    ]

    function onColumnResize (event) {
      console.log('Column resize event:', event)
      columnWidths.value = event.widths
      resizeEvents.value.unshift(event)
      if (resizeEvents.value.length > 10) {
        resizeEvents.value.pop()
      }
    }

    function resetWidths () {
      columnWidths.value = {}
    }

    function setInitialWidths () {
      columnWidths.value = {
        id: 60,
        name: 200,
        email: 250,
        amount: 120,
        status: 100,
        date: 120
      }
    }

    return {
      dark,
      dense,
      columns,
      rows,
      columnWidths,
      resizeEvents,
      onColumnResize,
      resetWidths,
      setInitialWidths
    }
  }
}
</script>
