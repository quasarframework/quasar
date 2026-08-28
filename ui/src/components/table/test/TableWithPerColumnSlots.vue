<template>
  <q-table v-bind="$attrs">
    <template v-slot:header-cell-name="scope">
      <th class="header-name">{{ scope.col.label }}</th>
    </template>

    <template v-slot:header-cell-calories="scope">
      <th class="header-calories">{{ scope.col.label }}</th>
    </template>

    <template v-slot:body-cell-name="scope">
      <td class="cell-name" :data-value="scope.row.name">
        {{ scope.row.name }}
      </td>
    </template>

    <template v-slot:body-cell-calories="scope">
      <td class="cell-calories" :data-value="scope.row.calories">
        {{ scope.row.calories }}
      </td>
    </template>
  </q-table>
</template>
