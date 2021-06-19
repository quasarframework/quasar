<template>
  <div>
    <div class="q-layout-padding row q-col-gutter-md">
      <div class="col-12 col-md-6 col-xl-3">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              Animation, autofocus for select and <strong>input type text filled</strong>
            </div>
          </q-card-section>

          <q-separator />

          <q-stepper
            v-model="step1"
            vertical
            color="primary"
            animated
            header-nav
          >
            <q-step
              :name="1"
              title="Step 1"
              icon="settings"
              :done="step1 > 1"
            >
              <q-input
                :autofocus="autofocus"
                v-model="inputTextModel"
              />
            </q-step>

            <q-step
              :name="2"
              title="Step 2"
              caption="Caption"
              icon="create_new_folder"
              :done="step1 > 2"
            >
              <q-select
                v-model="selectModel"
                :options="options"
                :autofocus="autofocus"
              />
            </q-step>

            <q-step
              :name="3"
              title="Step 3"
              icon="assignment"
            >
              <q-input
                :autofocus="autofocus"
                v-model="inputTextModel"
              />
            </q-step>
            <q-step
              :name="4"
              title="Step 4"
              caption="Disabled"
              icon="assignment"
              disable
            >
              <q-input
                :autofocus="autofocus"
                v-model="inputTextModel"
              />
            </q-step>
          </q-stepper>

          <q-card-actions align="right">
            <q-btn
              color="primary"
              :label="step1 === 4 ? 'Reset' : 'Next step'"
              @click="step1 === 4 ? step1 = 0 : step1++"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              Animation, autofocus for select and <strong>input type text empty</strong>
            </div>
          </q-card-section>

          <q-separator />

          <q-stepper
            v-model="step2"
            vertical
            color="primary"
            animated
            header-nav
          >
            <q-step
              :name="1"
              title="Step 1"
              icon="settings"
              :done="step2 > 1"
            >
              <q-input
                :autofocus="autofocus"
                v-model="inputEmptyModel"
              />
            </q-step>

            <q-step
              :name="2"
              title="Step 2"
              caption="Caption"
              icon="create_new_folder"
              :done="step2 > 2"
            >
              <q-select
                v-model="selectModel"
                :options="options"
                :autofocus="autofocus"
              />
            </q-step>

            <q-step
              :name="3"
              title="Step 3"
              icon="assignment"
            >
              <q-input
                :autofocus="autofocus"
                v-model="inputEmptyModel"
              />
            </q-step>
            <q-step
              :name="4"
              title="Step 4"
              caption="Disabled"
              icon="assignment"
              disable
            >
              <q-input
                :autofocus="autofocus"
                v-model="inputEmptyModel"
              />
            </q-step>
          </q-stepper>

          <q-card-actions align="right">
            <q-btn
              color="primary"
              :label="step2 === 4 ? 'Reset' : 'Next step'"
              @click="step2 === 4 ? step2 = 0 : step2++"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              Animation, autofocus for select and <strong>input type number filled</strong>
            </div>
          </q-card-section>

          <q-separator />

          <q-stepper
            v-model="step3"
            vertical
            color="primary"
            animated
            header-nav
          >
            <q-step
              :name="1"
              title="Step 1"
              icon="settings"
              :done="step3 > 1"
            >
              <q-input
                type="number"
                :autofocus="autofocus"
                v-model="inputNumModel"
              />
            </q-step>

            <q-step
              :name="2"
              title="Step 2"
              caption="Caption"
              icon="create_new_folder"
              :done="step3 > 2"
            >
              <q-select
                v-model="selectModel"
                :options="options"
                :autofocus="autofocus"
              />
            </q-step>

            <q-step
              :name="3"
              title="Step 3"
              icon="assignment"
            >
              <q-input
                type="number"
                :autofocus="autofocus"
                v-model="inputNumModel"
              />
            </q-step>
            <q-step
              :name="4"
              title="Step 4"
              caption="Disabled"
              icon="assignment"
              disable
            >
              <q-input
                type="number"
                :autofocus="autofocus"
                v-model="inputNumModel"
              />
            </q-step>
          </q-stepper>

          <q-card-actions align="right">
            <q-btn
              color="primary"
              :label="step3 === 4 ? 'Reset' : 'Next step'"
              @click="step3 === 4 ? step3 = 0 : step3++"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              Animation, autofocus for select and <strong>field</strong>
            </div>
          </q-card-section>

          <q-separator />

          <q-stepper
            v-model="step4"
            vertical
            color="primary"
            animated
            header-nav
          >
            <q-step
              :name="1"
              title="Step 1"
              icon="settings"
              :done="step4 > 1"
            >
              <q-field
                :autofocus="autofocus"
                tabindex="0"
              >
                <template v-slot:control>
                  <div>
                    Field content
                  </div>
                </template>
              </q-field>
            </q-step>

            <q-step
              :name="2"
              title="Step 2"
              caption="Caption"
              icon="create_new_folder"
              :done="step4 > 2"
            >
              <q-select
                v-model="selectModel"
                :options="options"
                :autofocus="autofocus"
              />
            </q-step>

            <q-step
              :name="3"
              title="Step 3"
              icon="assignment"
            >
              <q-field
                :autofocus="autofocus"
                tabindex="0"
              >
                <template v-slot:control>
                  <div>
                    Field content
                  </div>
                </template>
              </q-field>
            </q-step>
            <q-step
              :name="4"
              title="Step 4"
              caption="Disabled"
              icon="assignment"
              disable
            >
              <q-field
                :autofocus="autofocus"
                tabindex="0"
              >
                <template v-slot:control>
                  <div>
                    Field content
                  </div>
                </template>
              </q-field>
            </q-step>
          </q-stepper>

          <q-card-actions align="right">
            <q-btn
              color="primary"
              :label="step4 === 4 ? 'Reset' : 'Next step'"
              @click="step4 === 4 ? step4 = 0 : step4++"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      step1: 1,
      step2: 1,
      step3: 1,
      step4: 1,
      inputTextModel: 'Text',
      inputEmptyModel: null,
      inputNumModel: 1,
      selectModel: 'Opt 1',
      options: [ 'Opt 1', 'Opt 2', 'Opt 3' ],
      autofocus: true
    }
  }
}
</script>
