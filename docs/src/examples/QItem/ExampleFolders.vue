<template>
  <div class="q-pa-md q-gutter-md">
    <q-list bordered padding class="rounded-borders" style="max-width: 350px">
      <q-item-label header>Folders</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="folder" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Photos</q-item-label>
          <q-item-label caption>February 22nd, 2019</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" color="green" />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="folder" color="orange" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Movies</q-item-label>
          <q-item-label caption>March 1st, 2019</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="folder" color="teal" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Photos</q-item-label>
          <q-item-label caption>January 15th, 2019</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" />
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header>Files</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="assignment" color="grey" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Expenses spreadsheet</q-item-label>
          <q-item-label caption>March 2nd, 2019</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="place" color="grey" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Places to visit</q-item-label>
          <q-item-label caption>February 22, 2019</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" color="amber" />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="library_music" color="grey" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">My favorite song</q-item-label>
          <q-item-label caption>Singing it all day</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
