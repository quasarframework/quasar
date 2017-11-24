<template>
  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <q-btn class="z-max fixed-bottom-right" color="primary" @click="notify" label="Show notif" />
      <div class="fixed-center z-max">
        <div class="row group">
          <div>
            <q-btn round small color="secondary" @click="alertAsMethod('top-left')">
              <q-icon name="arrow_back" class="rotate-45" />
            </q-btn>
          </div>
          <div>
            <q-btn round small color="tertiary" @click="alertAsMethod('top-center')">
              <q-icon name="arrow_upward" />
            </q-btn>
            <q-btn round small color="tertiary" @click="alertAsMethod('top')">
              <q-icon name="vertical_align_top" />
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
          <div class="invisible" v-for="n in 2">
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
            <q-btn round small color="tertiary" @click="alertAsMethod('bottom-center')">
              <q-icon name="arrow_downward" />
            </q-btn>
            <q-btn round small color="tertiary" @click="alertAsMethod('bottom')">
              <q-icon name="vertical_align_bottom" />
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
  QIcon,
  QCard,
  QCardMain,
  QCardActions,
  QCardSeparator
} from 'quasar'

export default {
  components: {
    QBtn,
    QIcon,
    QCard,
    QCardMain,
    QCardActions,
    QCardSeparator
  },
  data () {
    return {
      visible: true,
      visible2: true
    }
  },
  methods: {
    notify () {
      this.$q.notify({
        title: 'Some Title',
        message: 'Some message',
        timeout: 3000
      })
    },
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
  margin-right 10px
  margin-top 10px
  transition all 1s

.q-notification-
  &top-right-enter, &top-right-leave-to,
  &top-left-enter, &top-left-leave-to,
  &top-enter, &top-leave-to
    opacity 0
    transform translateY(-50px)

  &bottom-right-enter, &bottom-right-leave-to,
  &bottom-left-enter, &bottom-left-leave-to,
  &bottom-enter, &bottom-leave-to
    opacity 0
    transform translateY(50px)

  &top-right-leave-active
    position absolute
    top 0
    right 0
  &top-left-leave-active
    position absolute
    top 0
  &bottom-right-leave-active
    position absolute
    bottom 0
    right 0
  &bottom-left-leave-active
    position absolute
    bottom 0
    left 0
</style>
