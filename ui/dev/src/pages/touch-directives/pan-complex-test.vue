<template>
  <div class="q-layout-padding q-mx-auto" style="max-width: 600px">
    <h6>Pan the items below (QPullToRefresh on list)</h6>

    <div class="scroll q-pa-sm bg-grey-4" style="max-height: 75vh">
      <q-pull-to-refresh @refresh="refresh">
        <q-list bordered separator>
          <q-item>
            <q-item-section>
              <q-item-label>
                Drag from here for fallback pull to refresh
              </q-item-label>
              <q-slider v-model="slider" :min="0" :max="20" />
            </q-item-section>
          </q-item>

          <q-slide-item
            @left="onLeft"
            @right="onRight"
            @click="evt => onClick('ext', evt)"
          >
            <template v-slot:left>
              <q-icon name="alarm" />
            </template>
            <template v-slot:right>
              <q-icon name="alarm" />
            </template>
            <q-item>
              <q-item-section side class="q-gutter-y-sm">
                <q-btn
                  size="sm"
                  unelevated
                  color="primary"
                  label="Btn"
                  @click="evt => onClick('ext btn', evt)"
                />
                <q-btn
                  size="sm"
                  unelevated
                  color="primary"
                  to="#test"
                  label="Link"
                  @click="evt => onClick('ext a', evt)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Item LR
                  <q-slider v-model="slider" :min="0" :max="20" />
                </q-item-label>
              </q-item-section>
              <q-slide-item
                @left="onLeft"
                @right="onRight"
                @click="evt => onClick('int', evt)"
              >
                <template v-slot:left>
                  <q-icon name="alarm" />
                </template>
                <template v-slot:right>
                  <q-icon name="alarm" />
                </template>
                <q-item class="bg-yellow">
                  <q-item-section side class="q-gutter-y-sm">
                    <q-btn
                      size="sm"
                      unelevated
                      color="primary"
                      label="Btn"
                      @click="evt => onClick('int btn', evt)"
                    />
                    <q-btn
                      size="sm"
                      unelevated
                      color="primary"
                      to="#test"
                      label="Link"
                      @click="evt => onClick('int a', evt)"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      Item LR
                    </q-item-label>
                    <q-slider v-model="slider" :min="0" :max="20" />
                  </q-item-section>
                  <q-item-section side class="q-gutter-y-sm">
                    <q-chip size="md" square color="deep-orange" text-color="white">
                      Left
                    </q-chip>
                    <q-chip size="md" square color="deep-orange" text-color="white">
                      Right
                    </q-chip>
                  </q-item-section>
                </q-item>
              </q-slide-item>
              <q-item-section side class="q-gutter-y-sm">
                <q-chip size="md" square color="deep-orange" text-color="white">
                  Left
                </q-chip>
                <q-chip size="md" square color="deep-orange" text-color="white">
                  Right
                </q-chip>
              </q-item-section>
            </q-item>
          </q-slide-item>

          <q-slide-item
            @left="onLeft"
            @right="onRight"
            @click="evt => onClick('ext', evt)"
          >
            <template v-slot:left>
              <q-icon name="alarm" />
            </template>
            <template v-slot:right>
              <q-icon name="alarm" />
            </template>
            <q-item>
              <q-item-section side class="q-gutter-y-sm">
                <q-btn
                  size="sm"
                  unelevated
                  color="primary"
                  label="Btn"
                  @click="evt => onClick('ext btn', evt)"
                />
                <q-btn
                  size="sm"
                  unelevated
                  color="primary"
                  to="#test"
                  label="Link"
                  @click="evt => onClick('ext a', evt)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Item LR
                  <q-slider v-model="slider" :min="0" :max="20" />
                </q-item-label>
              </q-item-section>
              <q-slide-item
                @top="onTop"
                @bottom="onBottom"
                @click="evt => onClick('int', evt)"
              >
                <template v-slot:top>
                  <q-icon name="alarm" />
                </template>
                <template v-slot:bottom>
                  <q-icon name="alarm" />
                </template>
                <q-item class="bg-yellow">
                  <q-item-section side class="q-gutter-y-sm">
                    <q-btn
                      size="sm"
                      unelevated
                      color="primary"
                      label="Btn"
                      @click="evt => onClick('int btn', evt)"
                    />
                    <q-btn
                      size="sm"
                      unelevated
                      color="primary"
                      to="#test"
                      label="Link"
                      @click="evt => onClick('int a', evt)"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      Item TB
                    </q-item-label>
                    <q-slider v-model="slider" :min="0" :max="20" />
                  </q-item-section>
                  <q-item-section side class="q-gutter-y-sm">
                    <q-chip size="md" square color="deep-orange" text-color="white">
                      Top
                    </q-chip>
                    <q-chip size="md" square color="deep-orange" text-color="white">
                      Bottom
                    </q-chip>
                  </q-item-section>
                </q-item>
              </q-slide-item>
              <q-item-section side class="q-gutter-y-sm">
                <q-chip size="md" square color="deep-orange" text-color="white">
                  Left
                </q-chip>
                <q-chip size="md" square color="deep-orange" text-color="white">
                  Right
                </q-chip>
              </q-item-section>
            </q-item>
          </q-slide-item>

          <q-slide-item
            @left="onLeft"
            @top="onTop"
            @click="evt => onClick('ext', evt)"
          >
            <template v-slot:left>
              <q-icon name="alarm" />
            </template>
            <template v-slot:top>
              <q-icon name="alarm" />
            </template>
            <q-item>
              <q-item-section side class="q-gutter-y-sm">
                <q-btn
                  size="sm"
                  unelevated
                  color="primary"
                  label="Btn"
                  @click="evt => onClick('ext btn', evt)"
                />
                <q-btn
                  size="sm"
                  unelevated
                  color="primary"
                  to="#test"
                  label="Link"
                  @click="evt => onClick('ext a', evt)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Item LT
                </q-item-label>
                <q-slider v-model="slider" :min="0" :max="20" />
              </q-item-section>
              <q-slide-item
                @right="onRight"
                @bottom="onBottom"
                @click="evt => onClick('int', evt)"
              >
                <template v-slot:right>
                  <q-icon name="alarm" />
                </template>
                <template v-slot:bottom>
                  <q-icon name="alarm" />
                </template>
                <q-item class="bg-yellow">
                  <q-item-section side class="q-gutter-y-sm">
                    <q-btn
                      size="sm"
                      unelevated
                      color="primary"
                      label="Btn"
                      @click="evt => onClick('int btn', evt)"
                    />
                    <q-btn
                      size="sm"
                      unelevated
                      color="primary"
                      to="#test"
                      label="Link"
                      @click="evt => onClick('int a', evt)"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      Item RB
                    </q-item-label>
                    <q-slider v-model="slider" :min="0" :max="20" />
                  </q-item-section>
                  <q-item-section side class="q-gutter-y-sm">
                    <q-chip size="md" square color="deep-orange" text-color="white">
                      Right
                    </q-chip>
                    <q-chip size="md" square color="deep-orange" text-color="white">
                      Bottom
                    </q-chip>
                  </q-item-section>
                </q-item>
              </q-slide-item>
              <q-item-section side class="q-gutter-y-sm">
                <q-chip size="md" square color="deep-orange" text-color="white">
                  Left
                </q-chip>
                <q-chip size="md" square color="deep-orange" text-color="white">
                  Top
                </q-chip>
              </q-item-section>
            </q-item>
          </q-slide-item>

          <template v-for="index in items">
            <q-slide-item
              v-for="i in 7" :key="`${ i }_${ index }`"
              @left="onLeft"
              @right="onRight"
              @top="onTop"
              @bottom="onBottom"
              @click="evt => onClick('ext', evt)"
            >
              <template v-if="i === 1 || i === 5 || i === 7" v-slot:left>
                <q-icon name="alarm" />
              </template>
              <template v-if="i === 2 || i === 5 || i === 7" v-slot:right>
                <q-icon name="alarm" />
              </template>
              <template v-if="i === 3 || i === 6 || i === 7" v-slot:top>
                <q-icon name="alarm" />
              </template>
              <template v-if="i === 4 || i === 6 || i === 7" v-slot:bottom>
                <q-icon name="alarm" />
              </template>
              <q-item>
                <q-item-section side class="q-gutter-y-sm">
                  <q-btn
                    size="sm"
                    unelevated
                    color="primary"
                    label="Btn"
                    @click="evt => onClick('ext btn', evt)"
                  />
                  <q-btn
                    size="sm"
                    unelevated
                    color="primary"
                    to="#test"
                    label="Link"
                    @click="evt => onClick('ext a', evt)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    Item {{ index }}.{{ i }}
                  </q-item-label>
                  <q-slider v-model="slider" :min="0" :max="20" />
                </q-item-section>
                <q-item-section side class="q-gutter-y-sm">
                  <q-chip v-if="i === 1 || i === 5 || i === 7" size="md" square color="deep-orange" text-color="white">
                    Left
                  </q-chip>
                  <q-chip v-if="i === 2 || i === 5 || i === 7" size="md" square color="deep-orange" text-color="white">
                    Right
                  </q-chip>
                  <q-chip v-if="i === 3 || i === 6 || i === 7" size="md" square color="deep-orange" text-color="white">
                    Top
                  </q-chip>
                  <q-chip v-if="i === 4 || i === 6 || i === 7" size="md" square color="deep-orange" text-color="white">
                    Bottom
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-slide-item>
          </template>
        </q-list>
      </q-pull-to-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [ 1 ],
      slider: 10
    }
  },

  methods: {
    refresh (done) {
      setTimeout(() => {
        this.items.push(this.items.length + 1)
        done()
      }, 1000)
    },

    onLeft ({ reset }) {
      console.log('Left action!')
      this.finalize(reset)
    },
    onRight ({ reset }) {
      console.log('Right action!')
      this.finalize(reset)
    },
    onTop ({ reset }) {
      console.log('Top-side action!')
      this.finalize(reset)
    },
    onBottom ({ reset }) {
      console.log('Bottom-side action!')
      this.finalize(reset)
    },
    finalize (reset) {
      console.log('Resetting in 2 seconds')
      setTimeout(() => {
        reset()
      }, 2000)
    },

    onClick (msg, evt) {
      if (this.$q.platform.is.desktop) {
        console.log('vue click on', msg, evt)
      }
      else {
        this.$q.notify('vue click on ' + msg)
      }
    }
  }
}
</script>
