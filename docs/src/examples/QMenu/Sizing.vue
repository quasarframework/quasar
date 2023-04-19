<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn color="accent" label="Fit Menu" style="width: 280px;">

        <q-menu fit>
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Recent tabs</q-item-section>
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
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="brown" label="Max Height Menu">
        <q-menu max-height="130px">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Recent tabs</q-item-section>
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
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="indigo" label="Max Width Menu">
        <q-menu max-width="80px">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">New tab</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">New incognito tab</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">Recent tabs</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">History</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">Downloads</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">Settings</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">Help & Feedback</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

    </div>
  </div>
</template>
