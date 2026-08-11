<template>
  <div class="q-layout-padding">
    <div class="text-h6">QTree performance benchmark</div>

    <p class="caption">
      Deterministic dataset, all runs triggered manually (nothing renders on SSR
      beyond this page shell). Numbers from a dev server are only good for
      relative comparisons — use a production build for absolute ones. The tree
      runs with <code>tick-strategy="leaf"</code> and a bound
      <code>selected</code> model, which is the most expensive (and the most
      common accessible) configuration.
    </p>

    <div class="q-mb-md">
      <q-option-group
        v-model="sizeKey"
        :options="sizeOptions"
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
          <th class="text-right">Nodes</th>
          <th class="text-right">DOM elements</th>
          <th class="text-right">JS ms (median)</th>
          <th class="text-right">Frame ms (median)</th>
          <th class="text-right">Runs</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in results" :key="row.label">
          <td class="text-left">{{ row.label }}</td>
          <td class="text-right">{{ row.nodes }}</td>
          <td class="text-right">{{ row.dom ?? '—' }}</td>
          <td class="text-right">{{ row.jsMedian.toFixed(1) }}</td>
          <td class="text-right">{{
            row.frameMedian !== null ? row.frameMedian.toFixed(1) : '—'
          }}</td>
          <td class="text-right">{{ row.samples.length }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <div
      ref="containerRef"
      style="height: 400px; overflow: auto"
      class="rounded-borders"
      :class="treeShown ? 'shadow-1' : ''"
    >
      <q-tree
        v-if="treeShown"
        ref="treeRef"
        :nodes="nodes"
        node-key="id"
        tick-strategy="leaf"
        :duration="treeConfig.animated === true ? void 0 : 0"
        :selected="selected"
        :filter="filter"
        :no-transition="treeConfig.noTransition"
        :default-expand-all="treeConfig.defaultExpandAll"
        @update:selected="v => (selected = v)"
        @after-show="onAnimationEnd"
        @after-hide="onAnimationEnd"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, shallowRef } from 'vue'
import { copyToClipboard } from 'quasar'

const SIZES = {
  small: { branching: 10, depth: 3 }, // 1,110 nodes
  medium: { branching: 8, depth: 4 }, // 4,680 nodes
  large: { branching: 12, depth: 4 } // 22,620 nodes
}

function buildNodes(branching, depth) {
  let count = 0

  const make = (label, level) => {
    count++
    const node = { id: label, label }

    if (level < depth) {
      node.children = []
      for (let i = 1; i <= branching; i++) {
        node.children.push(make(`${label}.${i}`, level + 1))
      }
    }

    return node
  }

  const roots = []
  for (let i = 1; i <= branching; i++) {
    roots.push(make(`N${i}`, 1))
  }

  return { roots, count }
}

const sizeKey = ref('small')
const sizeOptions = Object.keys(SIZES).map(key => {
  const { branching, depth } = SIZES[key]
  const { count } = buildNodes(branching, depth)
  return { value: key, label: `${key} (${count.toLocaleString()} nodes)` }
})

const running = ref(false)
const status = ref('')
const results = ref([])

const containerRef = ref(null)
const treeRef = ref(null)
const treeShown = ref(false)
const treeConfig = shallowRef({})
const nodes = shallowRef([])
const selected = ref(null)
const filter = ref('')

const nodeCount = computed(() => {
  const { branching, depth } = SIZES[sizeKey.value]
  return buildNodes(branching, depth).count
})

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

function record(label, samples, dom) {
  const frames = samples.map(s => s.frame).filter(f => f !== null)

  results.value.push({
    label,
    nodes: nodeCount.value,
    dom,
    jsMedian: median(samples.map(s => s.js)),
    frameMedian: frames.length !== 0 ? median(frames) : null,
    samples
  })
}

function domElementCount() {
  return containerRef.value.querySelectorAll('*').length
}

async function unmountTree() {
  treeShown.value = false
  selected.value = null
  filter.value = ''
  await afterTick()
}

async function benchMount(label, config, reps) {
  status.value = `running: ${label}…`

  const samples = []
  let dom = 0

  for (let i = 0; i < reps; i++) {
    await unmountTree()
    treeConfig.value = config
    samples.push(
      await measure(() => {
        treeShown.value = true
      })
    )
    dom = domElementCount()
  }

  record(label, samples, dom)
}

async function benchAction(label, reps, action) {
  status.value = `running: ${label}…`

  const samples = []
  for (let i = 0; i < reps; i++) {
    samples.push(await measure(action))
  }

  record(label, samples, domElementCount())
}

let animationResolve = null

function onAnimationEnd() {
  if (animationResolve !== null) {
    animationResolve()
    animationResolve = null
  }
}

function pressArrowDown() {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true
  })
  Object.defineProperty(event, 'keyCode', { value: 40 })
  document.activeElement.dispatchEvent(event)
}

async function runAll() {
  running.value = true
  rafThrottled = false
  results.value = []

  const { branching, depth } = SIZES[sizeKey.value]
  nodes.value = buildNodes(branching, depth).roots

  // the deepest first leaf, e.g. N1.1.1
  const leafKey = 'N1' + '.1'.repeat(depth - 1)

  try {
    await benchMount('mount, collapsed', {}, 3)
    await benchMount(
      'mount, collapsed, no-transition',
      { noTransition: true },
      3
    )
    await benchMount('mount, expand-all', { defaultExpandAll: true }, 3)
    await benchMount(
      'mount, expand-all, no-transition',
      { defaultExpandAll: true, noTransition: true },
      3
    )

    // interactions run on a fully expanded tree with default transitions
    await unmountTree()
    treeConfig.value = { defaultExpandAll: true }
    treeShown.value = true
    await afterTick()

    containerRef.value.querySelector('.q-tree__node-header').focus()
    await afterTick()
    await benchAction('arrow-key navigation (per key)', 15, pressArrowDown)

    let expandedState = true
    await benchAction('expand/collapse one parent', 6, () => {
      expandedState = !expandedState
      treeRef.value.setExpanded('N1', expandedState)
    })

    let tickedState = false
    await benchAction('tick/untick one leaf', 6, () => {
      tickedState = !tickedState
      treeRef.value.setTicked([leafKey], tickedState)
    })

    let selectFlip = false
    await benchAction('select node', 6, () => {
      selectFlip = !selectFlip
      selected.value = selectFlip ? leafKey : null
    })

    const filterInputs = ['1', '1.', '1.2', '']
    let filterIndex = 0
    await benchAction('filter keystroke', 8, () => {
      filter.value = filterInputs[filterIndex++ % filterInputs.length]
    })

    // end-to-end animated expand/collapse: state change until the
    // after-show/after-hide event, with the default 300ms duration
    await unmountTree()
    treeConfig.value = { defaultExpandAll: true, animated: true }
    treeShown.value = true
    await afterTick()

    let animExpanded = true
    await benchAction('animated expand/collapse (to event, 300ms)', 4, () => {
      animExpanded = !animExpanded
      const settled = new Promise(resolve => {
        animationResolve = resolve
      })
      treeRef.value.setExpanded('N1', animExpanded)
      return settled
    })

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
  copyToClipboard(
    JSON.stringify(
      results.value.map(({ samples, ...row }) => ({
        ...row,
        jsSamples: samples.map(s => Number(s.js.toFixed(2))),
        frameSamples: samples.map(s =>
          s.frame !== null ? Number(s.frame.toFixed(2)) : null
        )
      })),
      null,
      2
    )
  )
}

function clearResults() {
  results.value = []
  status.value = ''
  unmountTree()
}
</script>
