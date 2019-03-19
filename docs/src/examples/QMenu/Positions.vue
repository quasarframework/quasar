<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">

      <q-btn color="primary" label="Anchor/Self Menu">
        <q-menu
          anchor="top right"
          self="top left"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>anchor="top right"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>self="top left"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Anchor/Self Menu">
        <q-menu
          anchor="center middle"
          self="center middle"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>anchor="center middle"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>self="center middle"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Anchor/Self Menu">
        <q-menu
          anchor="bottom right"
          self="bottom left"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>anchor="bottom right"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>self="bottom left"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu">
        <q-menu
          :offset="[0, 20]"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[0, 20]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[0, 20]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu">
        <q-menu
          :offset="[50, 10]"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[50, 10]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[50, 10]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu">
        <q-menu
          :offset="[-50, 10]"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[-50, 10]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[-50, 10]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

    </div>
  </div>
</template>
