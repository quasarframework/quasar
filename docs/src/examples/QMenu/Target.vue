<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">

      <p class="cursor-pointer non-selectable">I am groot!<br>(Click me!)
        <q-menu
          :target="true"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-menu>
              <q-item-section>Branches</q-item-section>
            </q-item>
            <q-item clickable v-close-menu>
              <q-item-section>Leaves</q-item-section>
            </q-item>
            <q-item clickable v-close-menu>
              <q-item-section>Roots</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </p>
    </div>
    <div class="row justify-center">

      <q-bar class="q-ml-md my-bar" >
        <div class="cursor-pointer non-selectable">File
          <q-menu
            :target="true"
          >
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-menu>
                <q-item-section>Open...</q-item-section>
              </q-item>
              <q-item clickable v-close-menu>
                <q-item-section>New</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top right" self="top left">
                  <q-list>
                      <q-item
                        v-for="n in 3"
                        :key="n"
                        clickable
                      >
                        <q-item-section>Submenu Label</q-item-section>
                        <q-item-section side>
                          <q-icon name="keyboard_arrow_right" />
                        </q-item-section>
                        <q-menu auto-close anchor="top right" self="top left">
                          <q-list>
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
              <q-item clickable v-close-menu>
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <div class="cursor-pointer non-selectable">Edit
          <q-menu
            :target="true"
          >
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-menu>
                <q-item-section>Cut</q-item-section>
              </q-item>
              <q-item clickable v-close-menu>
                <q-item-section>Copy</q-item-section>
              </q-item>
              <q-item clickable v-close-menu>
                <q-item-section>Paste</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-menu>
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
