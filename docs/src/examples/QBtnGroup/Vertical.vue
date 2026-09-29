<template>
  <div class="q-pa-md row q-gutter-md items-start">
    <q-btn-group vertical>
      <q-btn color="primary" label="First" align="left" icon="timeline" />
      <q-btn color="primary" label="Second" align="left" icon="visibility" />
      <q-btn color="primary" label="Third" align="left" icon="update" />
    </q-btn-group>

    <q-btn-group vertical push>
      <q-btn push color="amber" text-color="black" glossy label="First" />
      <q-btn push color="amber" text-color="black" glossy label="Second" />
      <q-btn push color="amber" text-color="black" glossy label="Third" />
    </q-btn-group>

    <q-btn-group vertical spread style="height: 200px">
      <q-btn color="deep-orange" label="Spread" />
      <q-btn color="deep-orange" label="Vertically" />
    </q-btn-group>
  </div>
</template>
