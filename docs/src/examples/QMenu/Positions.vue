<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-btn color="primary" label="Anchor/Self Menu" aria-haspopup="menu">
        <q-menu anchor="top right" self="top left">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>anchor="top right"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>self="top left"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Anchor/Self Menu" aria-haspopup="menu">
        <q-menu anchor="center middle" self="center middle">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>anchor="center middle"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>self="center middle"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Anchor/Self Menu" aria-haspopup="menu">
        <q-menu anchor="bottom right" self="bottom left">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>anchor="bottom right"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>self="bottom left"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu" aria-haspopup="menu">
        <q-menu :offset="[0, 20]">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>:offset="[0, 20]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>:offset="[0, 20]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu" aria-haspopup="menu">
        <q-menu :offset="[50, 10]">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>:offset="[50, 10]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>:offset="[50, 10]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu" aria-haspopup="menu">
        <q-menu :offset="[-50, 10]">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>:offset="[-50, 10]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>:offset="[-50, 10]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
