<template>
  <div class="app-environment q-pa-md">
    <div
      v-for="(category, categoryName) in data.env"
      :key="categoryName"
    >
      <div class="text-h5 q-mt-lg q-mb-md">{{ categoryName }}</div>
      <q-markup-table flat bordered wrap-cells>
        <tbody>
          <tr
            v-for="(entryValue, entryName) in category"
            :key="entryName"
          >
            <td>{{ entryName }}</td>
            <td>{{ entryValue }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script setup>
import data from 'src/assets/data.js'
</script>

<style lang="sass">
.app-environment
  border-left: 5px solid $ship-shell
  background: $void-suit

  td:nth-child(2)
    word-break: break-all
</style>
