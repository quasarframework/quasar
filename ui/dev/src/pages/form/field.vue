<template>
  <div class="q-layout-padding" :class="classes">
    <div style="max-width: 600px; margin-bottom: 100vh" class="q-gutter-y-md">
      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" :false-value="null" />
        <q-toggle :dark="dark" v-model="dense" label="Dense" />
        <q-toggle :dark="dark" v-model="border" label="Border" />
        <q-toggle :dark="dark" v-model="individualBorder" label="Individual Border" />
      </div>

      <h1>Field wrapper tests</h1>

      <q-field value="We count this" :dark="dark" :dense="dense" label="Field label" stack-label bottom-slots counter tabindex="0">
        <q-icon slot="before" name="event" />

        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>

        <div slot="hint">
          Field message
        </div>

        <q-icon slot="after" name="search" />
      </q-field>

      <q-field :dark="dark" :dense="dense" label="Field label" stack-label bottom-slots tabindex="0">
        <q-icon slot="before" name="event" />

        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>

        <div slot="hint">
          Field message
        </div>

        <div slot="counter">
          3/12
        </div>

        <template v-slot:after>
          <q-icon name="search" />
          <q-icon name="delete" />
        </template>
      </q-field>

      <q-field :dark="dark" :dense="dense" label="Field label" stack-label tabindex="0">
        <q-icon slot="before" name="event" color="orange" />

        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>

        <template v-slot:after>
          <q-icon name="search" color="primary" />
          <q-icon name="delete" color="red" />
        </template>
      </q-field>

      <q-field :dark="dark" :dense="dense" label="Field label" stack-label bottom-slots tabindex="0">
        <q-icon slot="before" name="event" />

        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>

        <div slot="hint">
          Field message
        </div>

        <div slot="counter">
          3/12
        </div>

        <q-spinner slot="after" />
      </q-field>

      <q-field :dark="dark" :dense="dense" label="Field label" stack-label bottom-slots tabindex="0">
        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>

        <div slot="hint">
          Field message
        </div>
        <div slot="counter">
          3/12
        </div>
      </q-field>

      <q-field :dark="dark" :dense="dense" label="Field label" stack-label bottom-slots tabindex="0">
        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>
        <div slot="counter">
          3/12
        </div>
      </q-field>

      <q-field :dark="dark" :dense="dense" label="Field label" stack-label tabindex="0">
        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>
      </q-field>

      <q-field :dark="dark" :dense="dense" label="Field label" stack-label bottom-slots tabindex="0">
        <q-btn slot="before" flat round dense icon="event" />

        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>

        <div slot="hint">
          Field message
        </div>

        <div slot="counter">
          3/12
        </div>

        <q-btn slot="after" flat round dense icon="delete" />
      </q-field>

      <p class="caption">
        Item aligned test
      </p>
      <q-field :dark="dark" :dense="dense" item-aligned label="Field label" stack-label bottom-slots tabindex="0">
        <q-icon slot="before" name="event" />

        <template v-slot:control>
          <div>
            Field content
          </div>
        </template>

        <div slot="hint">
          Field message
        </div>

        <div slot="counter">
          3/12
        </div>

        <q-icon slot="after" name="search" />
      </q-field>
      <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item</q-item-section>
      </q-item>

      <p class="caption">
        Control slot: {{ testValue }}
      </p>
      <q-field filled v-model="testValue" label="Tree Select - Single" tabindex="0">
        <template v-slot:control="{ id, floatingLabel, value, emitValue }">
          <input :id="id" :value="value" @input="e => emitValue(e.target.value)" v-show="floatingLabel">
        </template>
      </q-field>

      <q-field filled v-model="color" label="Pick a color" stack-label hint="Choose a color" tabindex="0">
        <template v-slot:control="{ id, value, emitValue }">
          <q-color class="col" no-header flat :id="id" :value="value" @input="emitValue" />
        </template>
      </q-field>

      <p class="caption">
        Tree select
      </p>
      <q-field filled :value="selected" label="Tree Select - Single" tabindex="0">
        <template v-slot:control>
          <div class="no-outline full-width">
            {{ selected }}
          </div>
        </template>
        <template v-slot:append>
          <q-icon
            name="expand_more"
            class="q-expansion-item__toggle-icon"
            :class="{ 'rotate-180': $refs.menu1 !== void 0 && $refs.menu1.showing === true }"
          />
        </template>
        <q-popup-proxy fit auto-close ref="menu1">
          <q-tree
            :nodes="props"
            default-expand-all
            :selected.sync="selected"
            node-key="label"
            class="bg-white"
          />
        </q-popup-proxy>
      </q-field>

      <q-field filled :value="tickedValue" label="Tree Select - Multiple" tabindex="2">
        <template v-slot:control>
          <div class="no-outline full-width">
            {{ tickedValue }}
          </div>
        </template>
        <template v-slot:append>
          <q-icon
            name="expand_more"
            class="q-expansion-item__toggle-icon"
            :class="{ 'rotate-180': $refs.menu2 !== void 0 && $refs.menu2.showing === true }"
          />
        </template>
        <q-popup-proxy fit ref="menu2">
          <q-tree
            :nodes="props"
            default-expand-all
            tick-strategy="leaf"
            :ticked.sync="ticked"
            node-key="label"
            class="bg-white"
          />
        </q-popup-proxy>
      </q-field>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: null,
      border: false,
      dense: false,
      individualBorder: false,

      selected: null,
      ticked: [],
      props: [
        {
          label: 'Satisfied customers',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          children: [
            {
              label: 'Good food',
              icon: 'restaurant_menu',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Good service',
              icon: 'room_service',
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings',
              icon: 'photo',
              children: [
                {
                  label: 'Happy atmosphere'
                },
                {
                  label: 'Good table presentation'
                },
                {
                  label: 'Pleasing decor'
                }
              ]
            }
          ]
        }
      ],

      testValue: 'Initial value',
      color: ''
    }
  },

  watch: {
    border (v) {
      v && (this.individualBorder = false)
    },

    individualBorder (v) {
      v && (this.border = false)
    }
  },

  computed: {
    classes () {
      return {
        'bg-black text-white': this.dark,
        'fields-border': this.border,
        'fields-individual-border': this.individualBorder
      }
    },

    tickedValue () {
      return this.ticked.join(', ')
    }
  }
}
</script>

<style lang="stylus">
.fields-border
  .q-field, .q-item
    border 1px solid currentColor

.fields-individual-border
  .q-field__before, .q-field__after, .q-field__content, .q-field__bottom, .q-item
    border 1px solid currentColor
</style>
