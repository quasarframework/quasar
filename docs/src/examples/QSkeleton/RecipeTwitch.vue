<template>
  <div class="q-pa-md">
    <div style="max-width: 300px">
      <q-skeleton height="170px" square animation="fade" />

      <div class="row items-start no-wrap q-mt-sm">
        <q-skeleton size="56px" square animation="fade" />

        <div class="col q-pl-sm">
          <q-skeleton type="text" square width="30%" animation="fade" />
          <q-skeleton type="text" square height="12px" animation="fade" />
          <q-skeleton type="text" square height="12px" width="75%" animation="fade" />
        </div>
      </div>
    </div>
  </div>
</template>
