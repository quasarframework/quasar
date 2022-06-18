<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          no modifiers (equivalent to having them all)
        </div>
        <q-slider v-model="nodesNumber2" :min="1" :max="10" />
        <div>
          <q-toggle v-model="attrs2" val="first" label="Att First" />
          <q-toggle v-model="attrs2" val="second" label="Att Second" />
          <q-toggle v-model="attrs2" val="third" label="Att Third" />
        </div>
        <div>
          <q-toggle v-model="char2" val="first" label="Char First" />
          <q-toggle v-model="char2" val="second" label="Char Second" />
          <q-toggle v-model="char2" val="third" label="Char Third" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section v-mutation="onMutation">
        <div v-for="n in nodesNumber2" :key="n" v-bind="attributes2">
          Node {{ (n + 1) }}
        </div>
        <div>
          {{ char2 }}
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          childList
        </div>
        <q-slider v-model="nodesNumber" :min="1" :max="10" />
      </q-card-section>
      <q-separator />
      <q-card-section v-mutation.childList="onMutation">
        <div v-for="n in nodesNumber" :key="n">
          Node {{ (n + 1) }}
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          attributes
        </div>
        <q-toggle v-model="attrs" val="first" label="First" />
        <q-toggle v-model="attrs" val="second" label="Second" />
        <q-toggle v-model="attrs" val="third" label="Third" />
      </q-card-section>
      <q-separator />
      <q-card-section v-mutation.attributes="onMutation" v-bind="attributes">
        Attributes
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          characterData
        </div>
        <q-toggle v-model="char" val="first" label="First" />
        <q-toggle v-model="char" val="second" label="Second" />
        <q-toggle v-model="char" val="third" label="Third" />
      </q-card-section>
      <q-separator />
      <q-card-section v-mutation.characterData.subtree="onMutation">
        {{ char }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nodesNumber: 3,
      nodesNumber2: 3,
      attrs: [ 'third' ],
      attrs2: [ 'third' ],
      char: [ 'wee' ],
      char2: [ 'wee' ]
    }
  },

  computed: {
    attributes () {
      const att = {}
      this.attrs.forEach(a => { att[ a ] = 'yes' })
      return att
    },

    attributes2 () {
      const att = {}
      this.attrs2.forEach(a => { att[ a ] = 'yes' })
      return att
    }
  },

  methods: {
    onMutation (mutationList) {
      console.log(mutationList)
    }
  }
}
</script>
