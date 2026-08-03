<template>
  <div class="q-layout-padding">
    <div class="row no-wrap">
      <div class="col-md-2 q-px-sm q-py-xs" />
      <div
        class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
        >buildDate</div
      >
      <div
        class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
      >
        buildDate UTC
      </div>
    </div>
    <div
      v-for="(entry, index) in buildDateSeed"
      :key="'build__' + index"
      class="row no-wrap"
    >
      <div
        class="col-md-2 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
      >
        {{ entry.source }}
      </div>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.build" />
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.buildUTC" />
    </div>

    <div class="q-mt-md row no-wrap">
      <div class="col-md-2 q-px-sm q-py-xs" />
      <div
        class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
        >adjustDate</div
      >
      <div
        class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
      >
        source, change, build, result
      </div>
    </div>
    <div
      v-for="(entry, index) in adjustDateSeed"
      :key="'adjust__' + index"
      class="row no-wrap"
    >
      <div
        class="col-md-2 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
      >
        {{ entry.source }}
      </div>
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.change" />
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.build" />
      <div class="col-md-5 q-px-sm q-py-xs" v-html="entry.result" />
    </div>

    <div class="row justify-start">
      <q-input
        filled
        label="Date:"
        v-model="date"
        class="q-my-md"
        style="min-width: 18em"
      />
    </div>

    <div class="row no-wrap">
      <div class="col-md-2 q-px-sm q-py-xs" />
      <div
        class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
      >
        startOfDate
      </div>
      <div
        class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
      >
        startOfDate UTC
      </div>
    </div>
    <div
      v-for="type in ['year', 'month', 'day', 'hour', 'minute', 'second']"
      :key="'s' + type"
      class="row no-wrap"
    >
      <div
        class="col-md-2 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
        >{{ type }}</div
      >
      <div
        class="col-md-5 q-px-sm q-py-xs"
        v-html="highlight(startOfDate[type], date)"
      />
      <div
        class="col-md-5 q-px-sm q-py-xs"
        v-html="highlight(startOfDateUTC[type], date)"
      />
    </div>

    <div class="row no-wrap">
      <div class="col-md-2 q-px-sm q-py-xs" />
      <div
        class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
        >endOfDate</div
      >
      <div
        class="col-md-5 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
      >
        endOfDate UTC
      </div>
    </div>
    <div
      v-for="type in ['year', 'month', 'day', 'hour', 'minute', 'second']"
      :key="'e' + type"
      class="row no-wrap"
    >
      <div
        class="col-md-2 q-px-sm q-py-xs bg-grey-10 text-grey-1 font-weight-bold"
        >{{ type }}</div
      >
      <div
        class="col-md-5 q-px-sm q-py-xs"
        v-html="highlight(endOfDate[type], date)"
      />
      <div
        class="col-md-5 q-px-sm q-py-xs"
        v-html="highlight(endOfDateUTC[type], date)"
      />
    </div>

    <div class="q-mt-xl">
      <div class="text-h6">Test: encode+decode "now" with specific mask</div>
      <q-input
        filled
        label="Mask:"
        v-model="userMask"
        class="q-my-md"
        style="min-width: 18em"
      />
      <div>{{ testEncode }}</div>
      <div>{{ testDecode }}</div>
      <div>
        <q-badge
          :color="testPassed ? 'green' : 'red'"
          :label="testPassed ? 'PASSED' : 'FAILED'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { date as dateUtils } from 'quasar'
import { computed, ref } from 'vue'

const {
  startOfDate: qStartOfDate,
  endOfDate: qEndOfDate,
  formatDate,
  extractDate,
  adjustDate,
  buildDate
} = dateUtils
const format = d => formatDate(d, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
const formatUTC = d => d.toISOString().replace(/Z$/, '+00:00')

const buildSeed = [
  { year: 2021, date: 31, month: 7 },
  { year: 2021, month: 7, date: 31 },
  { month: 2, date: 29, year: 2020 },
  { month: 2, date: 29, year: 2021 }
]

const buildDateSeed = buildSeed.map(entry => ({
  source: JSON.stringify(entry),
  build: format(buildDate(entry)),
  buildUTC: formatUTC(buildDate(entry, true))
}))

const adjustSeed = [
  [{ month: 2, date: 28, year: 2020 }, { year: 2018 }],
  [{ month: 2, date: 29, year: 2020 }, { year: 2021 }],
  [{ month: 7, date: 31, year: 2020 }, { month: 5 }],
  [{ month: 7, date: 31, year: 2020 }, { month: 6 }],
  [
    { month: 7, date: 31, year: 2020 },
    { month: 2, date: 22, year: 1986 }
  ]
]

const adjustDateSeed = adjustSeed.map(entry => {
  const build = buildDate(entry[0])
  return {
    source: JSON.stringify(entry[0]),
    change: JSON.stringify(entry[1]),
    build: format(build),
    result: format(adjustDate(build, entry[1]))
  }
})

const date = ref(format(new Date()))
const userMask = ref('YYYY-MM-DDTHH:mm:ss.SSSZ Do Mo w wo DDDo DDD')

const startOfDate = computed(() => {
  if (Number.isNaN(new Date(date.value).valueOf()) === true) {
    return {}
  }
  return {
    year: format(qStartOfDate(date.value, 'year')),
    month: format(qStartOfDate(date.value, 'month')),
    day: format(qStartOfDate(date.value, 'day')),
    hour: format(qStartOfDate(date.value, 'hour')),
    minute: format(qStartOfDate(date.value, 'minute')),
    second: format(qStartOfDate(date.value, 'second'))
  }
})

const startOfDateUTC = computed(() => {
  if (Number.isNaN(new Date(date.value).valueOf()) === true) {
    return {}
  }
  return {
    year: formatUTC(qStartOfDate(date.value, 'year', true)),
    month: formatUTC(qStartOfDate(date.value, 'month', true)),
    day: formatUTC(qStartOfDate(date.value, 'day', true)),
    hour: formatUTC(qStartOfDate(date.value, 'hour', true)),
    minute: formatUTC(qStartOfDate(date.value, 'minute', true)),
    second: formatUTC(qStartOfDate(date.value, 'second', true))
  }
})

const endOfDate = computed(() => {
  if (Number.isNaN(new Date(date.value).valueOf()) === true) {
    return {}
  }
  return {
    year: format(qEndOfDate(date.value, 'year')),
    month: format(qEndOfDate(date.value, 'month')),
    day: format(qEndOfDate(date.value, 'day')),
    hour: format(qEndOfDate(date.value, 'hour')),
    minute: format(qEndOfDate(date.value, 'minute')),
    second: format(qEndOfDate(date.value, 'second'))
  }
})

const endOfDateUTC = computed(() => {
  if (Number.isNaN(new Date(date.value).valueOf()) === true) {
    return {}
  }
  return {
    year: formatUTC(qEndOfDate(date.value, 'year', true)),
    month: formatUTC(qEndOfDate(date.value, 'month', true)),
    day: formatUTC(qEndOfDate(date.value, 'day', true)),
    hour: formatUTC(qEndOfDate(date.value, 'hour', true)),
    minute: formatUTC(qEndOfDate(date.value, 'minute', true)),
    second: formatUTC(qEndOfDate(date.value, 'second', true))
  }
})

const testEncode = computed(() => formatDate(date.value, userMask.value))

const testDecode = computed(() =>
  formatDate(extractDate(testEncode.value, userMask.value), userMask.value)
)

const testPassed = computed(() => testEncode.value === testDecode.value)

function highlight(text, original) {
  if (typeof text !== 'string' || typeof original !== 'string') {
    return text
  }

  let common = '',
    i = 0

  while (text[i] === original[i] && i < text.length && i < original.length) {
    common += text[i]
    i += 1
  }

  return `<span class="bg-yellow">${common}</span>${text.slice(common.length)}`
}
</script>
