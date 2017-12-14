<template>
  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="fixed-center z-max">
        <div class="row group">
          <div>
            <q-btn round size="sm" color="secondary" @click="alertAsMethod('top-left')">
              <q-icon name="arrow_back" class="rotate-45" />
            </q-btn>
          </div>
          <div>
            <q-btn round size="sm" color="tertiary" @click="alertAsMethod('top')">
              <q-icon name="arrow_upward" />
            </q-btn>
          </div>
          <div>
            <q-btn round size="sm" color="secondary" @click="alertAsMethod('top-right')">
              <q-icon name="arrow_upward" class="rotate-45" />
            </q-btn>
          </div>
        </div>
        <div class="row group">
          <div>
            <q-btn round size="sm" color="tertiary" @click="alertAsMethod('left')">
              <q-icon name="arrow_back" />
            </q-btn>
          </div>
          <div>
            <q-btn round size="sm" color="tertiary" @click="alertAsMethod('center')">
              <q-icon name="fullscreen_exit" />
            </q-btn>
          </div>
          <div>
            <q-btn round size="sm" color="tertiary" @click="alertAsMethod('right')">
              <q-icon name="arrow_forward" />
            </q-btn>
          </div>
        </div>
        <div class="row group">
          <div>
            <q-btn round size="sm" color="secondary" @click="alertAsMethod('bottom-left')">
              <q-icon name="arrow_forward" class="rotate-135" />
            </q-btn>
          </div>
          <div>
            <q-btn round size="sm" color="tertiary" @click="alertAsMethod('bottom')">
              <q-icon name="arrow_downward" />
            </q-btn>
          </div>
          <div>
            <q-btn round size="sm" color="secondary" @click="alertAsMethod('bottom-right')">
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
  { color: 'negative', message: 'Woah! Danger! You are getting good at this!', icon: 'report_problem' },
  { color: 'pink', message: 'You need to know about this!', icon: 'warning' },
  { color: 'orange', textColor: 'black', message: 'Wow! Nice job!', icon: 'thumb_up' },
  { color: 'secondary', message: 'Quasar is cool! Right?', icon: 'tag_faces' },
  { color: 'tertiary', message: 'Jim just pinged you', avatar: 'statics/boy-avatar.png' }
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
      const { color, textColor, icon, message, avatar } = alerts[ Math.floor(Math.random(5) * 10) % 5 ]
      // const remove =
      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        avatar,
        actions: Math.random() * 100 > 50
          ? [ { label: 'Reply', handler: () => console.log('wooow') } ]
          : null,
        timeout: Math.random() * 5000 + 3000
      })
      /* closeBtn test
      this.$q.notify({
        color,
        textColor,
        icon,
        message,
        position,
        avatar,
        closeBtn: true,
        actions: Math.random() * 100 > 50
          ? [ { label: 'Reply', handler: () => console.log('wooow') } ]
          : null,
        timeout: Math.random() * 5000 + 3000
      })
      */
    }
  }
}
</script>
