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

    <!-- S14: #12109 a fixed child of a QScrollArea stays viewport-anchored.
         The reference box is fixed at the same coordinates but outside any
         scroll area, so the check survives whatever the page ancestors do -->
    <div class="fixture">
      <div class="s14-ref" />
      <div style="height: 120px; width: 260px; overflow: auto">
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <div class="s14-fixed" />
            S14 content
          </div>
        </q-scroll-area>
      </div>
    </div>

    <!-- S15: #10120/#10281 guard - a QScrollArea must not inflate the
         scrollable overflow of an ancestor sized to a fractional height,
         which is what made the ancestor flash a native scrollbar -->
    <div class="fixture">
      <div
        class="s15-outer"
        style="height: 250.5px; width: 260px; overflow: auto"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-sm">S15 content</div>
        </q-scroll-area>
      </div>
    </div>

    <!-- S16: #17847 QTabs must notice it overflows whichever way `align`
         pushes the content. The box has to be wider than the 600px
         `breakpoint`, below which `align` is dropped in favour of `justify`
         and the bug cannot appear at all. The left-aligned set is the
         control: if it stops being scrollable the fixture itself is wrong -->
    <div class="fixture">
      <div style="width: 700px">
        <!-- mobile-arrows: on mobile platforms arrows are otherwise hidden
             in favour of touch panning, which would fail this scenario's
             arrow assertions on the iOS Simulator run -->
        <q-tabs v-model="s16tab" align="left" mobile-arrows class="s16-left">
          <q-tab v-for="n in 12" :key="n" :name="`t${n}`" :label="`Tab ${n}`" />
        </q-tabs>
        <q-tabs v-model="s16tab" align="right" mobile-arrows class="s16-right">
          <q-tab v-for="n in 12" :key="n" :name="`t${n}`" :label="`Tab ${n}`" />
        </q-tabs>
      </div>
    </div>

    <!-- S17: #17639 a backspace that arrives without the keydown hook (the
         iOS soft keyboard) and lands on a mask literal must delete the data
         char before it instead of being silently undone -->
    <div class="fixture">
      <q-input
        v-model="s17model"
        mask="card"
        class="s17-input"
        filled
        dense
        label="S17"
      />
    </div>

    <!-- S18: #7920/#7777 the multiple-masks pattern: a computed mask picks
         the format from the unmasked length; crossing the threshold in
         either direction must re-lay-out the value with the caret intact -->
    <div class="fixture">
      <q-input
        v-model="s18model"
        :mask="s18mask"
        unmasked-value
        class="s18-input"
        filled
        dense
        label="S18"
      />
    </div>
    <!-- S20: #17155 shadow-text visibility follows focus; an invalid field
         must still hide it on blur and keep it while focused -->
    <div class="fixture">
      <q-input
        v-model="s20model"
        :rules="[val => val.length > 2 || 'min 3 chars']"
        shadow-text=" shadow"
        class="s20-input"
        filled
        dense
        label="S20"
      />
    </div>

    <!-- S21/S22: QTooltip per-interaction pointer wiring + pen lifecycle -->
    <div class="fixture">
      <q-btn class="s21-anchor" dense label="S21">
        <q-tooltip ref="s21tt">S21 tooltip</q-tooltip>
      </q-btn>
      <q-btn class="s22-anchor" dense label="S22">
        <q-tooltip ref="s22tt">S22 tooltip</q-tooltip>
      </q-btn>
    </div>

    <!-- S23: context menu served by capability-neutral wiring -->
    <div class="fixture">
      <div class="s23-target" style="width: 220px; height: 48px">
        S23 context area
        <q-menu ref="s23menu" context-menu>
          <div class="q-pa-sm">S23 menu</div>
        </q-menu>
      </div>
    </div>

    <!-- S24: a press on the dialog backdrop dismisses only the top popup -->
    <q-dialog v-model="s24dlg">
      <div class="bg-white q-pa-md">
        <q-btn class="s24-anchor" dense label="S24">
          <q-menu ref="s24menu">
            <div class="q-pa-sm">S24 menu</div>
          </q-menu>
        </q-btn>
      </div>
    </q-dialog>

    <!-- S25: slider tap compatibility burst + keyboard on every platform -->
    <div class="fixture s25-wrap">
      <q-slider
        v-model="s25val"
        :min="0"
        :max="10"
        :step="1"
        style="width: 200px"
        @update:model-value="s25onUpdate"
        @change="s25onChange"
      />
    </div>

    <!-- S26: TouchHold/TouchRepeat selection suppression per interaction -->
    <div class="fixture">
      <div v-touch-hold:400.mouse="s26onHold" class="s26-hold">S26 hold</div>
      <div v-touch-repeat:400:300.mouse="s26onRepeat" class="s26-repeat">
        S26 repeat
      </div>
    </div>

    <!-- S27: #18183 sticky content vs the page scroll lock; mounted only
         while the scenario runs, so the bar cannot cover other fixtures -->
    <template v-if="s27on">
      <div class="s27-fixed" />
      <div class="s27-wrap">
        <div class="s27-sticky">S27 sticky</div>
      </div>
      <q-dialog v-model="s27dlg">
        <div class="bg-white q-pa-md">S27 dialog</div>
      </q-dialog>
    </template>

    <!-- S19: #12994 reveal QHeader must reappear when a route change
         happens while the Loading plugin keeps the page scroll-locked.
         Own window-scrolling layout: the bug lives in the non-container
         QLayout path only -->
    <template v-if="s19on">
      <q-layout class="s19-layout">
        <q-header reveal class="s19-header bg-primary text-white">
          <q-toolbar>
            <q-toolbar-title>S19</q-toolbar-title>
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page>
            <div style="height: 3000px">S19 tall page</div>
          </q-page>
        </q-page-container>
      </q-layout>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
const s16tab = ref('t1')
const s17model = ref('')
const s18model = ref('')
const s19on = ref(false)
const s20model = ref('okay')
const s21tt = ref(null)
const s22tt = ref(null)
const s23menu = ref(null)
const s24dlg = ref(false)
const s24menu = ref(null)
const s25val = ref(5)
const s25log = { updates: 0, changes: [] }
function s25onUpdate() {
  s25log.updates++
}
function s25onChange(val) {
  s25log.changes.push(val)
}
const s26counts = { hold: 0, repeat: 0 }
function s26onHold() {
  s26counts.hold++
}
function s26onRepeat() {
  s26counts.repeat++
}
const s27on = ref(false)
const s27dlg = ref(false)
// the "Multiple masks" docs pattern (docs/src/examples/QInput/MaskMultiple.vue)
const s18mask = computed(() =>
  s18model.value !== null && s18model.value.length > 10
    ? '(##) #####-####'
    : '(##) ####-#####'
)

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
  // keyboard is wired on every platform (trackContainerEvents in
  // QSlider.js), so it is asserted on mobile UAs too
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
  minThumb.focus()
  pressKey(minThumb, 36) // HOME
  await settle(150)
  const minHomeOk = s9val.value.min === 0 && s9val.value.max === 8
  maxThumb.focus()
  pressKey(maxThumb, 35) // END
  await settle(150)
  const maxEndOk = s9val.value.min === 0 && s9val.value.max === 10

  // a track tap must not leave the moved thumb's focus ring behind:
  // QRange marks the moved thumb as focused while positioning it, and
  // on touch platforms no blur ever arrives to clear that mark
  // (found on an iPhone: the ring survived scrolling and taps away)
  const wrap = document.querySelector('.s9-wrap')
  const track = wrap.querySelector('.q-slider__track-container')
  const rect = wrap.querySelector('.q-slider').getBoundingClientRect()
  const tapAt = {
    bubbles: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
  }
  track.dispatchEvent(new MouseEvent('mousedown', tapAt))
  await settle(100)
  document.dispatchEvent(new MouseEvent('mouseup', tapAt))
  await settle(100)
  track.dispatchEvent(new MouseEvent('click', tapAt))
  await settle(200)
  const noLingeringRing = wrap.querySelector('.q-slider--focus') === null

  report(
    'S9 QRange per-thumb sliders',
    minHomeOk && maxEndOk && noLingeringRing,
    `twoThumbs=true minHome=${minHomeOk} maxEnd=${maxEndOk} ` +
      `noLingeringRing=${noLingeringRing}`
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

// S14: #12109 QScrollArea must not become the containing block of its
// `position: fixed` descendants
function s14() {
  const outside = document.querySelector('.s14-ref').getBoundingClientRect()
  const inside = document.querySelector('.s14-fixed').getBoundingClientRect()
  const dx = Math.abs(inside.x - outside.x)
  const dy = Math.abs(inside.y - outside.y)
  const ok = dx < 1 && dy < 1
  report(
    'S14 12109 fixed child stays viewport-anchored',
    ok,
    `ref=${Math.round(outside.x)},${Math.round(outside.y)} ` +
      `inside=${Math.round(inside.x)},${Math.round(inside.y)}`
  )
}

// S15: #10120/#10281 the ancestor must not end up scrollable by a fraction
function s15() {
  const outer = document.querySelector('.s15-outer')
  const overflow = outer.scrollHeight - outer.clientHeight
  const ok = overflow <= 0
  report(
    'S15 10281 no phantom scrollbar on the ancestor',
    ok,
    `scrollHeight=${outer.scrollHeight} clientHeight=${outer.clientHeight}`
  )
}

// S16: #17847 QTabs must detect overflow no matter how `align` positions its
// content. With align="right" the tabs spill towards the start edge, which
// Blink and Gecko keep out of the scrollable overflow region, so measuring via
// scrollWidth reported "fits" and the arrows were hidden. WebKit reported it,
// so this only ever failed in 2 of the 3 engines.
function s16() {
  const visibleArrows = el =>
    Array.prototype.filter.call(
      el.querySelectorAll('.q-tabs__arrow'),
      arrow => getComputedStyle(arrow).display !== 'none'
    ).length

  const left = document.querySelector('.s16-left'),
    right = document.querySelector('.s16-right'),
    leftArrows = visibleArrows(left),
    rightArrows = visibleArrows(right),
    rightScrollable = right.classList.contains('q-tabs--scrollable'),
    ok = leftArrows > 0 && rightScrollable && rightArrows > 0

  report(
    'S16 17847 QTabs detects overflow when align=right',
    ok,
    `leftArrows=${leftArrows} rightArrows=${rightArrows} ` +
      `rightScrollable=${rightScrollable}`
  )
}

// S17: #17639 -- the iOS soft keyboard does not go through the keydown hook
// that pre-selects across mask literals, so a backspace landing on a literal
// used to be silently undone by the remask, leaving the caret misplaced and
// scrambling the digits typed next ("1234 89" instead of "1239 8")
async function s17() {
  const inp = document.querySelector('.s17-input input')
  inp.focus()

  const insert = ch => {
    inp.setRangeText(ch, inp.selectionStart, inp.selectionEnd, 'end')
    inp.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: ch
      })
    )
  }
  // backspace as the soft keyboard delivers it: no usable keydown, the char
  // before the caret is removed, then the input event fires
  const softBackspace = () => {
    let start = inp.selectionStart
    const end = inp.selectionEnd
    if (start === end) {
      if (end === 0) return
      start = end - 1
    }
    inp.setRangeText('', start, end, 'end')
    inp.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        inputType: 'deleteContentBackward'
      })
    )
  }

  for (const char of '123456') {
    insert(char)
    await settle(30)
  }
  for (let i = 0; i < 3; i++) {
    softBackspace()
    await settle(30)
  }
  insert('9')
  await settle(30)
  insert('8')
  await settle(30)

  const ok = inp.value === '1239 8' && inp.selectionStart === 6
  report(
    'S17 17639 soft-keyboard backspace over a mask literal',
    ok,
    `value="${inp.value}" cursor=${inp.selectionStart}`
  )
}

// S18: #7920/#7777 -- the multiple-masks pattern: a computed mask picks the
// format from the unmasked length. Crossing the threshold re-lays-out the
// value (the hyphen moves) and the caret must stay after its data chars
async function s18() {
  const inp = document.querySelector('.s18-input input')
  inp.focus()

  const insert = ch => {
    inp.setRangeText(ch, inp.selectionStart, inp.selectionEnd, 'end')
    inp.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: ch
      })
    )
  }

  for (const char of '1123456789') {
    insert(char)
    await settle(30)
  }
  const eightDigit = inp.value

  // the 11th digit crosses the threshold: mask switches, hyphen moves
  insert('0')
  await settle(60)
  const nineDigit = { v: inp.value, cur: inp.selectionStart }

  // backspace (soft-keyboard style) crosses back down
  inp.setRangeText('', inp.value.length - 1, inp.value.length, 'end')
  inp.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      inputType: 'deleteContentBackward'
    })
  )
  await settle(60)
  const backDown = inp.value

  const ok =
    eightDigit === '(11) 2345-6789' &&
    nineDigit.v === '(11) 23456-7890' &&
    nineDigit.cur === nineDigit.v.length &&
    backDown === '(11) 2345-6789'
  report(
    'S18 7920 computed mask switches formats mid-typing',
    ok,
    `8d="${eightDigit}" 9d="${nineDigit.v}"@${nineDigit.cur} back="${backDown}"`
  )
}

// S19: #12994 -- QLayout suppresses page scrolls for as long as the
// Loading plugin holds the scroll lock (#7012); when a route change
// happens under the lock, the unlock skips the scroll restore, so the
// layout used to keep the stale pre-navigation scroll state and a reveal
// QHeader never reappeared at the top of the new page
async function s19() {
  s19on.value = true
  // scroll anchoring (Firefox especially) can nudge the position back up
  // after the programmatic jump, which counts as an 'up' move and
  // re-reveals the header, breaking the fixture's control condition
  document.documentElement.style.overflowAnchor = 'none'
  await settle(300)

  const header = document.querySelector('.s19-header')

  // earlier scenarios focus() inputs far down the page, which Blink and
  // Gecko answer with a scroll-into-view; settle at the top first so the
  // moves below are unambiguous 'down' travel
  document.activeElement?.blur()
  window.scrollTo(0, 0)
  await settle(250)

  // the reveal logic hides only after 100px+ of travel PAST the last
  // direction change, so take two down moves: the first may only set the
  // inflection point, the second provides the travel
  window.scrollTo(0, 500)
  await settle(250)
  let hiddenAfterScroll = false
  for (let i = 0; i < 5 && !hiddenAfterScroll; i++) {
    window.scrollTo(0, 1300 + 200 * i)
    await settle(250)
    hiddenAfterScroll = header.classList.contains('q-header--hidden')
  }

  const path = window.location.pathname
  $q.loading.show({ delay: 0 })
  await settle(400)
  // a navigation as prevent-scroll sees one: the pathname moves on while
  // the lock is held (no popstate, the router stays put) and the router's
  // scroll behavior takes the new route to the top. That scroll is the
  // navigation's, not the lock's -- the lock only clips the viewport and
  // leaves the page where it is (#18183) -- and QLayout has to re-sync
  // with it once the lock lifts
  history.pushState({}, '', path + '/s19-nav')
  window.scrollTo(0, 0)
  $q.loading.hide()
  await settle(500)

  const atTop = Math.round(window.scrollY) === 0
  const revealed = !header.classList.contains('q-header--hidden')

  history.pushState({}, '', path)
  s19on.value = false
  document.documentElement.style.overflowAnchor = ''
  await settle(200)
  window.scrollTo(0, 0)
  await settle(200)

  report(
    'S19 12994 reveal header vs scroll lock + route change',
    hiddenAfterScroll && atTop && revealed,
    `hidByScroll=${hiddenAfterScroll} atTop=${atTop} revealedAfterUnlock=${revealed}`
  )
}

// S20: #17155 -- the q-field--highlighted class stays on while the field
// has an error, so gating the shadow-text opacity on it kept the shadow
// visible after blur, overlapped with the label; visibility must follow
// focus alone: shown while focused (error or not), hidden when blurred
async function s20() {
  const field = document.querySelector('.s20-input')
  const input = field.querySelector('input')
  const shadow = field.querySelector('.q-field__shadow')
  const opacity = () => Number(getComputedStyle(shadow).opacity)

  input.focus()
  await settle(600)
  const shownFocused = opacity() > 0.4

  // fail the min-3 rule while still focused
  s20model.value = 'x'
  await settle(600)
  const errOn = field.classList.contains('q-field--error')
  const shownFocusedError = opacity() > 0.4

  input.blur()
  await settle(600)
  const stillErr = field.classList.contains('q-field--error')
  const hiddenBlurredError = opacity() < 0.1

  s20model.value = 'okay'
  await settle(300)

  report(
    'S20 17155 shadow-text vs error state',
    shownFocused &&
      errOn &&
      shownFocusedError &&
      stillErr &&
      hiddenBlurredError,
    `focus=${shownFocused} err=${errOn} focusErr=${shownFocusedError} ` +
      `blurErrKept=${stillErr} blurHidden=${hiddenBlurredError}`
  )
}

// S21: QTooltip wires pointer events per interaction, no device sniff:
// mouse hovers show/hide with no contact UX, a primary touch engages the
// hold UX (selection suppressed) and its lift ends it, secondary touches
// (a starting pinch-zoom) are ignored
async function s21() {
  const anchor = document.querySelector('.s21-anchor')
  const tt = () => document.querySelector('.q-tooltip') !== null
  const nonSel = () => document.body.classList.contains('non-selectable')

  // tooltips hide on any scroll-target scroll BY DESIGN, and Blink/Gecko
  // scroll anchoring compensates for the growing verdict panel above with
  // real scroll events mid-scenario (WebKit has no scroll anchoring, so
  // only 2 of the 3 engines would fail); pin the page for the duration
  document.documentElement.style.overflowAnchor = 'none'
  anchor.scrollIntoView({ block: 'center' })
  await settle(300)

  anchor.dispatchEvent(
    new PointerEvent('pointerenter', { pointerType: 'mouse' })
  )
  await settle(300)
  const mouseShows = tt()
  const mouseNoContact = !nonSel()

  anchor.dispatchEvent(
    new PointerEvent('pointerleave', { pointerType: 'mouse' })
  )
  await settle(500)
  const mouseHides = !tt()

  anchor.dispatchEvent(
    new PointerEvent('pointerenter', { pointerType: 'touch', isPrimary: true })
  )
  await settle(300)
  const touchShows = tt()
  const touchEngages = nonSel()

  anchor.dispatchEvent(new Event('touchend'))
  await settle(500)
  const liftEnds = !tt() && !nonSel()

  // synthetic PointerEvents default to isPrimary false
  anchor.dispatchEvent(
    new PointerEvent('pointerenter', { pointerType: 'touch' })
  )
  await settle(300)
  const secondaryIgnored = !tt()

  s21tt.value.hide()
  await settle(300)
  document.documentElement.style.overflowAnchor = ''

  report(
    'S21 tooltip per-interaction pointer wiring',
    mouseShows &&
      mouseNoContact &&
      mouseHides &&
      touchShows &&
      touchEngages &&
      liftEnds &&
      secondaryIgnored,
    `mouse=${mouseShows}/${mouseHides} noContactForMouse=${mouseNoContact} ` +
      `touch=${touchShows}+sel=${touchEngages} lift=${liftEnds} ` +
      `secondaryIgnored=${secondaryIgnored}`
  )
}

// S22: a stylus hovers like a mouse and presses like touch: the press
// upgrades an in-flight hover to the contact UX, the lift keeps the
// tooltip shown (the pen still hovers); focus moving WITHIN the anchor
// (QBtn shuffles it after every press) must not hide it, a real blur must
async function s22() {
  const anchor = document.querySelector('.s22-anchor')
  const tt = () => document.querySelector('.q-tooltip') !== null
  const nonSel = () => document.body.classList.contains('non-selectable')

  // same page pinning as S21: a stray scroll event hides the tooltip
  document.documentElement.style.overflowAnchor = 'none'
  anchor.scrollIntoView({ block: 'center' })
  await settle(300)

  anchor.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'pen' }))
  await settle(300)
  const hoverShows = tt() && !nonSel()

  anchor.dispatchEvent(
    new PointerEvent('pointerdown', {
      pointerType: 'pen',
      buttons: 1,
      bubbles: true
    })
  )
  await settle(150)
  const pressEngages = tt() && nonSel()

  anchor.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await settle(300)
  const liftKeepsShown = tt() && !nonSel()

  anchor.dispatchEvent(
    new FocusEvent('focusout', { relatedTarget: anchor.firstElementChild })
  )
  await settle(300)
  const innerFocusKeeps = tt()

  anchor.dispatchEvent(new FocusEvent('focusout'))
  await settle(500)
  const blurHides = !tt()

  anchor.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'pen' }))
  await settle(200)
  document.documentElement.style.overflowAnchor = ''

  report(
    'S22 tooltip pen lifecycle + intra-anchor focusout',
    hoverShows &&
      pressEngages &&
      liftKeepsShown &&
      innerFocusKeeps &&
      blurHides,
    `hover=${hoverShows} press=${pressEngages} lift=${liftKeepsShown} ` +
      `innerFocusKept=${innerFocusKeeps} blurHides=${blurHides}`
  )
}

// S23: context menus on capability-neutral wiring: a right-click's
// contextmenu opens, a touch long-press opens (with the anchor's
// selection suppressed), the SAME long-press's native contextmenu is
// swallowed once, a touch pointerdown cannot undo the fresh menu, and a
// non-touch press both hides and releases the ownership
async function s23() {
  const target = document.querySelector('.s23-target')
  const rect = target.getBoundingClientRect()
  const at = {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
  }
  const menuOpen = () => document.querySelector('.q-menu') !== null

  let evt = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    ...at
  })
  target.dispatchEvent(evt)
  await settle(400)
  const rightClickOpens = menuOpen() && evt.defaultPrevented

  target.dispatchEvent(
    new PointerEvent('pointerdown', { pointerType: 'mouse', bubbles: true })
  )
  await settle(500)
  const mousePressHides = !menuOpen()

  evt = new Event('touchstart')
  Object.defineProperty(evt, 'touches', { value: [at] })
  target.dispatchEvent(evt)
  await settle(100)
  const holdSuppressesSelection =
    target.classList.contains('non-selectable') && !menuOpen()
  await settle(500)
  const holdOpens = menuOpen()

  evt = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    ...at
  })
  target.dispatchEvent(evt)
  await settle(300)
  const ownContextSwallowed = evt.defaultPrevented && menuOpen()

  target.dispatchEvent(
    new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true })
  )
  await settle(300)
  const touchPressIgnored = menuOpen()

  target.dispatchEvent(new Event('touchend'))
  await settle(200)
  const liftCleansSelection = !target.classList.contains('non-selectable')

  target.dispatchEvent(
    new PointerEvent('pointerdown', { pointerType: 'mouse', bubbles: true })
  )
  await settle(500)

  evt = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    ...at
  })
  target.dispatchEvent(evt)
  await settle(400)
  const ownershipReleased = menuOpen()

  s23menu.value.hide()
  await settle(400)

  report(
    'S23 context menu capability wiring',
    rightClickOpens &&
      mousePressHides &&
      holdSuppressesSelection &&
      holdOpens &&
      ownContextSwallowed &&
      touchPressIgnored &&
      liftCleansSelection &&
      ownershipReleased,
    `rightClick=${rightClickOpens} mouseHide=${mousePressHides} ` +
      `holdSel=${holdSuppressesSelection} holdOpens=${holdOpens} ` +
      `ownCtxSwallowed=${ownContextSwallowed} touchDownIgnored=${touchPressIgnored} ` +
      `liftCleans=${liftCleansSelection} released=${ownershipReleased}`
  )
}

// S24: the dialog backdrop acts on press: with a menu open inside the
// dialog the first press (mouse or the swallowed touch) dismisses only
// the menu, the next one the dialog; non-primary buttons are ignored
async function s24() {
  const backdrop = () => document.querySelector('.q-dialog__backdrop')
  const menuOpen = () => document.querySelector('.q-menu') !== null
  const dialogOpen = () => document.querySelector('.q-dialog') !== null

  s24dlg.value = true
  await settle(500)
  s24menu.value.show()
  await settle(400)

  let press = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  backdrop().dispatchEvent(press)
  await settle(400)
  const firstPressMenuOnly =
    !menuOpen() && dialogOpen() && press.defaultPrevented

  press = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  backdrop().dispatchEvent(press)
  await settle(600)
  const secondPressDialog = !dialogOpen()

  s24dlg.value = true
  await settle(500)
  backdrop().dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 2 })
  )
  await settle(400)
  const rightPressIgnored = dialogOpen()

  s24menu.value.show()
  await settle(400)
  const tap = new Event('touchstart', { cancelable: true })
  backdrop().dispatchEvent(tap)
  await settle(400)
  const tapMenuOnly = !menuOpen() && dialogOpen() && tap.defaultPrevented

  s24dlg.value = false
  await settle(500)

  report(
    'S24 backdrop press dismisses only the top popup',
    firstPressMenuOnly && secondPressDialog && rightPressIgnored && tapMenuOnly,
    `pressMenuOnly=${firstPressMenuOnly} pressDialog=${secondPressDialog} ` +
      `rightIgnored=${rightPressIgnored} tapMenuOnly=${tapMenuOnly}`
  )
}

// S25: a tap's compatibility burst (mousedown, mouseup, click at one
// spot) lands the model once with a single change and a single
// update:modelValue; the keyboard steps it on every platform
async function s25() {
  const slider = document.querySelector('.s25-wrap .q-slider')
  const track = document.querySelector('.s25-wrap [role="slider"]')
  const rect = slider.getBoundingClientRect()
  const at = {
    clientX: rect.left + rect.width * 0.8,
    clientY: rect.top + rect.height / 2
  }

  s25log.updates = 0
  s25log.changes.length = 0

  track.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, ...at }))
  await settle(100)
  document.dispatchEvent(new MouseEvent('mouseup', { ...at }))
  await settle(100)
  track.dispatchEvent(new MouseEvent('click', { bubbles: true, ...at }))
  await settle(200)

  const tapModel = s25val.value === 8
  const tapEmits =
    s25log.updates === 1 &&
    s25log.changes.length === 1 &&
    s25log.changes[0] === 8

  track.focus()
  pressKey(track, 39) // RIGHT
  await settle(200)
  const keyWorks = s25val.value === 9 && s25log.changes.length === 2
  track.blur()

  report(
    'S25 slider tap burst + keyboard everywhere',
    tapModel && tapEmits && keyWorks,
    `model=${s25val.value} updates=${s25log.updates} ` +
      `changes=${JSON.stringify(s25log.changes)} keyStep=${keyWorks}`
  )
}

// S26: the touch directives suppress text selection per interaction: a
// held mouse never suppresses (TouchHold) or suppresses lazily at the
// first repeat (TouchRepeat), while a touch press suppresses immediately;
// the touch half only runs where the directives wire touch listeners
async function s26() {
  const holdEl = document.querySelector('.s26-hold')
  const repEl = document.querySelector('.s26-repeat')
  const nonSel = () => document.body.classList.contains('non-selectable')
  const at = el => {
    const r = el.getBoundingClientRect()
    return { clientX: r.left + 10, clientY: r.top + 10 }
  }

  s26counts.hold = 0
  s26counts.repeat = 0

  holdEl.dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, ...at(holdEl) })
  )
  const mouseHoldNoSel = !nonSel()
  await settle(600)
  const mouseHoldFired = s26counts.hold === 1
  const mouseHoldStillNoSel = !nonSel()
  document.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true, ...at(holdEl) })
  )
  await settle(100)

  repEl.dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, ...at(repEl) })
  )
  const mouseRepeatLazy = !nonSel()
  await settle(650)
  const mouseRepeatFired = s26counts.repeat >= 1
  const mouseRepeatSel = nonSel()
  document.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true, ...at(repEl) })
  )
  await settle(150)
  const mouseRepeatCleaned = !nonSel()

  let touchOk = true
  let touchDetail = ' touch=n/a'
  if ($q.platform.has.touch) {
    const touchStartOn = el => {
      const evt = new Event('touchstart')
      Object.defineProperty(evt, 'touches', { value: [at(el)] })
      el.dispatchEvent(evt)
    }

    touchStartOn(holdEl)
    const holdImmediateSel = nonSel()
    await settle(600)
    const holdFired = s26counts.hold === 2
    holdEl.dispatchEvent(new Event('touchend', { cancelable: true }))
    await settle(150)
    const holdCleaned = !nonSel()

    const repBase = s26counts.repeat
    touchStartOn(repEl)
    const repImmediateSel = nonSel() && s26counts.repeat === repBase
    await settle(650)
    const repFired = s26counts.repeat > repBase
    repEl.dispatchEvent(new Event('touchend', { cancelable: true }))
    await settle(150)
    const repCleaned = !nonSel()

    touchOk =
      holdImmediateSel &&
      holdFired &&
      holdCleaned &&
      repImmediateSel &&
      repFired &&
      repCleaned
    touchDetail =
      ` touchHold=${holdImmediateSel}/${holdFired}/${holdCleaned}` +
      ` touchRepeat=${repImmediateSel}/${repFired}/${repCleaned}`
  }

  report(
    'S26 touch directives suppress selection per interaction',
    mouseHoldNoSel &&
      mouseHoldFired &&
      mouseHoldStillNoSel &&
      mouseRepeatLazy &&
      mouseRepeatFired &&
      mouseRepeatSel &&
      mouseRepeatCleaned &&
      touchOk,
    `mouseHold=${mouseHoldNoSel}/${mouseHoldFired}/${mouseHoldStillNoSel}` +
      ` mouseRepeat=${mouseRepeatLazy}/${mouseRepeatFired}/${mouseRepeatSel}/${mouseRepeatCleaned}` +
      touchDetail
  )
}

// S27: #18183 -- the page scroll lock must leave the page in the flow. A
// pinned (position: fixed) body puts sticky content inside a fixed subtree,
// where Firefox stops applying the sticky offset and draws the element at
// its static -- scrolled-away -- position, so it vanishes for as long as
// the dialog is open. Clipping the viewport instead keeps both the scroll
// position and the sticky bar exactly where they were
async function s27() {
  s27on.value = true
  // the verdict panel above grows with every report, and scroll anchoring
  // would compensate for it with real scrolls mid-measurement
  document.documentElement.style.overflowAnchor = 'none'
  await settle(300)

  const bar = document.querySelector('.s27-sticky')
  const wrap = document.querySelector('.s27-wrap')
  // Mobile Safari offsets viewport-anchored rects by its collapsing browser
  // chrome (S14 hit the same), so "stuck to the top" means "level with a
  // position: fixed; top: 0 probe", not "rect.top is 0"
  const fixedRef = document.querySelector('.s27-fixed')

  // park the viewport in the middle of the tall block, where the bar has
  // travelled with the page and is stuck to the top of the viewport
  window.scrollTo(
    0,
    Math.round(window.scrollY + wrap.getBoundingClientRect().top + 800)
  )
  await settle(300)

  const stuckTop = () =>
    Math.abs(
      Math.round(
        bar.getBoundingClientRect().top - fixedRef.getBoundingClientRect().top
      )
    )
  const stuckBefore = stuckTop() <= 2
  const yBefore = Math.round(window.scrollY)

  s27dlg.value = true
  await settle(400)

  // iOS has no alternative to pinning the body, so there the contract is
  // only that the page comes back on release; everywhere else the page may
  // not move at all and the bar has to stay stuck while the dialog is open
  const pinned = $q.platform.is.ios
  const whileOpen =
    pinned ||
    (stuckTop() <= 2 && Math.abs(Math.round(window.scrollY) - yBefore) <= 2)

  s27dlg.value = false
  await settle(500)

  const restored =
    stuckTop() <= 2 && Math.abs(Math.round(window.scrollY) - yBefore) <= 2

  s27on.value = false
  document.documentElement.style.overflowAnchor = ''
  await settle(200)
  window.scrollTo(0, 0)
  await settle(200)

  report(
    'S27 18183 sticky content survives the scroll lock',
    stuckBefore && whileOpen && restored,
    `stuck=${stuckBefore} whileOpen=${whileOpen} restored=${restored}` +
      (pinned ? ' (pinned lock)' : '')
  )
}

async function runAll() {
  lines.value = []
  results.length = 0
  const tag = route.query.tag || 'untagged'
  lines.value.push(`sweep tag=${tag} ua=${navigator.userAgent.slice(0, 80)}`)

  const scenarios = [
    s1,
    s2,
    s3,
    s4,
    s5,
    s6,
    s7,
    s8,
    s9,
    s10,
    s11,
    s12,
    s13,
    s14,
    s15,
    s16,
    s17,
    s18,
    s19,
    s20,
    s21,
    s22,
    s23,
    s24,
    s25,
    s26,
    s27
  ]
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
/* S27 probes: a tall block whose sticky bar stays pinned to the top of the
   viewport while the page is scrolled through it, measured against a fixed
   top-of-viewport reference (Mobile Safari's collapsing chrome offsets
   viewport-anchored rects, so an absolute 0 cannot be asserted) */
.s27-fixed {
  position: fixed;
  top: 0;
  height: 0;
  width: 0;
  pointer-events: none;
}
.s27-wrap {
  height: 2000px;
}
.s27-sticky {
  position: sticky;
  top: 0;
  height: 40px;
  background: rgba(0, 128, 0, 0.4);
}
/* S14 probes: same declared offsets, one inside a QScrollArea and one not,
   so the two rects must agree. pointer-events stay off so they can never
   swallow a click meant for another scenario */
.s14-ref,
.s14-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  pointer-events: none;
  background: rgba(255, 0, 0, 0.4);
}
</style>
