<template>
  <div class="q-pa-md">
    <div class="row justify-around items-center q-pb-lg">
      <div class="col">
        <!--First Drop Target-->
        <div
          v-mutation="handler1"
          data-drop-target="true"
          @dragenter="onDragEnter"
          @dragleave="onDragLeave"
          @dragover="onDragOver"
          @drop="onDrop"
        >
          <div
            id="box1"
            draggable="true"
            @dragstart="onDragStart"
            class="box navy"
          ></div>
          <div
            id="box2"
            draggable="true"
            @dragstart="onDragStart"
            class="box red"
          ></div>
          <div
            id="box3"
            draggable="true"
            @dragstart="onDragStart"
            class="box green"
          ></div>
          <div
            id="box4"
            draggable="true"
            @dragstart="onDragStart"
            class="box orange"
          ></div>
          <div
            id="box5"
            draggable="true"
            @dragstart="onDragStart"
            class="box navy"
          ></div>
          <div
            id="box6"
            draggable="true"
            @dragstart="onDragStart"
            class="box red"
          ></div>
          <div
            id="box7"
            draggable="true"
            @dragstart="onDragStart"
            class="box green"
          ></div>
          <div
            id="box8"
            draggable="true"
            @dragstart="onDragStart"
            class="box orange"
          ></div>
        </div>
      </div>

      <div class="col">
        <!--Second Drop Target-->
        <div
          v-mutation="handler2"
          data-drop-target="true"
          @dragenter="onDragEnter"
          @dragleave="onDragLeave"
          @dragover="onDragOver"
          @drop="onDrop"
        ></div>
      </div>
    </div>
    <!--Mutation Information-->
    <div class="row justify-around items-start q-pb-lg">
      <div class="col">
        <div class="text-subtitle1">Mutation Info</div>
        <p v-for="status in status1" :key="status">{{ status }}</p>
      </div>
      <div class="col">
        <div class="text-subtitle1">Mutation Info</div>
        <p v-for="status in status2" :key="status">{{ status }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      status1: [],
      status2: []
    }
  },

  methods: {
    handler1 (mutationRecords) {
      this.status1 = []
      for (let index in mutationRecords) {
        const record = mutationRecords[index]
        const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
        this.status1.push(info)
      }
    },
    handler2 (mutationRecords) {
      this.status2 = []
      for (let index in mutationRecords) {
        const record = mutationRecords[index]
        const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
        this.status2.push(info)
      }
    },
    // store the id of the draggable element
    onDragStart (e) {
      e.dataTransfer.setData('text', e.target.id)
      e.dataTransfer.dropEffect = 'move'
    },
    onDragEnter (e) {
      // don't drop on other draggables
      if (e.target.draggable === true) {
        return
      }
      e.target.classList.add('drag-enter')
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
</script>

<style scoped lang="sass">
[data-drop-target]
  height: 400px
  width: 200px
  margin: 25px
  background-color: gainsboro
  float: left

.drag-enter
  outline-style: dashed

.box
  width: 100px
  height: 100px
  float: left

@media only screen and (max-width: 500px)
  [data-drop-target]
    height: 200px
    width: 100px
    margin: 25px
    background-color: gainsboro
    float: left

  .box
    width: 50px
    height: 50px
    float: left

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
