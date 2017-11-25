<template>
  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="fixed-center z-max">
        <div class="row group">
          <div>
            <q-btn round small color="secondary" @click="alertAsMethod('top-left')">
              <q-icon name="arrow_back" class="rotate-45" />
            </q-btn>
          </div>
          <div>
            <q-btn round small color="tertiary" @click="alertAsMethod('top')">
              <q-icon name="arrow_upward" />
            </q-btn>
          </div>
          <div>
            <q-btn round small color="secondary" @click="alertAsMethod('top-right')">
              <q-icon name="arrow_upward" class="rotate-45" />
            </q-btn>
          </div>
        </div>
        <div class="row group">
          <div>
            <q-btn round small color="tertiary" @click="alertAsMethod('left')">
              <q-icon name="arrow_back" />
            </q-btn>
          </div>
          <div class="invisible">
            <q-btn round small />
          </div>
          <div>
            <q-btn round small color="tertiary" @click="alertAsMethod('right')">
              <q-icon name="arrow_forward" />
            </q-btn>
          </div>
        </div>
        <div class="row group">
          <div>
            <q-btn round small color="secondary" @click="alertAsMethod('bottom-left')">
              <q-icon name="arrow_forward" class="rotate-135" />
            </q-btn>
          </div>
          <div>
            <q-btn round small color="tertiary" @click="alertAsMethod('bottom')">
              <q-icon name="arrow_downward" />
            </q-btn>
          </div>
          <div>
            <q-btn round small color="secondary" @click="alertAsMethod('bottom-right')">
              <q-icon name="arrow_forward" class="rotate-45" />
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QBtn,
  QIcon
} from 'quasar'

export default {
  components: {
    QBtn,
    QIcon
  },
  data () {
    return {
      visible: true,
      visible2: true
    }
  },
  methods: {
    alertAsMethod (position) {
      this.$q.notify({
        title: 'Some Title',
        message: `Notify on ${position}`,
        position: position
      })
    }
  }
}
</script>

<style lang="styl">
.q-notification-list-top
  pointer-events none
  top 0
  left 0
  right 0
.q-notification-list-bottom
  pointer-events none
  left 0
  right 0
  bottom 0

.q-notification
  background yellow
  padding 10px
  border-radius 5px
  pointer-events all
  display inline-block
  margin 10px
  transition all 1s

.q-notification-
  &top-enter,
  &top-right-enter, &top-right-leave-to,
  &top-left-enter, &top-left-leave-to,
  &top-enter, &top-leave-to
    opacity 0
    transform translateY(-50px)

  &bottom,
  &bottom-right-enter, &bottom-right-leave-to,
  &bottom-left-enter, &bottom-left-leave-to,
  &bottom-enter, &bottom-leave-to
    opacity 0
    transform translateY(50px)

  &top-leave-active
    position absolute
    bottom 0
    margin 10px 0
  &top-right-leave-active
    position absolute
    top 0
    right 0
  &top-left-leave-active
    position absolute
    top 0
    left 0

  &bottom-leave-active
    position absolute
    bottom 0
    margin 10px 0
  &bottom-right-leave-active
    position absolute
    bottom 0
    right 0
  &bottom-left-leave-active
    position absolute
    bottom 0
    left 0
</style>
