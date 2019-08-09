<template>
  <div class="q-layout-padding q-gutter-sm">
    <q-btn color="primary" icon="map">
      <q-menu>
        <q-list separator class="scroll" style="min-width: 100px">
          <q-btn color="primary" v-close-popup label="Shut up" icon="map" />
          <q-item clickable @click="showNotify">
            <q-item-section>
              <q-item-label>Does nothing</q-item-label>
              <q-item-label caption>
                Sublabel
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn color="primary" icon="map" :label="menu ? 'yes' : 'no'">
      <q-menu v-model="menu">
        <q-list link separator class="scroll" style="min-width: 100px">
          <q-btn color="primary" v-close-popup label="X Shut up" icon="map" @click="showNotify" />
          <q-item clickable @click="showNotify">
            <q-item-section>
              <q-item-label>X Does nothing</q-item-label>
              <q-item-label caption>
                sublabel
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn @click="dialog = true" label="Dialog" />
    {{ dialog }} {{ dialog2 }}
    <q-dialog v-model="dialog">
      <q-card class="q-pa-xl">
        <div class="q-gutter-md">
          <q-btn label="Close Dialog" v-close-popup />
          <q-btn label="Open Dialog" @click="dialog2 = true" />
          <q-btn label="Menu" color="primary">
            <q-menu>
              <q-list>
                <q-item clickable @click="dialog2 = true">
                  <q-item-section>
                    Open Dialog
                  </q-item-section>
                </q-item>
                <q-item v-close-popup clickable @click="dialog2 = true">
                  <q-item-section>
                    Close Menu and Open Dialog
                  </q-item-section>
                </q-item>
                <q-item v-for="n in 5" :key="n" v-close-popup clickable>
                  <q-item-section>Menu Item {{ n }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <q-dialog v-model="dialog2">
          <q-card class="q-pa-xl">
            <div class="q-gutter-md">
              <q-btn label="Close Dialog" v-close-popup />
              <q-btn label="Close 2 Dialogs" v-close-popup="2" />
              <q-btn label="Menu" color="primary">
                <q-menu>
                  <q-list>
                    <q-item v-for="n in 5" :key="n" v-close-popup clickable>
                      <q-item-section>Menu Item {{ n }}</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu anchor="top right" self="top left">
                        <q-list>
                          <q-item v-for="n in 5" :key="n" v-close-popup clickable>
                            <q-item-section>Menu Item {{ n }}</q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup="2">
                            <q-item-section>Close dialog 2</q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup="3">
                            <q-item-section>Close dialog 3</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>

              <q-btn label="Menu2">
                <q-menu>
                  <q-list>
                    <q-item
                      v-close-popup
                      clickable
                    >
                      <q-item-section>v-close-popup</q-item-section>
                    </q-item>

                    <q-item
                      v-for="n in 3"
                      :key="n"
                      clickable
                    >
                      <q-item-section>Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>

                      <q-menu anchor="top right" self="top left">
                        <q-list>
                          <q-item
                            v-close-popup
                            clickable
                          >
                            <q-item-section>v-close-popup</q-item-section>
                          </q-item>

                          <q-item clickable>
                            <q-item-section>Submenu autoclose</q-item-section>
                            <q-item-section side>
                              <q-icon name="keyboard_arrow_right" />
                            </q-item-section>
                            <q-menu auto-close anchor="top right" self="top left">
                              <q-list>
                                <q-item
                                  v-for="y in 3"
                                  :key="y"
                                  clickable
                                >
                                  <q-item-section>3rd level Label</q-item-section>
                                </q-item>
                              </q-list>
                            </q-menu>
                          </q-item>

                          <q-item clickable>
                            <q-item-section>Submenu closepopup</q-item-section>
                            <q-item-section side>
                              <q-icon name="keyboard_arrow_right" />
                            </q-item-section>
                            <q-menu anchor="top right" self="top left">
                              <q-list>
                                <q-item
                                  v-for="y in 3"
                                  :key="y"
                                  clickable
                                  v-close-popup
                                >
                                  <q-item-section>3rd level Label</q-item-section>
                                </q-item>
                              </q-list>
                            </q-menu>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-card>
        </q-dialog>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: false,

      dialog: false,
      dialog2: false
    }
  },
  methods: {
    showNotify () {
      console.log('@click')
    }
  }
}
</script>
