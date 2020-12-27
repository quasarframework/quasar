<template>
  <div class="q-pa-md q-gutter-y-md" style="max-width: 500px">
    <q-input
      v-model="username"
      color="primary"
      standard
      label="Username"
      autocomplete="username"
    >
      <template v-slot:before>
        BEFORE
      </template>
      <template v-slot:prepend>
        PREP
      </template>
      <template v-slot:append>
        APPEND
      </template>
      <template v-slot:after>
        AFTER
      </template>
    </q-input>

    <q-input
      v-model="username"
      color="primary"
      filled
      label="Username"
      autocomplete="username"
    >
      <template v-slot:before>
        BEFORE
      </template>
      <template v-slot:prepend>
        PREP
      </template>
      <template v-slot:append>
        APPEND
      </template>
      <template v-slot:after>
        AFTER
      </template>
    </q-input>

    <q-input
      v-model="username"
      color="primary"
      outlined
      label="Username"
      autocomplete="username"
    >
      <template v-slot:before>
        BEFORE
      </template>
      <template v-slot:prepend>
        PREP
      </template>
      <template v-slot:append>
        APPEND
      </template>
      <template v-slot:after>
        AFTER
      </template>
    </q-input>

    <q-input
      v-model="username"
      color="primary"
      borderless
      label="Username"
      autocomplete="username"
    >
      <template v-slot:before>
        BEFORE
      </template>
      <template v-slot:prepend>
        PREP
      </template>
      <template v-slot:append>
        APPEND
      </template>
      <template v-slot:after>
        AFTER
      </template>
    </q-input>

    <q-input
      v-model="username"
      color="primary"
      standout
      label="Username"
      autocomplete="username"
    >
      <template v-slot:before>
        BEFORE
      </template>
      <template v-slot:prepend>
        PREP
      </template>
      <template v-slot:append>
        APPEND
      </template>
      <template v-slot:after>
        AFTER
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: null
    }
  }
}
</script>
