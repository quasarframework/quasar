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

    <div class="row q-gutter-sm">
      <q-btn-dropdown persistent color="primary" label="Persistent">
        <q-list class="bg-white" separator clickable padding>
          <q-item clickable v-close-popup>
            <q-item-section>v-close-popup</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown color="primary" label="Regular">
        <q-list class="bg-white" separator clickable padding>
          <q-item clickable v-close-popup>
            <q-item-section>v-close-popup</q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section>Submenu (QMenu)</q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right" />
            </q-item-section>
            <q-menu>
              <q-list class="bg-white" separator clickable>
                <q-item clickable v-close-popup>
                  <q-item-section>v-close-popup</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>

          <q-item clickable>
            <q-item-section>Submenu (QMenu)</q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right" />
            </q-item-section>
            <q-menu auto-close>
              <q-list class="bg-white" separator clickable>
                <q-item clickable>
                  <q-item-section>auto-close</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>

          <q-item clickable>
            <q-item-section>Submenu (QPopupProxy)</q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right" />
            </q-item-section>
            <q-popup-proxy>
              <q-list class="bg-white" separator clickable>
                <q-item clickable v-close-popup>
                  <q-item-section>v-close-popup</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Submenu (QMenu)</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>
                  <q-menu>
                    <q-list class="bg-white" separator clickable>
                      <q-item clickable v-close-popup>
                        <q-item-section>v-close-popup</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-item clickable>
                  <q-item-section>Submenu (QMenu)</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>
                  <q-menu auto-close>
                    <q-list class="bg-white" separator clickable>
                      <q-item clickable>
                        <q-item-section>auto-close</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
              </q-list>
            </q-popup-proxy>
          </q-item>

          <q-item v-close-popup>
            <q-item-section side>
              <q-icon name="close" />
            </q-item-section>

            <q-item-section @click.stop>
              <q-select v-model="selection" :options="options" label="Select" />
            </q-item-section>
          </q-item>

          <q-item v-close-popup>
            <q-item-section side>
              <q-icon name="close" />
            </q-item-section>

            <q-item-section @click.stop>
              <q-input v-model="text" label="Option" />
            </q-item-section>

            <q-item-section side @click.stop>
              <q-avatar class="cursor-pointer">
                1
                <q-menu>
                  <q-list class="bg-white" separator clickable>
                    <q-item clickable v-close-popup>
                      <q-item-section @click="text = 'QMenu - v-close-popup'">
                        QMenu - v-close-popup
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-avatar>
            </q-item-section>

            <q-item-section side @click.stop>
              <q-avatar class="cursor-pointer">
                2
                <q-menu auto-close>
                  <q-list class="bg-white" separator clickable>
                    <q-item clickable>
                      <q-item-section @click="text = 'QMenu - auto-close'">
                        QMenu - auto-close
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-avatar>
            </q-item-section>

            <q-item-section side @click.stop>
              <q-avatar class="cursor-pointer">
                3
                <q-menu separate-close-popup>
                  <q-list class="bg-white" separator clickable>
                    <q-item clickable v-close-popup>
                      <q-item-section @click="text = 'QMenu - !close-as-tree - v-close-popup'">
                        QMenu - !close-as-tree - v-close-popup
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-avatar>
            </q-item-section>

            <q-item-section side @click.stop>
              <q-avatar class="cursor-pointer">
                4
                <q-menu separate-close-popup auto-close>
                  <q-list class="bg-white" separator clickable>
                    <q-item clickable>
                      <q-item-section @click="text = 'QMenu - !close-as-tree - auto-close'">
                        QMenu - !close-as-tree - auto-close
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-avatar>
            </q-item-section>

            <q-item-section side @click.stop>
              <q-avatar class="cursor-pointer">
                5
                <q-popup-proxy>
                  <q-list class="bg-white" separator clickable>
                    <q-item clickable v-close-popup>
                      <q-item-section @click="text = 'QPopupProxy - v-close-popup'">
                        QPopupProxy - v-close-popup
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-popup-proxy>
              </q-avatar>
            </q-item-section>

            <q-item-section side @click.stop>
              <q-avatar class="cursor-pointer">
                6
                <q-popup-proxy auto-close>
                  <q-list class="bg-white" separator clickable>
                    <q-item clickable>
                      <q-item-section @click="text = 'QPopupProxy - auto-close'">
                        QPopupProxy - auto-close
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-popup-proxy>
              </q-avatar>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-btn-dropdown color="primary" label="Regular">
                <q-list class="bg-white" separator clickable>
                  <q-item clickable v-close-popup>
                    <q-item-section>v-close-popup</q-item-section>
                  </q-item>

                  <q-item clickable>
                    <q-item-section>Submenu (QMenu)</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu>
                      <q-list class="bg-white" separator clickable>
                        <q-item clickable v-close-popup>
                          <q-item-section>v-close-popup</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>

                  <q-item clickable>
                    <q-item-section>Submenu (QMenu)</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu auto-close>
                      <q-list class="bg-white" separator clickable>
                        <q-item clickable>
                          <q-item-section>auto-close</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>

                  <q-item clickable>
                    <q-item-section>Submenu (QPopupProxy)</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-popup-proxy>
                      <q-list class="bg-white" separator clickable>
                        <q-item clickable v-close-popup>
                          <q-item-section>v-close-popup</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Submenu (QMenu)</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>
                          <q-menu>
                            <q-list class="bg-white" separator clickable>
                              <q-item clickable v-close-popup>
                                <q-item-section>v-close-popup</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Submenu (QMenu)</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>
                          <q-menu auto-close>
                            <q-list class="bg-white" separator clickable>
                              <q-item clickable>
                                <q-item-section>auto-close</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                      </q-list>
                    </q-popup-proxy>
                  </q-item>

                  <q-item v-close-popup>
                    <q-item-section side>
                      <q-icon name="close" />
                    </q-item-section>

                    <q-item-section @click.stop>
                      <q-input v-model="text" label="Option" />
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        1
                        <q-menu>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable v-close-popup>
                              <q-item-section @click="text = 'QMenu - v-close-popup'">
                                QMenu - v-close-popup
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        2
                        <q-menu auto-close>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable>
                              <q-item-section @click="text = 'QMenu - auto-close'">
                                QMenu - auto-close
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        3
                        <q-menu separate-close-popup>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable v-close-popup>
                              <q-item-section @click="text = 'QMenu - !close-as-tree - v-close-popup'">
                                QMenu - !close-as-tree - v-close-popup
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        4
                        <q-menu separate-close-popup auto-close>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable>
                              <q-item-section @click="text = 'QMenu - !close-as-tree - auto-close'">
                                QMenu - !close-as-tree - auto-close
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        5
                        <q-popup-proxy>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable v-close-popup>
                              <q-item-section @click="text = 'QPopupProxy - v-close-popup'">
                                QPopupProxy - v-close-popup
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-popup-proxy>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        6
                        <q-popup-proxy auto-close>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable>
                              <q-item-section @click="text = 'QPopupProxy - auto-close'">
                                QPopupProxy - auto-close
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-popup-proxy>
                      </q-avatar>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-btn-dropdown persistent color="primary" label="Persistent">
                <q-list class="bg-white" separator clickable>
                  <q-item clickable v-close-popup>
                    <q-item-section>v-close-popup</q-item-section>
                  </q-item>

                  <q-item clickable>
                    <q-item-section>Submenu (QMenu)</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu>
                      <q-list class="bg-white" separator clickable>
                        <q-item clickable v-close-popup>
                          <q-item-section>v-close-popup</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>

                  <q-item clickable>
                    <q-item-section>Submenu (QMenu)</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu auto-close>
                      <q-list class="bg-white" separator clickable>
                        <q-item clickable>
                          <q-item-section>auto-close</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>

                  <q-item clickable>
                    <q-item-section>Submenu (QPopupProxy)</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-popup-proxy>
                      <q-list class="bg-white" separator clickable>
                        <q-item clickable v-close-popup>
                          <q-item-section>v-close-popup</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Submenu (QMenu)</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>
                          <q-menu>
                            <q-list class="bg-white" separator clickable>
                              <q-item clickable v-close-popup>
                                <q-item-section>v-close-popup</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Submenu (QMenu)</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>
                          <q-menu auto-close>
                            <q-list class="bg-white" separator clickable>
                              <q-item clickable>
                                <q-item-section>auto-close</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                      </q-list>
                    </q-popup-proxy>
                  </q-item>

                  <q-item v-close-popup>
                    <q-item-section side>
                      <q-icon name="close" />
                    </q-item-section>

                    <q-item-section @click.stop>
                      <q-input v-model="text" label="Option" />
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        1
                        <q-menu>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable v-close-popup>
                              <q-item-section @click="text = 'QMenu - v-close-popup'">
                                QMenu - v-close-popup
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        2
                        <q-menu auto-close>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable>
                              <q-item-section @click="text = 'QMenu - auto-close'">
                                QMenu - auto-close
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        3
                        <q-menu separate-close-popup>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable v-close-popup>
                              <q-item-section @click="text = 'QMenu - !close-as-tree - v-close-popup'">
                                QMenu - !close-as-tree - v-close-popup
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        4
                        <q-menu separate-close-popup auto-close>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable>
                              <q-item-section @click="text = 'QMenu - !close-as-tree - auto-close'">
                                QMenu - !close-as-tree - auto-close
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        5
                        <q-popup-proxy>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable v-close-popup>
                              <q-item-section @click="text = 'QPopupProxy - v-close-popup'">
                                QPopupProxy - v-close-popup
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-popup-proxy>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <q-avatar class="cursor-pointer">
                        6
                        <q-popup-proxy auto-close>
                          <q-list class="bg-white" separator clickable>
                            <q-item clickable>
                              <q-item-section @click="text = 'QPopupProxy - auto-close'">
                                QPopupProxy - auto-close
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-popup-proxy>
                      </q-avatar>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div>
      <q-btn label="Menu">
        <q-menu>
          <q-list class="bg-white">
            <q-item clickable>
              <q-item-section @click="dialog3 = true">
                Open dialog
              </q-item-section>
              <q-dialog v-model="dialog3">
                <div class="bg-white q-pa-lg">
                  <q-btn label="Menu">
                    <q-menu>
                      <q-list class="bg-white">
                        <q-item clickable v-close-popup>
                          <q-item-section>v-close-popup</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Submenu (QMenu)</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>
                          <q-menu>
                            <q-list class="bg-white" separator clickable>
                              <q-item clickable v-close-popup>
                                <q-item-section>v-close-popup</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                        <q-item clickable>
                          <q-item-section @click="dialog3 = false">
                            close dialog (model)
                          </q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section v-close-popup="2">
                            close dialog (v-close-popup="2")
                          </q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section v-close-popup="3">
                            close dialog and menu (v-close-popup="3")
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </q-dialog>
            </q-item>

            <q-item clickable>
              <q-item-section @click="dialog4 = true">
                Open dialog - persistent
              </q-item-section>
              <q-dialog v-model="dialog4" persistent>
                <div class="bg-white q-pa-lg">
                  <q-btn label="Menu">
                    <q-menu>
                      <q-list class="bg-white">
                        <q-item clickable v-close-popup>
                          <q-item-section>v-close-popup</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Submenu (QMenu)</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>
                          <q-menu>
                            <q-list class="bg-white" separator clickable>
                              <q-item clickable v-close-popup>
                                <q-item-section>v-close-popup</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                        <q-item clickable>
                          <q-item-section @click="dialog4 = false">
                            close dialog (model)
                          </q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section v-close-popup="2">
                            try to close dialog (v-close-popup="2")
                          </q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section v-close-popup="3">
                            try to close dialog and menu (v-close-popup="3")
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </q-dialog>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: false,

      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,

      text: 'text',

      selection: 'item 1',
      options: [ 'item 1', 'item 2' ]
    }
  },
  methods: {
    showNotify () {
      console.log('@click')
    }
  }
}
</script>
