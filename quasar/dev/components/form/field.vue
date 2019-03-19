<template>
  <div class="q-layout-padding" :class="classes">
    <div style="max-width: 600px" class="q-gutter-y-md">
      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" />
        <q-toggle :dark="dark" v-model="border" label="Border" />
        <q-toggle :dark="dark" v-model="individualBorder" label="Individual Border" />
      </div>

      <h1>Field wrapper tests</h1>

      <q-field :dark="dark">
        <q-icon slot="before" name="event" />

        <div>Field content</div>

        <div slot="message">
          Field message
        </div>

        <div slot="counter">
          3/12
        </div>

        <q-icon slot="after" name="search" />
      </q-field>

      <q-field :dark="dark">
        <q-icon slot="before" name="event" />

        <div>Field content</div>

        <div slot="message">
          Field message
        </div>

        <div slot="counter">
          3/12
        </div>

        <q-icon slot="after" name="search" />
        <q-icon slot="after" name="delete" />
      </q-field>

      <q-field :dark="dark">
        <q-icon slot="before" name="event" color="orange" />

        <div>Field content</div>

        <q-icon slot="after" name="search" color="primary" />
        <q-icon slot="after" name="delete" color="red" />
      </q-field>

      <q-field :dark="dark">
        <q-icon slot="before" name="event" />

        <div>Field content</div>

        <div slot="message">
          Field message
        </div>

        <div slot="counter">
          3/12
        </div>

        <q-spinner slot="after" />
      </q-field>

      <q-field :dark="dark">
        <div>Field content</div>

        <div slot="message">
          Field message
        </div>
        <div slot="counter">
          3/12
        </div>
      </q-field>

      <q-field :dark="dark">
        <div>Field content</div>
        <div slot="counter">
          3/12
        </div>
      </q-field>

      <q-field :dark="dark">
        <div>Field content</div>
      </q-field>

      <q-field :dark="dark">
        <q-btn slot="before" flat round dense icon="event" />

        <div>Field content</div>

        <div slot="message">
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
      <q-field :dark="dark" item-aligned>
        <q-icon slot="before" name="event" />

        <div>Field content</div>

        <div slot="message">
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
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false,
      border: false,
      individualBorder: false
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
