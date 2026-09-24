<template>
  <div ref="pageRef" class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">target ref, reactive options</div>
        <div class="row q-gutter-sm items-center">
          <q-btn color="primary" label="Add child" @click="addChild" />
          <q-btn color="primary" label="Remove child" @click="removeChild" />
          <q-btn color="primary" label="Set attribute" @click="setAttr" />
          <q-btn color="primary" label="Edit text" @click="editText" />
          <q-btn flat color="negative" label="stop()" @click="stop" />
        </div>
        <div class="row q-gutter-sm items-center q-mt-sm">
          <q-toggle v-model="disabled" label="disabled" />
          <q-toggle v-model="once" label="once" />
          <q-toggle v-model="childListOnly" label="childList only" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div ref="boxRef" class="box rounded-borders q-pa-sm bg-grey-3">
          <div v-for="n in children" :key="n" class="q-my-xs">
            child {{ n }}
          </div>
          <span class="text">{{ text }}</span>
        </div>
        <div class="q-mt-md q-gutter-sm">
          <q-badge :label="`batches: ${batches}`" />
          <q-badge color="secondary" :label="`last types: ${lastTypes}`" />
          <q-badge
            color="accent"
            :label="`mutationRecords: ${mutationRecords.length}`"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">component root (no target), attributes only</div>
        <div class="row q-gutter-sm items-center">
          <q-btn
            color="primary"
            label="Set root attribute"
            @click="setRootAttr"
          />
          <q-badge :label="`root batches: ${rootBatches}`" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useMutation } from 'quasar'

const boxRef = useTemplateRef('boxRef')
const pageRef = useTemplateRef('pageRef')

const children = ref(2)
const text = ref('text node')
const disabled = ref(false)
const once = ref(false)
const childListOnly = ref(false)
const batches = ref(0)
const lastTypes = ref('none')

const { mutationRecords, stop } = useMutation(() => ({
  target: boxRef,
  disabled: disabled.value,
  once: once.value,
  ...(childListOnly.value ? { childList: true } : {}),
  onMutation(records) {
    batches.value++
    lastTypes.value = [...new Set(records.map(r => r.type))].join(', ')
  }
}))

function addChild() {
  children.value++
}

function removeChild() {
  if (children.value > 0) children.value--
}

function setAttr() {
  boxRef.value.dataset.stamp = String(batches.value)
}

function editText() {
  text.value += '.'
}

const rootBatches = ref(0)

// observes this page's root element; attributes only, since the badge
// rendering the count lives inside the root and a subtree observation
// would report its own re-render, forever
useMutation({
  attributes: true,
  onMutation() {
    rootBatches.value++
  }
})

function setRootAttr() {
  pageRef.value.dataset.stamp = String(rootBatches.value)
}
</script>
