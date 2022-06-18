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
        <div class="text-subtitle1">
          Mutation Info
        </div>
        <div v-for="status in status1" :key="status">
          {{ status }}
        </div>
      </div>

      <div class="col row justify-center q-pa-md">
        <div class="text-subtitle1">
          Mutation Info
        </div>
        <div v-for="status in status2" :key="status">
          {{ status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const status1 = ref([])
    const status2 = ref([])

    return {
      status1,
      status2,

      handler1 (mutationRecords) {
        status1.value = []
        for (const index in mutationRecords) {
          const record = mutationRecords[ index ]
          const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
          status1.value.push(info)
        }
      },

      handler2 (mutationRecords) {
        status2.value = []
        for (const index in mutationRecords) {
          const record = mutationRecords[ index ]
          const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
          status2.value.push(info)
        }
      },

      // store the id of the draggable element
      onDragStart (e) {
        e.dataTransfer.setData('text', e.target.id)
        e.dataTransfer.dropEffect = 'move'
      },

      onDragEnter (e) {
        // don't drop on other draggables
        if (e.target.draggable !== true) {
          e.target.classList.add('drag-enter')
        }
      },

      onDragLeave (e) {
        e.target.classList.remove('drag-enter')
      },

      onDragOver (e) {
        e.preventDefault()
      },

      onDrop (e) {
        e.preventDefault()

        // don't drop on other draggables
        if (e.target.draggable === true) {
          return
        }

        const draggedId = e.dataTransfer.getData('text')
        const draggedEl = document.getElementById(draggedId)

        // check if original parent node
        if (draggedEl.parentNode === e.target) {
          e.target.classList.remove('drag-enter')
          return
        }

        // make the exchange
        draggedEl.parentNode.removeChild(draggedEl)
        e.target.appendChild(draggedEl)
        e.target.classList.remove('drag-enter')
      }
    }
  }
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
