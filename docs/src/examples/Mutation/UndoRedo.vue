<template>
  <div class="q-pa-md">
    <div class="row justify-start items-center q-pb-md">
      Max Stack Depth: {{ maxStack }}
    </div>
    <div class="row justify-around items-center q-pb-md">
      <div class="row items-center q-px-md q-gutter-sm">
        <q-btn label="Undo" :disable="undoStack.length === 0" @click="undo"></q-btn>
        <div>Stack Depth: {{ undoStack.length }}</div>
      </div>
      <div class="row items-center q-px-md q-gutter-sm">
        <q-btn label="Redo" :disable="redoStack.length === 0" @click="redo"></q-btn>
        <div>Stack Depth: {{ redoStack.length }}</div>
      </div>
    </div>
    <div class="row justify-around items-center q-pb-md">
      <div ref='editor' v-mutation="handler" contentEditable='true' class="editable"></div>
    </div>
  </div>
</template>

<script>
// maximum depth of a stack
const MAX_STACK = 100

export default {
  data () {
    return {
      maxStack: MAX_STACK,
      undoStack: [],
      redoStack: [],
      undoBlocked: false
    }
  },

  methods: {
    undo () {
      // shift the stack
      const data = this.undoStack.shift()
      if (data !== void 0) {
        // block undo from receiving its own data
        this.undoBlocked = true

        this.$refs.editor.innerText = data
      }
    },
    redo () {
      // shift the stack
      const data = this.redoStack.shift()
      if (data !== void 0) {
        // unblock undo from receiving redo data
        this.undoBlocked = false

        this.$refs.editor.innerText = data
      }
    },
    handler (mutationRecords) {
      mutationRecords.forEach(record => {
        if (record.type === 'characterData') {
          this.undoStack.unshift(record.oldValue)
          this.checkStack(this.undoStack)
          this.clearStack(this.redoStack)
        }
        else if (record.type === 'childList') {
          record.removedNodes.forEach(node => {
            if (this.undoBlocked === false) {
              // comes from redo
              this.undoStack.unshift(node.textContent)
            }
            else {
              // comes from undo
              this.redoStack.unshift(node.textContent)
            }
          })
          // check stacks
          this.checkStack(this.undoStack)
          this.checkStack(this.redoStack)
          this.undoBlocked = false
        }
      })
    },

    checkStack (stack) {
      if (stack.length > this.maxStack) {
        stack.splice(this.maxStack)
      }
    },

    clearStack (stack) {
      stack.splice(0)
    }
  }
}
</script>

<style scoped lang="sass">
.editable
  width: 100%
  height: 200px
  border: black solid 1px
</style>
