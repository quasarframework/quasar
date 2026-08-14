<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-btn color="primary" label="Flip Menu" aria-haspopup="menu">
        <q-menu transition-show="flip-right" transition-hide="flip-left">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Having fun</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Crazy for transitions</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Mind blown</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Scale Menu" aria-haspopup="menu">
        <q-menu transition-show="scale" transition-hide="scale">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Having fun</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Crazy for transitions</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Mind blown</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Jump Menu" aria-haspopup="menu">
        <q-menu transition-show="jump-down" transition-hide="jump-up">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Having fun</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Crazy for transitions</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Mind blown</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Rotate Menu" aria-haspopup="menu">
        <q-menu transition-show="rotate" transition-hide="rotate">
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Having fun</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Crazy for transitions</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Mind blown</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
