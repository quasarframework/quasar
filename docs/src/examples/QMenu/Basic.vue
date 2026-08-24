<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn color="primary" label="Basic Menu" aria-haspopup="menu">
        <q-menu>
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>New tab</q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Recent tabs</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Downloads</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section no-wrap>Help &amp; Feedback</q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="secondary" label="Auto-Close Menu" aria-haspopup="menu">
        <q-menu auto-close>
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable>
              <q-item-section no-wrap>New tab</q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable>
              <q-item-section no-wrap>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section no-wrap>Recent tabs</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Downloads</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section no-wrap>Help &amp; Feedback</q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>

      <div
        class="inline bg-amber rounded-borders cursor-pointer"
        style="max-width: 300px"
        role="button"
        tabindex="0"
        aria-haspopup="menu"
      >
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          I am groot!<br />(Click me! Using touch-position)
        </div>

        <q-menu touch-position>
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Branches</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Leaves</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Roots</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
  </div>
</template>
