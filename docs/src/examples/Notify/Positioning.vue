<template>
  <div class="q-pa-md q-gutter-y-sm column items-center">
    <div>
      <div class="row q-gutter-sm">
        <q-btn round size="sm" color="secondary" @click="showNotif('top-left')">
          <q-icon name="arrow_back" class="rotate-45" />
        </q-btn>
        <q-btn round size="sm" color="accent" @click="showNotif('top')">
          <q-icon name="arrow_upward" />
        </q-btn>
        <q-btn round size="sm" color="secondary" @click="showNotif('top-right')">
          <q-icon name="arrow_upward" class="rotate-45" />
        </q-btn>
      </div>
    </div>

    <div>
      <div class="row q-gutter-sm">
        <div>
          <q-btn round size="sm" color="accent" @click="showNotif('left')">
            <q-icon name="arrow_back" />
          </q-btn>
        </div>
        <div>
          <q-btn round size="sm" color="accent" @click="showNotif('center')">
            <q-icon name="fullscreen_exit" />
          </q-btn>
        </div>
        <div>
          <q-btn round size="sm" color="accent" @click="showNotif('right')">
            <q-icon name="arrow_forward" />
          </q-btn>
        </div>
      </div>
    </div>

    <div>
      <div class="row q-gutter-sm">
        <div>
          <q-btn round size="sm" color="secondary" @click="showNotif('bottom-left')">
            <q-icon name="arrow_forward" class="rotate-135" />
          </q-btn>
        </div>
        <div>
          <q-btn round size="sm" color="accent" @click="showNotif('bottom')">
            <q-icon name="arrow_downward" />
          </q-btn>
        </div>
        <div>
          <q-btn round size="sm" color="secondary" @click="showNotif('bottom-right')">
            <q-icon name="arrow_forward" class="rotate-45" />
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

const alerts = [
  { color: 'negative', message: 'Woah! Danger! You are getting good at this!', icon: 'report_problem' },
  { message: 'You need to know about this!', icon: 'warning' },
  { message: 'Wow! Nice job!', icon: 'thumb_up' },
  { color: 'teal', message: 'Quasar is cool! Right?', icon: 'tag_faces' },
  { color: 'purple', message: 'Jim just pinged you', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png' },
  { multiLine: true, message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic quisquam non ad sit assumenda consequuntur esse inventore officia. Corrupti reiciendis impedit vel, fugit odit quisquam quae porro exercitationem eveniet quasi.' }
]

export default {
  setup () {
    const $q = useQuasar()

    return {
      showNotif (position) {
        const { color, textColor, multiLine, icon, message, avatar } = alerts[
          Math.floor(Math.random(alerts.length) * 10) % alerts.length
        ]
        const random = Math.random() * 100

        const twoActions = random > 70
        const buttonColor = color ? 'white' : void 0

        $q.notify({
          color,
          textColor,
          icon: random > 30 ? icon : null,
          message,
          position,
          avatar,
          multiLine,
          actions: twoActions
            ? [
                { label: 'Reply', color: buttonColor, handler: () => { /* console.log('wooow') */ } },
                { label: 'Dismiss', color: 'yellow', handler: () => { /* console.log('wooow') */ } }
              ]
            : (random > 40
                ? [{ label: 'Reply', color: buttonColor, handler: () => { /* console.log('wooow') */ } }]
                : null
              ),
          timeout: Math.random() * 5000 + 3000
        })
      }
    }
  }
}
</script>
