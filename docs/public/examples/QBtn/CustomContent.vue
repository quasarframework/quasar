<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn color="teal">
      <q-icon left size="3em" name="map" />
      <div>Label</div>
    </q-btn>

    <q-btn round>
      <q-avatar size="42px">
        <img src="https://cdn.quasar.dev/img/avatar2.jpg">
      </q-avatar>
    </q-btn>

    <q-btn color="indigo" no-caps>
      Multiline<br>Button
    </q-btn>

    <q-btn color="deep-orange" push>
      <div class="row items-center no-wrap">
        <q-icon left name="map" />
        <div class="text-center">
          Custom<br>Content
        </div>
      </div>
    </q-btn>
  </div>
</template>
