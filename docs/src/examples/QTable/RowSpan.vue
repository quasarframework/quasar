<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :data="rowsData"
      :columns="columns"
      :pagination.sync="pagination"
      :rows-per-page-options="[3, 6, 9, 12, 15, 18, 0]"
      row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props">
          <template v-for="cell in props.row.cells">
            <q-td v-if="cell.rowspan" :key="cell.value" :rowspan="cell.rowspan" class="text-center">{{ cell.value }}</q-td>
            <q-td v-else :key="cell.value" class="text-center">{{ cell.value }}</q-td>
          </template>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 9
      },
      columns: [
        { name: 'name', label: 'Dessert (100g serving)', align: 'center' },
        { name: 'treats', align: 'center', label: 'Treats' },
        { name: 'quantity', align: 'center', label: 'Quantity' }
      ],
      rowsData: [
        {
          cells: [
            { value: 'Frozen Yogurt', rowspan: 3 },
            { value: 'Calories' },
            { value: '159' }
          ]
        },
        {
          cells: [
            { value: 'Fat (g)' },
            { value: '6' }
          ]
        },
        {
          cells: [
            { value: 'Carbs (g)' },
            { value: '24' }
          ]
        },
        {
          cells: [
            { value: 'Ice cream sandwich', rowspan: 3 },
            { value: 'Calories' },
            { value: '237' }
          ]
        },
        {
          cells: [
            { value: 'Fat (g)' },
            { value: '9' }
          ]
        },
        {
          cells: [
            { value: 'Carbs (g)' },
            { value: '37' }
          ]
        },
        {
          cells: [
            { value: 'Eclair', rowspan: 3 },
            { value: 'Calories' },
            { value: '262' }
          ]
        },
        {
          cells: [
            { value: 'Fat (g)' },
            { value: '16' }
          ]
        },
        {
          cells: [
            { value: 'Carbs (g)' },
            { value: '23' }
          ]
        }
      ]
    }
  }
}
</script>
