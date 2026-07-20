---
title: Mutation Directive
description: Vue directive that uses Mutation Observer API to watch for changes being made to the DOM tree.
canonical: https://quasar.dev/vue-directives/mutation
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [Mutation](../../api/Mutation.md)

"Mutation" is a Quasar directive that provides the ability to watch for changes being made to the DOM tree and call a method when these are triggered.

Under the hood, it uses the [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

**API reference:** [Mutation](../../api/Mutation.md)

## Usage

Reading the [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) first will be best in your understanding of how this directive works.

The handler Function takes one parameter, which is an Array of [MutationRecord](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord).

### Catch everything

By not specifying any modifiers (except for "once"), the Mutation directive will enable all of them.

**Example: Catch everything**

Source: [CatchAll.vue](../../examples/Mutation/CatchAll.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row no-wrap q-gutter-md">
      <q-btn
        label="Add row"
        color="primary"
        @click="addRow"
        :disable="listItems.length >= 7"
      />
      <q-btn
        label="Remove row"
        color="accent"
        @click="removeRow"
        :disable="listItems.length === 0"
      />
    </div>

    <div class="row no-wrap q-col-gutter-md">
      <div v-mutation="handler" class="col-4">
        <q-list
          v-if="listItems.length > 0"
          bordered
          separator
          class="q-mt-md rounded-borders"
        >
          <q-item
            v-for="(item, index) in listItems"
            :key="item"
            :id="`item-${index}`"
          >
            <q-item-section>
              {{ item }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-8">
        <q-card
          v-if="mutationInfo.length > 0"
          bordered
          flat
          class="q-mt-md overflow-auto"
        >
          <pre class="catch-all-pre q-pa-md">{{ mutationInfo }}</pre>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

function domToObj(domEl, whitelist) {
  const obj = {}
  for (let i = 0; i < whitelist.length; i++) {
    obj[whitelist[i]] =
      domEl[whitelist[i]] instanceof NodeList
        ? [...domEl[whitelist[i]]]
        : domEl[whitelist[i]]
  }
  return obj
}

const whitelist = [
  // #region
  'id',
  'type',
  'addedNodes',
  'removedNodes',
  'attributeName',
  'attributeNamespace',
  'nextSibling',
  'oldValue',
  'previousSibling',
  'target',
  'tagName',
  'className',
  'childNodes'
  // #endregion
]

const listItems = ref([])
const mutationInfo = ref('')

function handler(mutationRecords) {
  const info = []

  for (const index in mutationRecords) {
    const record = mutationRecords[index]

    info.push(
      JSON.stringify(
        record,
        (name, value) => {
          if (name === '') {
            return domToObj(value, whitelist)
          }
          if (Array.isArray(this)) {
            if (typeof value === 'object') {
              return domToObj(value, whitelist)
            }
            return value
          }
          if (whitelist.some(x => x === name)) {
            return value
          }
        },
        2
      )
    )
  }

  mutationInfo.value = info.join('\n')
}

function addRow() {
  listItems.value.push(`List item #${listItems.value.length + 1}`)
}

function removeRow() {
  listItems.value.pop()
}
</script>

<style lang="sass">
.catch-all-pre
  font-size: 10px
  max-height: 350px
</style>
````

### Drag and drop example

The example below will only work for desktops because of the Drag and drop browser API support. Drag the colored squares to the other location to see the Mutation Observers results.

**Example: Drag and Drop (desktop only)**

Source: [DragDrop.vue](../../examples/Mutation/DragDrop.vue)

````vue
<template>
  <div>
    <div class="row no-wrap justify-around q-px-md q-pt-md">
      <div
        v-mutation="handler1"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover="onDragOver"
        @drop="onDrop"
        class="drop-target rounded-borders overflow-hidden"
      >
        <div
          id="box1"
          draggable="true"
          @dragstart="onDragStart"
          class="box navy"
        />
        <!-- #region -->
        <div
          id="box2"
          draggable="true"
          @dragstart="onDragStart"
          class="box red"
        />
        <div
          id="box3"
          draggable="true"
          @dragstart="onDragStart"
          class="box green"
        />
        <div
          id="box4"
          draggable="true"
          @dragstart="onDragStart"
          class="box orange"
        />
        <div
          id="box5"
          draggable="true"
          @dragstart="onDragStart"
          class="box navy"
        />
        <div
          id="box6"
          draggable="true"
          @dragstart="onDragStart"
          class="box red"
        />
        <div
          id="box7"
          draggable="true"
          @dragstart="onDragStart"
          class="box green"
        />
        <div
          id="box8"
          draggable="true"
          @dragstart="onDragStart"
          class="box orange"
        />
        <!-- #endregion -->
      </div>

      <div
        v-mutation="handler2"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover="onDragOver"
        @drop="onDrop"
        class="drop-target rounded-borders overflow-hidden"
      />
    </div>

    <div class="row justify-around items-start">
      <div class="col row justify-center q-pa-md">
        <div class="text-subtitle1"> Mutation Info </div>
        <div v-for="status in status1" :key="status">
          {{ status }}
        </div>
      </div>

      <div class="col row justify-center q-pa-md">
        <div class="text-subtitle1"> Mutation Info </div>
        <div v-for="status in status2" :key="status">
          {{ status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const status1 = ref([])
const status2 = ref([])

function handler1(mutationRecords) {
  status1.value = []
  for (const index in mutationRecords) {
    const record = mutationRecords[index]
    const info = `type: ${record.type}, nodes added: ${record.addedNodes.length !== 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length !== 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
    status1.value.push(info)
  }
}

function handler2(mutationRecords) {
  status2.value = []
  for (const index in mutationRecords) {
    const record = mutationRecords[index]
    const info = `type: ${record.type}, nodes added: ${record.addedNodes.length !== 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length !== 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
    status2.value.push(info)
  }
}

// store the id of the draggable element
function onDragStart(e) {
  e.dataTransfer.setData('text', e.target.id)
  e.dataTransfer.dropEffect = 'move'
}

function onDragEnter(e) {
  // don't drop on other draggables
  if (e.target.draggable !== true) {
    e.target.classList.add('drag-enter')
  }
}

function onDragLeave(e) {
  e.target.classList.remove('drag-enter')
}

function onDragOver(e) {
  e.preventDefault()
}

function onDrop(e) {
  e.preventDefault()

  // don't drop on other draggables
  if (e.target.draggable) return

  const draggedId = e.dataTransfer.getData('text')
  const draggedEl = document.getElementById(draggedId)

  // check if original parent node
  if (draggedEl.parentNode === e.target) {
    e.target.classList.remove('drag-enter')
    return
  }

  // make the exchange
  draggedEl.remove()
  e.target.append(draggedEl)
  e.target.classList.remove('drag-enter')
}
</script>

<style scoped lang="sass">
.drop-target
  height: 400px
  width: 200px
  min-width: 200px
  background-color: gainsboro

.drag-enter
  outline-style: dashed

.box
  width: 100px
  height: 100px
  float: left
  cursor: pointer

@media only screen and (max-width: 500px)
  .drop-target
    height: 200px
    width: 100px
    min-width: 100px
    background-color: gainsboro

  .box
    width: 50px
    height: 50px

.box:nth-child(3)
  clear: both

.navy
  background-color: navy

.red
  background-color: firebrick

.green
  background-color: darkgreen

.orange
  background-color: orange
</style>
````

### Undo-redo example

One use-case for the Mutation Observer is implementing an Undo/Redo stack in your application. You can observe additions and removals of data, depending on your filtering requirements. You can capture the mutations in a stack and use the stack to implement an undo. Any mutation data during an undo, can go into a redo stack. Don't forget to clear the redo stack when normalized data is being put into the undo stack.

**Example: Undo/Redo**

Source: [UndoRedo.vue](../../examples/Mutation/UndoRedo.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row justify-start items-center q-mb-md">
      Max Stack Depth: {{ maxStack }}
    </div>

    <div class="row justify-around items-center">
      <div class="row items-center q-px-md q-gutter-sm">
        <q-btn
          label="Undo"
          color="primary"
          :disable="undoStack.length === 0"
          @click="undo"
        />
        <div>Stack Depth: {{ undoStack.length }}</div>
      </div>

      <div class="row items-center q-px-md q-gutter-sm">
        <q-btn
          label="Redo"
          color="accent"
          :disable="redoStack.length === 0"
          @click="redo"
        />
        <div>Stack Depth: {{ redoStack.length }}</div>
      </div>
    </div>

    <div class="row justify-around items-center q-mt-md">
      <div
        ref="editorRef"
        v-mutation="handler"
        contentEditable="true"
        class="editable rounded-borders q-pa-sm overflow-auto"
        >Type here</div
      >
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

function clearStack(stack) {
  stack.splice(0)
}

const maxStack = ref(100)
const undoStack = ref([])
const redoStack = ref([])
const undoBlocked = ref(false)

const editorRef = useTemplateRef('editorRef')

function checkStack(stack) {
  if (stack.length > maxStack.value) {
    stack.splice(maxStack.value)
  }
}

function undo() {
  // shift the stack
  const data = undoStack.value.shift()
  if (data !== void 0) {
    // block undo from receiving its own data
    undoBlocked.value = true
    editorRef.value.textContent = data
  }
}

function redo() {
  // shift the stack
  const data = redoStack.value.shift()
  if (data !== void 0) {
    // unblock undo from receiving redo data
    undoBlocked.value = false
    editorRef.value.textContent = data
  }
}

function handler(mutationRecords) {
  mutationRecords.forEach(record => {
    if (record.type === 'characterData') {
      undoStack.value.unshift(record.oldValue)
      checkStack(undoStack.value)
      clearStack(redoStack.value)
    } else if (record.type === 'childList') {
      record.removedNodes.forEach(node => {
        if (!undoBlocked.value) {
          // comes from redo
          undoStack.value.unshift(node.textContent)
        } else {
          // comes from undo
          redoStack.value.unshift(node.textContent)
        }
      })

      // check stacks
      checkStack(undoStack.value)
      checkStack(redoStack.value)
      undoBlocked.value = false
    }
  })
}
</script>

<style scoped lang="sass">
.editable
  width: 100%
  height: 100px
  border: 1px solid #aaa
  outline: 0
</style>
````
