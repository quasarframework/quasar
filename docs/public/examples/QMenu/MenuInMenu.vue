<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-center">

      <q-btn color="primary" label="Click me">
        <q-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Open...</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>New</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Preferences</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start">
                <q-list>
                  <q-item
                    v-for="n in 3"
                    :key="n"
                    dense
                    clickable
                  >
                    <q-item-section>Submenu Label</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu auto-close anchor="top end" self="top start">
                      <q-list>
                        <q-item
                          v-for="n in 3"
                          :key="n"
                          dense
                          clickable
                        >
                          <q-item-section>3rd level Label</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </q-list>
              </q-menu>

            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Quit</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-bar style="min-width: 250px;" class="bg-teal text-white rounded-borders">
        <div class="cursor-pointer non-selectable">
          File
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Open...</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>New</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list dense>
                    <q-item
                      v-for="n in 3"
                      :key="n"
                      clickable
                    >
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start">
                        <q-list dense>
                          <q-item
                            v-for="n in 3"
                            :key="n"
                            clickable
                          >
                            <q-item-section>3rd level Label</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>

              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <div class="cursor-pointer non-selectable">Edit
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Cut</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Copy</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Paste</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Select All</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <q-space />
        <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" />
        <q-btn dense flat icon="close" />
      </q-bar>
    </div>
  </div>
</template>
