<template>
  <div>
    <div class="layout-padding input-example" style="max-width: 600px;">
      <q-input v-model="text" />
      <q-input v-model="text" stack-label="Stack Label" />
      <q-input v-model="text" float-label="Float Label" placeholder="Gigi" />

      <q-input v-model="number" type="number" prefix="$" float-label="Number" />
      <q-input v-model="text" suffix="@gmail.com" float-label="Clearable" clearable />
      <q-input v-model="text" type="password" float-label="Password" />

      <q-input disable v-model="text" float-label="Float Label" placeholder="Gigi" />

      <br><br>

      <q-field
        icon="wifi"
        label="Some Label"
        :count="10"
        labelHint="Some Label Hint"
        helper="Some helper"
        :error="error"
        error-label="Some error"
      >
        <q-input
          v-model="text"
          float-label="Textfield"
        />
      </q-field>

      <q-field
        icon="wifi"
        helper="Some helper"
        :error="error"
        error-label="Some error"
      >
        <q-input
          v-model="text"
          float-label="Textfield"
          :error="error"
        />
      </q-field>

      <br><br>

      <q-input v-model="area" type="textarea" float-label="Textarea" :max-height="100" :min-rows="3" />

      <br><br><br>
      <q-btn color="primary" @click="add">Add</q-btn>
      <q-label>
        <q-checkbox v-model="error" />
        <span>Error</span>
      </q-label>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      number: null,
      area: '',
      focus: false,
      error: false,
      chips: ['Apple', 'Google', 'Microsoft', 'Gigi', 'Gogu', 'Lulu']
    }
  },
  computed: {
    length () {
      return this.text.length
    }
  },
  methods: {
    add () {
      this.chips.push('Google')
    },
    remove (index) {
      this.chips.splice(index, 1)
    }
  }
}
</script>

<style lang="stylus">
.q-field
  border 1px solid black
.q-input
  // border 1px solid black
</style>
