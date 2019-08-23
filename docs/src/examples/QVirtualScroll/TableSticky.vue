<template>
  <div class="q-pa-md">
    <q-virtual-scroll
      type="table"
      style="max-height: 70vh"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="heavyList"
    >
      <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th v-for="column in columns" :key="column">
              {{ column }} - thead 1
            </th>
          </tr>
        </thead>
      </template>

      <template v-slot:after>
        <tfoot class="tfoot-sticky text-left">
          <tr>
            <th v-for="column in columns" :key="column">
              {{ column }} - tfoot 1 - sticky
            </th>
          </tr>
        </tfoot>
      </template>

      <template v-slot="{ item: row, index: rowNr }">
        <tr :key="rowNr">
          <td v-for="column in columns" :key="column">
            <div>{{ row[column] }}</div>
            <div v-if="rowNr % 3 === 0">
              {{ row[column] }} again
            </div>
            <div v-if="rowNr % 5 === 0">
              {{ row[column] }} again again
            </div>
          </td>
        </tr>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<style lang="stylus">
.thead-sticky tr > *,
.tfoot-sticky tr > *
  position sticky
  opacity 1
  z-index 1
  background black
  color white

.thead-sticky tr:last-child > *
  top 0

.tfoot-sticky tr:first-child > *
  bottom 0
</style>

<script>
const
  heavyList = [],
  columns = [],
  listSize = 10000

for (let i = 0; i < 30; i++) {
  columns.push('col' + (i + 1))
}

for (let i = 0; i <= listSize; i++) {
  const row = {}

  for (let j = 0; j < columns.length; j++) {
    row[columns[j]] = '#' + i + ' row ' + (i + 1) + ' / col ' + (j + 1)
  }
  heavyList.push(row)
}

Object.freeze(heavyList)

export default {
  data () {
    return {
      heavyList,
      columns
    }
  }
}
</script>
