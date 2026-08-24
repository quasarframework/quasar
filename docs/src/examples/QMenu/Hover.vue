<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-center">
      <q-btn color="primary" label="Hover me" aria-haspopup="menu">
        <q-menu hover auto-close>
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable>
              <q-item-section no-wrap>New tab</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section no-wrap>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Settings</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="secondary" label="With submenus" aria-haspopup="menu">
        <q-menu hover>
          <q-list role="menu" dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Open...</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>New</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable aria-haspopup="menu">
              <q-item-section>Preferences</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu hover anchor="top end" self="top start">
                <q-list role="menu" dense>
                  <q-item
                    v-for="n in 3"
                    :key="n"
                    clickable
                    aria-haspopup="menu"
                  >
                    <q-item-section no-wrap>Submenu Label</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu hover auto-close anchor="top end" self="top start">
                      <q-list role="menu" dense>
                        <q-item v-for="n in 3" :key="n" clickable>
                          <q-item-section no-wrap
                            >3rd level Label</q-item-section
                          >
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

      <q-btn color="accent" label="With delays" aria-haspopup="menu">
        <q-menu hover :hover-delay="300" :hover-hide-delay="600" auto-close>
          <q-list role="menu" style="min-width: 100px">
            <q-item clickable>
              <q-item-section no-wrap>Shows up after 300ms</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section no-wrap>Lingers for 600ms</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
