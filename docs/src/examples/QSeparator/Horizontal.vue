<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-card flat bordered style="max-width: 250px">
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn label="Share" color="primary" flat />
          <q-btn label="Comment" color="secondary" flat />
        </q-card-actions>
      </q-card>

      <q-list class="bg-grey-9 text-white shadow-2 rounded-borders" style="max-width: 250px; width: 100%;">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar6.jpg">
            </q-avatar>
          </q-item-section>
          <q-item-section>Jane</q-item-section>
        </q-item>

        <q-separator dark />

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar3.jpg">
            </q-avatar>
          </q-item-section>
          <q-item-section>Lily</q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg">
            </q-avatar>
          </q-item-section>
          <q-item-section>Mary</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
