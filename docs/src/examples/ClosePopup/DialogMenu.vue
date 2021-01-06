<template>
  <div class="q-pa-md">
    <q-btn label="Dialog" color="primary" @click="dialog = true" />

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="row items-center q-gutter-sm">
          <q-btn no-caps label="Open menu" color="primary">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup="2">
                  <q-item-section>Open...</q-item-section>
                </q-item>
                <q-item clickable v-close-popup="2">
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
                        <q-menu anchor="top end" self="top start">
                          <q-list>
                            <q-item
                              v-for="n in 3"
                              :key="n"
                              dense
                              clickable
                              v-close-popup="2"
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
                <q-item clickable v-close-popup="2">
                  <q-item-section>Quit</q-item-section>
                </q-item>
              </q-list>

            </q-menu>
          </q-btn>

          <q-btn no-caps label="Close dialog" color="primary" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false
    }
  }
}
</script>
