<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <div class="row q-gutter-md q-mb-md">
      <q-btn label="Add 2020/09/05" @click="add" />
      <q-btn label="Null model" @click="nullify" />
      <q-btn label="Reset" @click="reset" />
    </div>

    <div class="row q-gutter-md">
      <div>
        <div>{{ day || 'none ' }}</div>
        <q-date v-model="day" today-btn />
      </div>
      <div>
        <div>{{ days || 'none ' }}</div>
        <q-date v-model="days" multiple today-btn />
      </div>
      <div>
        <div>{{ daysRange || 'none ' }}</div>
        <q-date v-model="daysRange" multiple today-btn range />
      </div>
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
      ],

      daysRange: [
        '2020/08/02',
        '2020/08/10',
        { from: '2020/08/12', to: '2020/08/16' },
        { from: '2020/08/27', to: '2020/09/15' }
        // '2021/09/11',
      ]
    }
  },
  methods: {
    nullify () {
      this.day = null
      this.days = null
      this.daysRange = null
    },

    reset () {
      this.day = '2020/07/02'
      this.days = [
        '2020/08/02',
        '2020/08/10',
        // '2021/09/11',
      ]
      this.daysRange = [
        '2020/08/02',
        '2020/08/10',
        { from: '2020/08/12', to: '2020/08/16' },
        { from: '2020/08/27', to: '2020/09/15' }
        // '2021/09/11',
      ]
    },

    add () {
      if (Array.isArray(this.days)) {
        this.days.push('2020/09/05')
      }
      else {
        this.days = [ '2020/09/05' ]
      }
    }
  }
}
</script>

<style lang="sass">
</style>
