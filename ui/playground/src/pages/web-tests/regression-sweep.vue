<template>
  <div class="q-layout-padding">
    <!--
      Self-driving cross-engine regression sweep for popup / fullscreen /
      a11y behavior. Every scenario runs programmatically (no
      trusted input needed), reports PASS/FAIL with details into the panel
      below, and exposes the machine-readable result on window.__results
      (window.__done flags completion).

      Drive it with query params:
        ?autorun          start on mount
        &tag=<name>       engine label carried into the results
        &beacon=<origin>  also GET the compact verdict to that origin's
                          request log (lets an iOS Simulator run report
                          without any DOM access)
    -->
    <div class="q-mb-sm">
      <q-btn color="primary" label="Run all" @click="runAll" />
    </div>

    <pre class="sweep-verdict">{{ lines.join('\n') }}</pre>

    <!-- S1: #18512 click inside fullscreen-detached child of an open QMenu -->
    <div class="fixture">
      <q-btn label="S1">
        <q-menu ref="s1menu" @before-hide="s1hideEvt = $event">
          <div class="q-pa-sm">
            <q-table
              :rows="rows"
              :columns="cols"
              row-key="id"
              dense
              :fullscreen="s1fs"
              style="max-width: 380px"
            >
              <template #top>
                <input class="s1-filter" placeholder="filter" />
              </template>
            </q-table>
          </div>
        </q-menu>
      </q-btn>
    </div>

    <!-- S2: #18513 menu anchored inside a component entering fullscreen -->
    <div class="fixture">
      <q-table
        :rows="rows"
        :columns="cols"
        row-key="id"
        dense
        :fullscreen="s2fs"
        style="max-width: 380px"
      >
        <template #top>
          <q-btn class="s2-host" dense color="secondary" label="host">
            <q-menu ref="s2menu">
              <div class="q-pa-md">S2 menu</div>
            </q-menu>
          </q-btn>
        </template>
      </q-table>
    </div>

    <!-- S3/S4: #17843 focus + caret through the fullscreen moves -->
    <div class="fixture">
      <q-table
        :rows="rows"
        :columns="cols"
        row-key="id"
        dense
        :fullscreen="s3fs"
        style="max-width: 380px"
      >
        <template #top>
          <input class="s3-input" />
          <div
            class="s4-edit"
            contenteditable="true"
            style="min-width: 120px; border: 1px solid #999"
          >
            editable text
          </div>
        </template>
      </q-table>
    </div>

    <!-- S5: #18474 dialog focus trap with a fullscreen child -->
    <q-dialog v-model="s5dialog">
      <div class="bg-white q-pa-md">
        <q-table
          :rows="rows"
          :columns="cols"
          row-key="id"
          dense
          :fullscreen="s5fs"
          style="max-width: 380px"
        >
          <template #top>
            <input class="s5-input" />
          </template>
        </q-table>
      </div>
    </q-dialog>

    <!-- S6: QTooltip on an anchor inside a fullscreen element -->
    <div class="fixture">
      <q-table
        :rows="rows"
        :columns="cols"
        row-key="id"
        dense
        :fullscreen="s6fs"
        style="max-width: 380px"
      >
        <template #top>
          <q-btn class="s6-anchor" dense color="secondary" label="tt anchor">
            <q-tooltip ref="s6tt">S6 tooltip</q-tooltip>
          </q-btn>
        </template>
      </q-table>
    </div>

    <!-- S7: pre-open dialog must stay visible above a later fullscreen -->
    <q-dialog v-model="s7dialog" seamless>
      <div class="s7-card bg-white shadow-2 q-pa-lg">S7 dialog card</div>
    </q-dialog>
    <div class="fixture">
      <q-table
        :rows="rows"
        :columns="cols"
        row-key="id"
        dense
        :fullscreen="s7fs"
        style="max-width: 380px"
      />
    </div>

    <!-- S8/S9: slider family -- role on the focusable element, Home/End -->
    <div class="fixture s8-wrap">
      <q-slider
        v-model="s8val"
        :min="0"
        :max="10"
        :step="1"
        style="width: 200px"
      />
    </div>
    <div class="fixture s9-wrap">
      <q-range
        v-model="s9val"
        :min="0"
        :max="10"
        :step="1"
        style="width: 200px"
      />
    </div>

    <!-- S10: QRating arrow keys move focus in radio-group direction -->
    <div class="fixture s10-wrap">
      <q-rating v-model="s10val" :max="4" icon="star" />
    </div>

    <!-- S11: #15675 TAB moves focus out of a QMenu and closes it -->
    <div class="fixture">
      <q-btn class="s11-anchor" label="S11">
        <q-menu ref="s11menu">
          <div class="q-pa-sm">
            <button class="s11-inner" type="button">inner</button>
          </div>
        </q-menu>
      </q-btn>
    </div>

    <!-- S12: fall-through attrs resolve on QDialog / QTooltip render paths -->
    <q-dialog v-model="s12dlg" data-sweep-dlg="1" class="s12-dlg-class">
      <div class="bg-white q-pa-md">S12 dialog</div>
    </q-dialog>
    <div class="fixture">
      <q-btn class="s12-tt-anchor" dense label="S12 tt">
        <q-tooltip ref="s12tt" data-sweep-tt="1" class="s12-tt-class">
          S12 tooltip
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

const rows = [
  { id: 0, name: 'r0' },
  { id: 1, name: 'r1' },
  { id: 2, name: 'r2' }
]
const cols = [{ name: 'name', label: 'Name', field: 'name' }]

const s1menu = ref(null)
const s1fs = ref(false)
const s1hideEvt = ref(null)
const s2menu = ref(null)
const s2fs = ref(false)
const s3fs = ref(false)
const s5dialog = ref(false)
const s5fs = ref(false)
const s6tt = ref(null)
const s6fs = ref(false)
const s7dialog = ref(false)
const s7fs = ref(false)
const s8val = ref(5)
const s9val = ref({ min: 2, max: 8 })
const s10val = ref(2)
const s11menu = ref(null)
const s12dlg = ref(false)
const s12tt = ref(null)

const lines = ref([])
const results = []

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })
async function settle(ms) {
  await sleep(ms)
  await new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

// KeyboardEvent constructors do not reliably carry legacy keyCode across
// engines; defining it on the instance works everywhere
function pressKey(el, keyCode) {
  for (const type of ['keydown', 'keyup']) {
    const evt = new KeyboardEvent(type, { bubbles: true })
    Object.defineProperty(evt, 'keyCode', { value: keyCode })
    el.dispatchEvent(evt)
  }
}

function report(name, pass, detail) {
  results.push({ name, pass, detail })
  lines.value.push(
    (pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' -- ' + detail : '')
  )
}

function fullscreenLeakCheck(tag) {
  if (document.body.classList.contains('q-body--fullscreen-mixin')) {
    lines.value.push(
      'WARN ' + tag + ': fullscreen state leaked from previous scenario'
    )
  }
}

async function s1() {
  s1menu.value.show()
  await settle(400)
  s1fs.value = true
  await settle(400)
  document
    .querySelector('.s1-filter')
    .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  await settle(150)
  const openAfterInside = document.querySelector('.q-menu') !== null
  document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  await settle(450)
  const closedAfterOutside = document.querySelector('.q-menu') === null
  const viaClickOutside = s1hideEvt.value?.qClickOutside === true
  report(
    'S1 18512 click-outside vs detached child',
    openAfterInside && closedAfterOutside && viaClickOutside,
    `insideKeptOpen=${openAfterInside} outsideClosed=${closedAfterOutside} qClickOutside=${viaClickOutside}`
  )
  s1fs.value = false
  await settle(300)
}

async function s2() {
  fullscreenLeakCheck('S2')
  s2menu.value.show()
  await settle(400)
  s2fs.value = true
  await settle(600)
  const menu = document.querySelector('.q-menu')
  const host = document.querySelector('.s2-host')
  let inFsOk = false
  let efpOk = false
  if (menu !== null && host !== null) {
    const mr = menu.getBoundingClientRect()
    const hr = host.getBoundingClientRect()
    inFsOk = Math.abs(mr.top - hr.bottom) < 2 && Math.abs(mr.left - hr.left) < 2
    const el = document.elementFromPoint(
      mr.left + mr.width / 2,
      mr.top + Math.min(mr.height / 2, 15)
    )
    efpOk = el !== null && menu.contains(el)
  }
  s2fs.value = false
  await settle(600)
  const menuAfter = document.querySelector('.q-menu')
  const hostAfter = document.querySelector('.s2-host')
  const backOk =
    menuAfter !== null &&
    hostAfter !== null &&
    Math.abs(
      menuAfter.getBoundingClientRect().top -
        hostAfter.getBoundingClientRect().bottom
    ) < 2
  report(
    'S2 18513 anchor-follow + stacking',
    menu !== null && inFsOk && efpOk && backOk,
    `open=${menu !== null} tracksAnchorInFs=${inFsOk} paintsOnTop=${efpOk} tracksBack=${backOk}`
  )
  s2menu.value.hide()
  await settle(400)
}

async function s3() {
  fullscreenLeakCheck('S3')
  const input = document.querySelector('.s3-input')
  input.value = 'abc'
  input.focus()
  input.setSelectionRange(1, 2)
  s3fs.value = true
  await settle(400)
  const enterOk =
    document.activeElement === input &&
    input.selectionStart === 1 &&
    input.selectionEnd === 2
  s3fs.value = false
  await settle(400)
  const exitOk =
    document.activeElement === input &&
    input.selectionStart === 1 &&
    input.selectionEnd === 2
  report(
    'S3 17843 input focus+caret',
    enterOk && exitOk,
    `enter=${enterOk} exit=${exitOk}`
  )
}

async function s4() {
  fullscreenLeakCheck('S4')
  const editable = document.querySelector('.s4-edit')
  const textNode = editable.firstChild
  editable.focus()
  document.getSelection().setBaseAndExtent(textNode, 2, textNode, 6)
  s3fs.value = true
  await settle(400)
  const selection = document.getSelection()
  const ok =
    document.activeElement === editable &&
    selection.anchorNode === textNode &&
    selection.anchorOffset === 2 &&
    selection.focusNode === textNode &&
    selection.focusOffset === 6
  report(
    'S4 17843 contenteditable caret',
    ok,
    `active=${document.activeElement === editable}` +
      ` anchor=${selection.anchorNode === textNode}@${selection.anchorOffset}` +
      ` focus=${selection.focusNode === textNode}@${selection.focusOffset}`
  )
  s3fs.value = false
  await settle(400)
}

async function s5() {
  fullscreenLeakCheck('S5')
  s5dialog.value = true
  await settle(600)
  s5fs.value = true
  await settle(500)
  const input = document.querySelector('.s5-input')
  input.focus()
  await settle(400)
  const keptInDetached = document.activeElement === input
  const outside = document.createElement('input')
  document.body.append(outside)
  outside.focus()
  await settle(400)
  // the JS focus trap is a desktop affordance (see utils/private.focus/
  // focusout.js); touch platforms rely on aria-modal for AT containment
  const desktop = !$q.platform.is.mobile
  const outsideOk = desktop ? document.activeElement !== outside : true
  outside.remove()
  report(
    'S5 18474 dialog trap + fullscreen child',
    keptInDetached && outsideOk,
    `detachedKeepsFocus=${keptInDetached}` +
      (desktop ? ` outsideStillTrapped=${outsideOk}` : ' (touch: trap n/a)')
  )
  s5fs.value = false
  await settle(300)
  s5dialog.value = false
  await settle(600)
}

async function s6() {
  fullscreenLeakCheck('S6')
  s6fs.value = true
  await settle(400)
  s6tt.value.show()
  await settle(500)
  const tooltip = document.querySelector('.q-tooltip')
  const anchor = document.querySelector('.s6-anchor')
  let ok = false
  let detail = 'tooltip missing'
  if (tooltip !== null) {
    const visible = getComputedStyle(tooltip).opacity === '1'
    const zOk = Number(getComputedStyle(tooltip).zIndex) > 6000
    // position tolerance stays generous: narrow viewports legitimately
    // relocate the tooltip through boundary correction
    const tr = tooltip.getBoundingClientRect()
    const ar = anchor.getBoundingClientRect()
    const nearAnchor =
      Math.abs(tr.top - ar.bottom) < 60 || Math.abs(ar.top - tr.bottom) < 60
    ok = visible && zOk && nearAnchor
    detail = `visible=${visible} zAboveFullscreen=${zOk} nearAnchor=${nearAnchor}`
  }
  report('S6 tooltip above fullscreen content', ok, detail)
  s6tt.value.hide()
  s6fs.value = false
  await settle(400)
}

async function s7() {
  fullscreenLeakCheck('S7')
  s7dialog.value = true
  await settle(600)
  s7fs.value = true
  await settle(400)
  const card = document.querySelector('.s7-card')
  let ok = false
  if (card !== null) {
    const cr = card.getBoundingClientRect()
    const el = document.elementFromPoint(
      cr.left + cr.width / 2,
      cr.top + cr.height / 2
    )
    ok = el !== null && (el === card || card.contains(el))
  }
  report(
    'S7 pre-open dialog lifted above fullscreen',
    ok,
    `elementAtCardCenterIsCard=${ok}`
  )
  s7fs.value = false
  await settle(300)
  s7dialog.value = false
  await settle(600)
}

async function s8() {
  const thumb = document.querySelector('.s8-wrap [role="slider"]')
  if (thumb === null) {
    report('S8 QSlider role + Home/End', false, 'no [role=slider] focusable')
    return
  }
  const ariaOk =
    thumb.getAttribute('aria-valuemin') === '0' &&
    thumb.getAttribute('aria-valuemax') === '10' &&
    thumb.getAttribute('aria-valuenow') === '5'
  // the slider binds no keyboard handlers on touch platforms
  // (trackContainerEvents in QSlider.js) -- assert the markup only there
  if ($q.platform.is.mobile) {
    report(
      'S8 QSlider role + Home/End',
      ariaOk,
      `aria=${ariaOk} (touch: keyboard n/a)`
    )
    return
  }
  thumb.focus()
  pressKey(thumb, 35) // END
  await settle(150)
  const endOk = s8val.value === 10
  pressKey(thumb, 36) // HOME
  await settle(150)
  const homeOk = s8val.value === 0
  pressKey(thumb, 39) // RIGHT
  await settle(150)
  const stepOk = s8val.value === 1
  const nowSynced =
    document
      .querySelector('.s8-wrap [role="slider"]')
      .getAttribute('aria-valuenow') === '1'
  report(
    'S8 QSlider role + Home/End',
    ariaOk && endOk && homeOk && stepOk && nowSynced,
    `aria=${ariaOk} end=${endOk} home=${homeOk} step=${stepOk} valuenowSynced=${nowSynced}`
  )
}

async function s9() {
  const thumbs = [...document.querySelectorAll('.s9-wrap [role="slider"]')]
  if (thumbs.length !== 2) {
    report(
      'S9 QRange per-thumb sliders',
      false,
      `expected 2 [role=slider], got ${thumbs.length}`
    )
    return
  }
  const minThumb = thumbs.find(t => t.getAttribute('aria-valuenow') === '2')
  const maxThumb = thumbs.find(t => t.getAttribute('aria-valuenow') === '8')
  if (minThumb === void 0 || maxThumb === void 0) {
    report(
      'S9 QRange per-thumb sliders',
      false,
      'aria-valuenow does not mirror the model'
    )
    return
  }
  if ($q.platform.is.mobile) {
    report(
      'S9 QRange per-thumb sliders',
      true,
      'twoThumbs=true ariaSynced=true (touch: keyboard n/a)'
    )
    return
  }
  minThumb.focus()
  pressKey(minThumb, 36) // HOME
  await settle(150)
  const minHomeOk = s9val.value.min === 0 && s9val.value.max === 8
  maxThumb.focus()
  pressKey(maxThumb, 35) // END
  await settle(150)
  const maxEndOk = s9val.value.min === 0 && s9val.value.max === 10
  report(
    'S9 QRange per-thumb sliders',
    minHomeOk && maxEndOk,
    `twoThumbs=true minHome=${minHomeOk} maxEnd=${maxEndOk}`
  )
}

async function s10() {
  const radios = [...document.querySelectorAll('.s10-wrap [role="radio"]')]
  const current = radios.find(r => r.getAttribute('tabindex') === '0')
  if (radios.length !== 4 || current === void 0) {
    report(
      'S10 QRating arrow focus direction',
      false,
      `radios=${radios.length} rovingTabindex=${current !== void 0}`
    )
    return
  }
  const startIndex = radios.indexOf(current)
  current.focus()
  pressKey(current, 40) // ARROW DOWN -> next, per the radio-group pattern
  await settle(150)
  const afterDown = [...document.querySelectorAll('.s10-wrap [role="radio"]')]
  const downIndex = afterDown.indexOf(document.activeElement)
  const downOk = downIndex === startIndex + 1
  pressKey(document.activeElement, 38) // ARROW UP -> back
  await settle(150)
  const afterUp = [...document.querySelectorAll('.s10-wrap [role="radio"]')]
  const upOk = afterUp.indexOf(document.activeElement) === startIndex
  report(
    'S10 QRating arrow focus direction',
    downOk && upOk,
    `start=${startIndex} afterDown=${downIndex} backUp=${upOk}`
  )
}

async function s11() {
  const anchor = document.querySelector('.s11-anchor')
  anchor.focus()
  s11menu.value.show()
  await settle(400)
  const inner = document.querySelector('.s11-inner')
  inner.focus()
  pressKey(inner, 9) // TAB
  await settle(400)
  const closed = document.querySelector('.q-menu') === null
  const refocused =
    document.activeElement === anchor || anchor.contains(document.activeElement)
  report(
    'S11 15675 TAB closes menu, returns focus',
    closed && refocused,
    `closed=${closed} anchorRefocused=${refocused}`
  )
}

async function s12() {
  s12dlg.value = true
  await settle(500)
  const dlgEl = document.querySelector('[data-sweep-dlg]')
  const dlgOk = dlgEl !== null && dlgEl.classList.contains('s12-dlg-class')
  s12dlg.value = false
  await settle(500)
  s12tt.value.show()
  await settle(400)
  const ttEl = document.querySelector('.q-tooltip[data-sweep-tt]')
  const ttOk = ttEl !== null && ttEl.classList.contains('s12-tt-class')
  s12tt.value.hide()
  await settle(300)
  report(
    'S12 dialog/tooltip fall-through attrs',
    dlgOk && ttOk,
    `dialog=${dlgOk} tooltip=${ttOk}`
  )
}

// S13: #17031 the scaffolded viewport must not block zoom in web modes
function s13() {
  const meta = document.querySelector('meta[name="viewport"]')
  const content = meta !== null ? meta.getAttribute('content') || '' : ''
  const locked =
    /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(?![.\d])/.test(content)
  const hasDeviceWidth = content.includes('width=device-width')
  // hybrid wrappers intentionally keep the locked viewport (see the
  // Accessibility docs page, "Viewport zoom")
  const hybrid =
    $q.platform.is.cordova === true || $q.platform.is.capacitor === true
  const ok = meta !== null && hasDeviceWidth && (hybrid ? locked : !locked)
  report(
    'S13 17031 viewport allows zoom',
    ok,
    `content="${content}"` + (hybrid ? ' (hybrid: lock expected)' : '')
  )
}

async function runAll() {
  lines.value = []
  results.length = 0
  const tag = route.query.tag || 'untagged'
  lines.value.push(`sweep tag=${tag} ua=${navigator.userAgent.slice(0, 80)}`)

  const scenarios = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13]
  for (const scenario of scenarios) {
    try {
      await scenario()
    } catch (err) {
      report(scenario.name + ' (crashed)', false, String(err).slice(0, 120))
    }
  }

  const passCount = results.filter(r => r.pass).length
  lines.value.push(`SUMMARY ${passCount}/${results.length} passed`)
  window.__results = { tag, results: [...results] }
  window.__done = true

  if (route.query.beacon !== void 0) {
    const compact = results
      .map(r => r.name.split(' ')[0] + '=' + (r.pass ? 'P' : 'F'))
      .join(',')
    const failDetails = results
      .filter(r => !r.pass)
      .map(r => r.name.split(' ')[0] + '(' + r.detail + ')')
      .join(';')
    fetch(
      route.query.beacon +
        `/__verdict__${tag}__${passCount}of${results.length}__${compact}` +
        (failDetails !== ''
          ? '__' + encodeURIComponent(failDetails).slice(0, 600)
          : ''),
      { mode: 'no-cors' }
    ).catch(() => {})
  }
}

onMounted(() => {
  if (route.query.autorun !== void 0) {
    setTimeout(runAll, 300)
  }
})
</script>

<style scoped>
.sweep-verdict {
  font-family: monospace;
  white-space: pre-wrap;
  background: #eee;
  padding: 8px;
  font-size: 12px;
}
.fixture {
  border: 1px dashed #ccc;
  padding: 8px;
  margin-bottom: 8px;
}
</style>
