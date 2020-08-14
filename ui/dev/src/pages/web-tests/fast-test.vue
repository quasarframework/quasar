<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <div class="row q-gutter-md">
      <div>
        <div>{{ day }}</div>
        <q-date v-model="day" today-btn />
      </div>
      <div>
        <div>{{ days }}</div>
        <q-date v-model="days" multiple today-btn />
      </div>
    </div>

    <div class="row q-gutter-md q-mt-md">
      <q-btn label="Add 2020/09/05" @click="add" />
      <q-btn label="Null model" @click="nullify" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  data () {
    return {
      day: '2020/07/02',

      days: [
        '2020/08/02',
        '2020/08/10',
        // '2021/09/11',
      ]
    }
  },
  methods: {
    nullify () {
      this.day = null
      this.days = null
    },

    add () {
      this.days.push('2020/09/05')
    }
  }
}
</script>

<style lang="sass">
</style>
