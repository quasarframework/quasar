<template>
  <q-layout view="lHh LpR fFf">
    <q-page-container>
      <q-page padding class="bg-white q-pr-xl">
        <q-virtual-list
          type="table"
          style="max-height: 70vh"
          :virtual-list-item-size="48"
          :items="heavyList"
        >
          <template v-slot:before>
            <thead class="thead-sticky">
              <tr>
                <th v-for="column in columns" :key="column">
                  {{ column }} - thead 1
                </th>
              </tr>
              <tr>
                <th v-for="column in columns" :key="column">
                  {{ column }} - thead 2
                </th>
              </tr>
            </thead>
          </template>

          <template v-slot:after>
            <tfoot class="tfoot-sticky">
              <tr>
                <th v-for="column in columns" :key="column">
                  {{ column }} - tfoot 1
                </th>
              </tr>
              <tr>
                <th v-for="column in columns" :key="column">
                  {{ column }} - tfoot 2
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
        </q-virtual-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="stylus">
.thead-sticky tr > *,
.tfoot-sticky tr > *
  position sticky
  opacity 1
  z-index 1
  background-color black
  color white

.thead-sticky tr:last-child > *
  top 0

.tfoot-sticky tr:first-child > *
  bottom 0
</style>

<script>
const
  heavyList = [],
  columns = []

for (let i = 0; i < 10; i++) {
  columns.push('col' + (i + 1))
}

for (let i = 0; i < 1000; i++) {
  const row = {}

  for (let j = 0; j < columns.length; j++) {
    row[columns[j]] = 'row ' + (i + 1) + ' / col ' + (j + 1)
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
