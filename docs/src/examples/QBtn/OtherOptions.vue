<template>
  <div class="q-pa-md">
    <q-btn color="primary" class="block" icon="alarm" label="Block" />
    <q-btn color="teal" class="block q-mt-md" label="Block" />

    <q-btn color="black" class="full-width q-mt-md" label="Full-width" />

    <div class="q-gutter-sm q-mt-md">
      <q-btn color="indigo" no-caps>
        Multiline<br>Button
      </q-btn>

      <q-btn color="deep-orange" push>
        <div class="row no-wrap">
          <q-icon name="map" />
          <div class="q-ml-md">
            Custom<br>Content
          </div>
        </div>
      </q-btn>

      <q-btn color="primary" label="With Tooltip">
        <q-tooltip>I'm a tooltip</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
