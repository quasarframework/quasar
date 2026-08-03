<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar class="q-gutter-md justify-around">
        <q-select
          dark
          color="yellow"
          borderless
          square
          v-model="fabDirection"
          :options="fabDirections"
          label="FAB open direction"
          style="min-width: 150px"
        />
        <q-select
          dark
          color="yellow"
          borderless
          square
          v-model="fabVerticalActionsAlign"
          :options="fabVerticalActionsAligns"
          label="FAB v-align"
          style="min-width: 150px"
        />
        <q-select
          dark
          color="yellow"
          borderless
          square
          v-model="fabLabelPosition"
          :options="fabLabelPositions"
          label="Label position"
          style="min-width: 150px"
        />
        <q-toggle
          dark
          color="yellow"
          v-model="fabExternalLabel"
          label="External label"
        />
        <q-toggle dark color="yellow" v-model="fabSquare" label="Square" />
        <q-toggle dark color="yellow" v-model="hideLabel" label="Hide label" />
        <q-toggle dark color="yellow" v-model="hideIcon" label="Hide icon" />
        <q-toggle
          dark
          color="yellow"
          v-model="withLabelClass"
          label="Label class"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <div v-for="i in 300" :key="i" class="q-pa-sm">Row {{ i }}</div>

        <q-page-sticky
          :position="stickyConfig.position"
          :offset="stickyConfig.offset"
        >
          <q-fab
            class="shadow-4"
            :direction="fabDirection"
            color="primary"
            :label="`Actions aligned ${fabVerticalActionsAlign}`"
            :label-position="fabLabelPosition"
            :vertical-actions-align="fabVerticalActionsAlign"
            :square="fabSquare"
            :external-label="fabExternalLabel"
            :hide-label="hideLabel"
            :hide-icon="hideIcon"
            :label-class="labelClass"
            aria-label="Opens FAB menu"
            role="menu"
          >
            <q-fab-action
              class="white shadow-12"
              color="green"
              icon="center_focus_weak"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
              aria-label="A FAB Action"
            />
            <q-fab-action
              class="white shadow-8"
              color="red"
              icon="center_focus_weak"
              label="Anchor start"
              :label-position="fabLabelPosition"
              anchor="start"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
            />
            <q-fab-action
              class="white"
              color="red"
              icon="center_focus_weak"
              anchor="center"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
            />
            <q-fab-action
              class="white shadow-2"
              color="blue"
              icon="center_focus_weak"
              label="Anchor center"
              :label-position="fabLabelPosition"
              anchor="center"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
            />
            <q-fab-action
              class="white"
              color="deep-orange"
              icon="center_focus_weak"
              anchor="end"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
            />
            <q-fab-action
              class="white"
              color="deep-orange"
              icon="center_focus_weak"
              label="Anchor end"
              :label-position="fabLabelPosition"
              anchor="end"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
            />
            <q-fab-action
              class="white"
              color="green"
              icon="center_focus_weak"
              :label-position="fabLabelPosition"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
            />
            <q-fab-action
              class="white"
              color="blue"
              icon="center_focus_weak"
              anchor="start"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
            />
            <q-fab-action
              class="white"
              color="purple"
              icon="center_focus_weak"
              label="Anchor default"
              :label-position="fabLabelPosition"
              :square="fabSquare"
              :external-label="fabExternalLabel"
              :hide-label="hideLabel"
              :label-class="labelClass"
            />
          </q-fab>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue'

const fabDirection = ref('up')
const fabVerticalActionsAlign = ref('center')
const fabExtended = ref(true)
const fabExternalLabel = ref(true)
const fabLabelPosition = ref('right')
const fabSquare = ref(false)
const hideLabel = ref(false)
const hideIcon = ref(false)
const withLabelClass = ref(false)

const fabDirections = ref(['right', 'left', 'up', 'down'])
const fabVerticalActionsAligns = ref(['center', 'left', 'right'])
const fabLabelPositions = ref(['right', 'left', 'top', 'bottom'])

const labelClass = computed(() =>
  withLabelClass.value ? 'bg-white text-grey-8' : ''
)

const stickyConfig = computed(() => {
  if (fabDirection.value === 'up') {
    return {
      position: 'bottom',
      offset: [fabVerticalActionsAlign.value === 'center' ? 0 : 18, 18]
    }
  }

  if (fabDirection.value === 'down') {
    return {
      position: 'top',
      offset: [fabVerticalActionsAlign.value === 'center' ? 0 : 18, 18]
    }
  }

  if (fabDirection.value === 'left') {
    return {
      position: 'right',
      offset: [18, 0]
    }
  }

  return {
    position: 'left',
    offset: [18, 0]
  }
})

function logEvt(evt) {
  console.log(`@${evt.type}`, evt)
}
</script>
