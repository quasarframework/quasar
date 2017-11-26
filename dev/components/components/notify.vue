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
          <div>
            <q-btn round small color="tertiary" @click="alertAsMethod('center')">
              <q-icon name="fullscreen_exit" />
            </q-btn>
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

const alerts = [
  { color: 'error', message: 'Woah! Danger! You are getting good at this!', icon: 'report_problem' },
  { color: 'warning', message: 'You need to know about this!', icon: 'warning' },
  { color: 'amber', message: 'Wow! Nice job!', icon: 'thumb_up' },
  { color: 'secondary', message: 'Quasar is cool! Right?', icon: 'tag_faces' }
]

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
      const { color, icon, message } = alerts[ Math.floor(Math.random(5) * 10) % 4 ]
      this.$q.notify({
        color,
        icon,
        message,
        position,
        timeout: Math.random() * 5000 + 3000
      })
    }
  }
}
</script>

<style lang="styl">
.q-notification-list-center
  pointer-events none
  top 0
  left 0
  right 0
  bottom 0
  margin-bottom 10px
.q-notification-list-top
  pointer-events none
  top 0
  left 0
  right 0
  margin-bottom 10px
.q-notification-list-bottom
  pointer-events none
  left 0
  right 0
  bottom 0
  margin-bottom 10px

.q-notification
  border-radius 5px
  pointer-events all
  display inline-block
  margin 10px 10px 0
  transition all 1s
  z-index 9999 // $z-max

.q-notification-
  &top-enter,
  &top-right-enter, &top-right-leave-to,
  &top-left-enter, &top-left-leave-to,
  &top-enter, &top-leave-to
    opacity 0
    transform translateY(-50px)

  &center-enter, &center-leave-to,
  &bottom-enter, &bottom-leave-to,
  &left-enter, &left-leave-to,
  &right-enter, &right-leave-to,
  &bottom-right-enter, &bottom-right-leave-to,
  &bottom-left-enter, &bottom-left-leave-to,
  &bottom-enter, &bottom-leave-to
    opacity 0
    transform translateY(50px)
    z-index 9998 // $z-max - 1

  &center-leave-active,
  &top-leave-active
    position absolute
    top 0
    margin 10px 0
    z-index 9998 // $z-max - 1
  &right-leave-active,
  &top-right-leave-active
    position absolute
    right 0
    z-index 9998 // $z-max - 1
  &left-leave-active,
  &top-left-leave-active
    position absolute
    left 0
    z-index 9998 // $z-max - 1

  &bottom-leave-active
    position absolute
    bottom 0
    margin 10px 0
    z-index 9998 // $z-max - 1
  &bottom-right-leave-active
    position absolute
    bottom 0
    right 0
    z-index 9998 // $z-max - 1
  &bottom-left-leave-active
    position absolute
    bottom 0
    left 0
    z-index 9998 // $z-max - 1
</style>
