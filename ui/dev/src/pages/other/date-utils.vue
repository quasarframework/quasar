<template>
  <div class="q-layout-padding">
    <div class="row no-wrap">
      <div class="col-md-2 q-px-sm q-py-xs" />
      <div class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">buildDate</div>
      <div class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">buildDate UTC</div>
    </div>
    <div
      v-for="(entry, index) in buildDateSeed"
      :key="'build__' + index"
      class="row no-wrap"
    >
      <div class="col-md-2 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">{{entry.source}}</div>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.build"/>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.buildUTC"/>
    </div>

    <div class="q-mt-md row no-wrap">
      <div class="col-md-2 q-px-sm q-py-xs" />
      <div class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">adjustDate</div>
      <div class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">source, change, build, result</div>
    </div>
    <div
      v-for="(entry, index) in adjustDateSeed"
      :key="'adjust__' + index"
      class="row no-wrap"
    >
      <div class="col-md-2 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">{{entry.source}}</div>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.change"/>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.build"/>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.result"/>
    </div>

    <div class="row justify-start">
      <q-input filled label="Date:" v-model="date" class="q-my-md" style="min-width: 18em" />
    </div>

    <div class="row no-wrap">
      <div class="col-md-2 q-px-sm q-py-xs" />
      <div class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">startOfDate</div>
      <div class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">startOfDate UTC</div>
    </div>
    <div
      v-for="type in ['year', 'month', 'day', 'hour', 'minute', 'second']"
      :key="'s' + type"
      class="row no-wrap"
    >
      <div class="col-md-2 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">{{type}}</div>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="highlight(startOfDate[type], date)"/>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="highlight(startOfDateUTC[type], date)"/>
    </div>

    <div class="row no-wrap">
      <div class="col-md-2 q-px-sm q-py-xs" />
      <div class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">endOfDate</div>
      <div class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">endOfDate UTC</div>
    </div>
    <div
      v-for="type in ['year', 'month', 'day', 'hour', 'minute', 'second']"
      :key="'e' + type"
      class="row no-wrap"
    >
      <div class="col-md-2 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold">{{type}}</div>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="highlight(endOfDate[type], date)"/>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="highlight(endOfDateUTC[type], date)"/>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

const { startOfDate, endOfDate, formatDate, adjustDate, buildDate } = date
const format = d => formatDate(d, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
const formatUTC = d => d.toISOString().replace(/Z$/, '+00:00')

export default {
  created () {
    const buildSeed = [
      { year: 2021, date: 31, month: 7 },
      { year: 2021, month: 7, date: 31 },
      { month: 2, date: 29, year: 2020 },
      { month: 2, date: 29, year: 2021 }
    ]

    this.buildDateSeed = buildSeed.map(entry => {
      return {
        source: JSON.stringify(entry),
        build: format(buildDate(entry)),
        buildUTC: formatUTC(buildDate(entry, true))
      }
    })

    const adjustSeed = [
      [ { month: 2, date: 28, year: 2020 }, { year: 2018 } ],
      [ { month: 2, date: 29, year: 2020 }, { year: 2021 } ],
      [ { month: 7, date: 31, year: 2020 }, { month: 5 } ],
      [ { month: 7, date: 31, year: 2020 }, { month: 6 } ],
      [ { month: 7, date: 31, year: 2020 }, { month: 2, date: 22, year: 1986 } ]
    ]

    this.adjustDateSeed = adjustSeed.map(entry => {
      const build = buildDate(entry[ 0 ])
      return {
        source: JSON.stringify(entry[ 0 ]),
        change: JSON.stringify(entry[ 1 ]),
        build: format(build),
        result: format(adjustDate(build, entry[ 1 ]))
      }
    })
  },

  data () {
    return {
      date: format(new Date())
    }
  },
  computed: {
    startOfDate () {
      if (isNaN((new Date(this.date)).valueOf()) === true) {
        return {}
      }
      return {
        year: format(startOfDate(this.date, 'year')),
        month: format(startOfDate(this.date, 'month')),
        day: format(startOfDate(this.date, 'day')),
        hour: format(startOfDate(this.date, 'hour')),
        minute: format(startOfDate(this.date, 'minute')),
        second: format(startOfDate(this.date, 'second'))
      }
    },

    startOfDateUTC () {
      if (isNaN((new Date(this.date)).valueOf()) === true) {
        return {}
      }
      return {
        year: formatUTC(startOfDate(this.date, 'year', true)),
        month: formatUTC(startOfDate(this.date, 'month', true)),
        day: formatUTC(startOfDate(this.date, 'day', true)),
        hour: formatUTC(startOfDate(this.date, 'hour', true)),
        minute: formatUTC(startOfDate(this.date, 'minute', true)),
        second: formatUTC(startOfDate(this.date, 'second', true))
      }
    },

    endOfDate () {
      if (isNaN((new Date(this.date)).valueOf()) === true) {
        return {}
      }
      return {
        year: format(endOfDate(this.date, 'year')),
        month: format(endOfDate(this.date, 'month')),
        day: format(endOfDate(this.date, 'day')),
        hour: format(endOfDate(this.date, 'hour')),
        minute: format(endOfDate(this.date, 'minute')),
        second: format(endOfDate(this.date, 'second'))
      }
    },

    endOfDateUTC () {
      if (isNaN((new Date(this.date)).valueOf()) === true) {
        return {}
      }
      return {
        year: formatUTC(endOfDate(this.date, 'year', true)),
        month: formatUTC(endOfDate(this.date, 'month', true)),
        day: formatUTC(endOfDate(this.date, 'day', true)),
        hour: formatUTC(endOfDate(this.date, 'hour', true)),
        minute: formatUTC(endOfDate(this.date, 'minute', true)),
        second: formatUTC(endOfDate(this.date, 'second', true))
      }
    }
  },

  methods: {
    highlight (text, original) {
      if (typeof text !== 'string' || typeof original !== 'string') {
        return text
      }

      let
        common = '',
        i = 0

      while (text[ i ] === original[ i ] && i < text.length && i < original.length) {
        common += text[ i ]
        i += 1
      }

      return `<span class="bg-yellow">${ common }</span>${ text.slice(common.length) }`
    }
  }
}
</script>
