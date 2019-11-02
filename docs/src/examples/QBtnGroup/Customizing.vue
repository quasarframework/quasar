<template>
  <div class="q-pa-md">

    <div class="wrapper">
      <q-btn-group flat class="container">
        <q-btn ref="one" flat label="One" @click="onItemClick" />

        <q-btn ref="two" flat label="Two" @click="onItemClick" />

        <q-btn ref="three" flat label="Three" @click="onItemClick" />

        <q-btn ref="four" flat label="Four" @click="onItemClick" />

        <q-btn ref="five" flat label="Five" @click="onItemClick" />

      </q-btn-group>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // when button is clicked, remove any existing "active" classes
    // and add "active" class, which really isn't a class,
    // except to be used as a reference in the CSS below
    onItemClick (event) {
      const refs = [ 'one', 'two', 'three', 'four', 'five' ]
      refs.forEach(ref => {
        this.$refs[ref].$el.classList.remove('active')
      })
      // make sure the target is the actual button
      // and not child of the button
      let target = event.target
      while (target.nodeName !== 'BUTTON') {
        target = target.parentElement
      }
      target.classList.add('active')
    }
  }
}
</script>

<style lang="sass" scoped>
.wrapper
  width: 412px
  background: linear-gradient(#3D4246,#24282B)
  height: 60px
  border-radius: 4px
  border-top: 1px solid #53575C
  border-left: 1px solid #53575C
  box-shadow: 1px 1px #17191C,0 0 10px #323338
  padding: 8px
  padding-bottom: 12px

.container
  width: 396px
  height: 100%
  border: 1px solid #0F1014
  border-radius: 3px
  background: #0F1014

.container > .q-btn
  float: left
  width: 80px
  height: 100%
  color: #D9D9D9
  text-align: center
  text-shadow: 0 1px #0F1014
  display: table
  background: linear-gradient(#44494F,#2F3237)
  border-radius: 3px
  border-right: 1px solid #0F1014
  border-bottom: 1px solid #0F1014
  border-top: 1px solid #53575C
  border-left: 1px solid #53575C
  box-shadow: 1px 1px #17191C
  cursor: pointer

.container > .q-btn.active
  color: yellow
  background: #2A2D31
  box-shadow: inset 0 0 5px 2px rgba(15, 16, 20, 0.5)
  border: 1px solid #0F1014

.container > .q-btn:not(.active):hover
  text-shadow: 1px 1px 10px yellow
</style>
