<template>
  <div class="q-pa-md">
    <div class="row justify-start items-center q-mb-md">
      Max Stack Depth: {{ maxStack }}
    </div>

    <div class="row justify-around items-center">
      <div class="row items-center q-px-md q-gutter-sm">
        <q-btn label="Undo" color="primary" :disable="undoStack.length === 0" @click="undo" />
        <div>Stack Depth: {{ undoStack.length }}</div>
      </div>

      <div class="row items-center q-px-md q-gutter-sm">
        <q-btn label="Redo" color="accent" :disable="redoStack.length === 0" @click="redo" />
        <div>Stack Depth: {{ redoStack.length }}</div>
      </div>
    </div>

    <div class="row justify-around items-center q-mt-md">
      <div
        ref="editorRef"
        v-mutation="handler"
        contentEditable="true"
        class="editable rounded-borders q-pa-sm overflow-auto"
      >Type here</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const maxStack = ref(100)
    const undoStack = ref([])
    const redoStack = ref([])
    const undoBlocked = ref(false)

    const editorRef = ref(null)

    function checkStack (stack) {
      if (stack.length > maxStack.value) {
        stack.splice(maxStack.value)
      }
    }

    function clearStack (stack) {
      stack.splice(0)
    }

    return {
      maxStack,
      undoStack,
      redoStack,
      undoBlocked,

      editorRef,

      undo () {
        // shift the stack
        const data = undoStack.value.shift()
        if (data !== void 0) {
          // block undo from receiving its own data
          undoBlocked.value = true
          editorRef.value.innerText = data
        }
      },

      redo () {
        // shift the stack
        const data = redoStack.value.shift()
        if (data !== void 0) {
          // unblock undo from receiving redo data
          undoBlocked.value = false
          editorRef.value.innerText = data
        }
      },

      handler (mutationRecords) {
        mutationRecords.forEach(record => {
          if (record.type === 'characterData') {
            undoStack.value.unshift(record.oldValue)
            checkStack(undoStack.value)
            clearStack(redoStack.value)
          }
          else if (record.type === 'childList') {
            record.removedNodes.forEach(node => {
              if (undoBlocked.value === false) {
                // comes from redo
                undoStack.value.unshift(node.textContent)
              }
              else {
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
    }
  }
}
</script>

<style scoped lang="sass">
.editable
  width: 100%
  height: 100px
  border: 1px solid #aaa
  outline: 0
</style>
