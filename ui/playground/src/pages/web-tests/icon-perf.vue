<template>
  <div class="q-layout-padding">
    <div class="text-h6">QIcon performance benchmark</div>

    <p class="caption">
      Mounts a block of icons per scenario and measures JS (render/patch) and
      frame (JS + style/layout/paint) time. Scenarios cover every QIcon
      name-resolution path: the ligature sets (material icons, their o_/r_/s_
      variants, material symbols), the class-based webfonts (lib prefixes,
      fontawesome, platform-dependent ionicons), svg path definitions, svguse
      sprites, img sources, "none" and iconMapFn. All runs triggered manually
      (nothing renders on SSR beyond this page shell). Numbers from a dev server
      are only good for relative comparisons — use a production build for
      absolute ones.
    </p>

    <div class="q-mb-md">
      <q-option-group
        v-model="countKey"
        :options="countOptions"
        :disable="running"
        type="radio"
        inline
      />
    </div>

    <div class="q-gutter-sm q-mb-md">
      <q-btn
        color="primary"
        label="Run benchmark"
        :loading="running"
        @click="runAll"
      />
      <q-btn
        outline
        color="primary"
        label="Copy JSON"
        :disable="running || results.length === 0"
        @click="copyResults"
      />
      <q-btn
        outline
        color="grey"
        label="Clear"
        :disable="running || results.length === 0"
        @click="clearResults"
      />
    </div>

    <div v-if="status" class="q-mb-md text-italic">{{ status }}</div>

    <q-markup-table
      v-if="results.length !== 0"
      dense
      flat
      bordered
      class="q-mb-md"
      style="max-width: 720px"
    >
      <thead>
        <tr>
          <th class="text-left">Scenario</th>
          <th class="text-right">Icons</th>
          <th class="text-right">JS µs/icon (median)</th>
          <th class="text-right">Frame µs/icon (median)</th>
          <th class="text-right">Runs</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in results" :key="row.label">
          <td class="text-left">{{ row.label }}</td>
          <td class="text-right">{{ row.count }}</td>
          <td class="text-right">{{ row.jsMedian.toFixed(2) }}</td>
          <td class="text-right">{{
            row.frameMedian !== null ? row.frameMedian.toFixed(2) : '—'
          }}</td>
          <td class="text-right">{{ row.samples.length }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <div
      ref="containerRef"
      style="height: 300px; overflow: auto"
      class="rounded-borders"
      :class="iconsShown ? 'shadow-1' : ''"
    >
      <div v-if="iconsShown">
        <q-icon v-for="i in iconCount" :key="i" v-bind="scenarioProps(i)" />
      </div>
    </div>

    <!-- sprite for the svguse scenario -->
    <svg style="display: none" aria-hidden="true">
      <symbol id="icon-perf-symbol" viewBox="0 0 24 24">
        <path d="M12 2L2 22h20z" />
      </symbol>
    </svg>
  </div>
</template>

<script setup>
import { nextTick, ref, shallowRef } from 'vue'
import { copyToClipboard, useQuasar } from 'quasar'

const $q = useQuasar()

const COUNTS = {
  small: 2000,
  medium: 10_000,
  large: 30_000
}

// one single-path and one two-path svg definition
const svgSingleName = 'M12 2L2 22h20z'
const svgMultiName =
  'M9 3L5 6.99h3V14h2V6.99h3L9 3z&&M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z'

// self-contained, so the scenario measures rendering, not the network
const imgName =
  'img:data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%3E%3Cpath%20d=%22M12%202L2%2022h20z%22/%3E%3C/svg%3E'

const svgUseName = 'svguse:#icon-perf-symbol'

// a deterministic mix, so the module-level parse cache is exercised
// with more than one entry
const materialNames = [
  'cancel',
  'search',
  'home',
  'menu',
  'close',
  'settings',
  'done',
  'favorite',
  'star',
  'delete',
  'add',
  'edit',
  'refresh',
  'logout',
  'arrow_drop_down',
  'chevron_left',
  'chevron_right',
  'expand_more'
]
const mdiNames = [
  'mdi-close',
  'mdi-menu',
  'mdi-heart',
  'mdi-magnify',
  'mdi-home',
  'mdi-account',
  'mdi-cog',
  'mdi-star',
  'mdi-delete',
  'mdi-plus',
  'mdi-pencil',
  'mdi-refresh',
  'mdi-logout',
  'mdi-chevron-down',
  'mdi-chevron-left',
  'mdi-chevron-right',
  'mdi-arrow-up',
  'mdi-check'
]

const faNames = [
  'fas fa-heart',
  'fas fa-house',
  'fas fa-user',
  'fas fa-gear',
  'fas fa-magnifying-glass',
  'fas fa-check',
  'fas fa-xmark',
  'fas fa-star'
]

// libMap prefixes across several fonts, plus line-awesome (fa-style
// matching) — exercises the whole prefix list and multi-font layout
const mixedWebfontNames = [
  'eva-close-outline',
  'eva-menu-outline',
  'eva-heart-outline',
  'eva-search-outline',
  'ti-close',
  'ti-menu',
  'ti-heart',
  'ti-search',
  'bi-x',
  'bi-list',
  'bi-heart',
  'bi-search',
  'las la-atom',
  'las la-cog'
]

const ionNames = [
  'ion-heart',
  'ion-close',
  'ion-menu',
  'ion-search',
  'ion-star',
  'ion-add'
]

// remap ("app:") and cls ("appcls:") flavors of the iconMapFn contract
const iconMapFn = name => {
  if (name.startsWith('app:')) {
    return { icon: 'mdi-' + name.slice(4) }
  }
  if (name.startsWith('appcls:')) {
    return { cls: 'mdi mdi-' + name.slice(7) }
  }
}

const pick = list => i => list[i % list.length]
const pickMat = pick(materialNames)

const SCENARIOS = [
  {
    key: 'ligature',
    label: 'ligature (material-icons)',
    props: i => ({ name: pickMat(i) })
  },
  {
    key: 'ligature-variant',
    label: 'ligature (o_ outlined variant)',
    props: i => ({ name: 'o_' + pickMat(i) })
  },
  {
    key: 'ligature-symbols',
    label: 'ligature (sym_o_ material symbols)',
    props: i => ({ name: 'sym_o_' + pickMat(i) })
  },
  {
    key: 'sized-colored',
    label: 'ligature, size + color',
    props: i => ({ name: pickMat(i), size: 'sm', color: 'primary' })
  },
  {
    key: 'class',
    label: 'class-based (mdi)',
    props: i => ({ name: pick(mdiNames)(i) })
  },
  {
    key: 'class-fa',
    label: 'class-based (fontawesome)',
    props: i => ({ name: pick(faNames)(i) })
  },
  {
    key: 'class-mixed',
    label: 'class-based (eva/ti/bi/la mixed)',
    props: i => ({ name: pick(mixedWebfontNames)(i) })
  },
  {
    key: 'ionicons',
    label: 'ionicons (platform-dependent)',
    props: i => ({ name: pick(ionNames)(i) })
  },
  {
    key: 'svg-path',
    label: 'svg path (single & multi)',
    props: i => ({ name: i % 2 === 0 ? svgSingleName : svgMultiName })
  },
  {
    key: 'svguse',
    label: 'svguse sprite',
    props: () => ({ name: svgUseName })
  },
  {
    key: 'img',
    label: 'img (data URI)',
    props: () => ({ name: imgName })
  },
  {
    key: 'none',
    label: 'none (component shell only)',
    props: () => ({ name: 'none' })
  },
  {
    key: 'icon-map-fn',
    label: 'iconMapFn (remap + cls mixed)',
    mapFn: iconMapFn,
    props: i => ({
      name: (i % 2 === 0 ? 'app:' : 'appcls:') + pick(mdiNames)(i).slice(4)
    })
  }
]

const countKey = ref('medium')
const countOptions = Object.keys(COUNTS).map(key => ({
  value: key,
  label: `${key} (${COUNTS[key].toLocaleString()} icons)`
}))

const running = ref(false)
const status = ref('')
const results = ref([])

const containerRef = ref(null)
const iconsShown = ref(false)
const iconCount = ref(0)
const scenarioProps = shallowRef(() => ({}))

let rafThrottled = false

// rAF stops firing in occluded/background windows; fall back to a timer
// so a run can never hang, and flag frame timings as unavailable instead
function nextFrame() {
  const raf = new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve(true)
    })
  })

  const fallback = new Promise(resolve => {
    setTimeout(() => {
      resolve(false)
    }, 250)
  })

  return Promise.race([raf, fallback]).then(painted => {
    if (painted !== true) {
      rafThrottled = true
    }
    return painted
  })
}

function afterTick() {
  return new Promise(resolve => {
    nextTick(resolve)
  })
}

/**
 * js: state change + Vue render/patch (settled by nextTick)
 * frame: js + the browser's style/layout/paint (settled by two rAFs);
 *        null when the window is occluded and rAF does not fire
 */
async function measure(action) {
  await nextFrame()

  const start = performance.now()
  await action()
  await afterTick()
  const js = performance.now() - start

  const painted = (await nextFrame()) && (await nextFrame())
  const frame = painted ? performance.now() - start : null

  return { js, frame }
}

function median(list) {
  const sorted = [...list].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

async function unmountIcons() {
  iconsShown.value = false
  await afterTick()
}

async function benchMount(scenario, reps) {
  status.value = `running: ${scenario.label}…`

  const count = COUNTS[countKey.value]
  const perIcon = ms => (ms * 1000) / count
  const samples = []

  const prevMapFn = $q.iconMapFn
  if (scenario.mapFn !== void 0) {
    $q.iconMapFn = scenario.mapFn
  }

  try {
    for (let i = 0; i < reps; i++) {
      await unmountIcons()
      scenarioProps.value = scenario.props
      iconCount.value = count
      samples.push(
        await measure(() => {
          iconsShown.value = true
        })
      )
    }
  } finally {
    $q.iconMapFn = prevMapFn
  }

  const frames = samples.map(s => s.frame).filter(f => f !== null)

  results.value.push({
    label: scenario.label,
    count,
    jsMedian: median(samples.map(s => perIcon(s.js))),
    frameMedian: frames.length !== 0 ? median(frames.map(perIcon)) : null,
    samples
  })
}

async function runAll() {
  running.value = true
  rafThrottled = false
  results.value = []

  try {
    for (const scenario of SCENARIOS) {
      await benchMount(scenario, 5)
    }

    await unmountIcons()

    status.value =
      'done' +
      (rafThrottled
        ? ' — rAF throttled (window occluded?); frame timings unavailable'
        : '')
  } finally {
    running.value = false
  }
}

function copyResults() {
  const jsMedian = median(results.value.map(r => r.jsMedian))
  const frameMedian = median(
    results.value.map(r => r.frameMedian).filter(f => f !== null)
  )

  copyToClipboard(
    JSON.stringify(
      {
        jsMedian,
        frameMedian,
        results: results.value.map(({ samples, ...row }) => row)
      },
      null,
      2
    )
  )
}

function clearResults() {
  results.value = []
  status.value = ''
  unmountIcons()
}
</script>
