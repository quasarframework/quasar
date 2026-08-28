<template>
  <q-table v-bind="$attrs">
    <template v-slot:top-left="scope">
      <div class="top-left" :data-page="scope.pagination.page">left</div>
    </template>

    <template v-slot:top-selection="scope">
      <div class="top-sel" :data-page="scope.pagination.page">selection</div>
    </template>

    <template v-slot:body="scope">
      <tr class="body-row" :data-key="scope.key">
        <td>{{ scope.row.name }}</td>
        <td>{{ scope.row.calories }}</td>
      </tr>
    </template>

    <template v-slot:bottom-row="scope">
      <tr class="bottom-row" :data-cols="scope.cols.length">
        <td colspan="2">totals</td>
      </tr>
    </template>

    <template v-slot:bottom="scope">
      <div class="bottom-marginal" :data-page="scope.pagination.page">
        bottom
      </div>
    </template>

    <template v-slot:no-data="scope">
      <div class="nodata-marginal" :data-message="scope.message">empty</div>
    </template>
  </q-table>
</template>
