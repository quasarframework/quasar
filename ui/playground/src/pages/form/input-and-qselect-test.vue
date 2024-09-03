<template>
  <div class="q-layout-padding">
    <div class="q-gutter-sm">
      <q-input v-model="text" outlined rounded label="My label gg" />
      <q-input v-model="text" outlined rounded label="My label gg" />

      <q-input v-model="text2" dense outlined rounded label="My label gg" />
      <q-input v-model="text2" dense outlined rounded label="My label gg" />

      <q-input v-model="text3" outlined rounded label="My label gg" />
      <q-input v-model="text3" outlined rounded label="My label gg" />

      <q-input v-model="text3" dense outlined rounded label="My label gg" />
      <q-input v-model="text3" dense outlined rounded label="My label gg" />

      <br>

      <q-input v-model="text" filled rounded label="My label gg" />
      <q-input v-model="text" filled rounded label="My label gg" />

      <q-input v-model="text2" dense filled rounded label="My label gg" />
      <q-input v-model="text2" dense filled rounded label="My label gg" />

      <q-input v-model="text3" filled rounded label="My label gg" />
      <q-input v-model="text3" filled rounded label="My label gg" />

      <q-input v-model="text3" dense filled rounded label="My label gg" />
      <q-input v-model="text3" dense filled rounded label="My label gg" />

      <br>

      <q-input v-model="text" rounded label="My label gg" />
      <q-input v-model="text" rounded label="My label gg" />

      <q-input v-model="text2" dense rounded label="My label gg" />
      <q-input v-model="text2" dense rounded label="My label gg" />

      <q-input v-model="text3" rounded label="My label gg" />
      <q-input v-model="text3" rounded label="My label gg" />

      <q-input v-model="text3" dense rounded label="My label gg" />
      <q-input v-model="text3" dense rounded label="My label gg" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Text',
      text2: 'Text',
      text3: ''
    }
  }
}
</script>
