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
        ref="editor"
        v-mutation="handler"
        contentEditable="true"
        class="editable rounded-borders q-pa-sm overflow-auto"
      >Type here</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      maxStack: 100,
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
  height: 100px
  border: 1px solid #aaa
  outline: 0
</style>
