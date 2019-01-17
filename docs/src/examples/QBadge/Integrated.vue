<template>
  <div class="q-pa-md q-gutter-sm">
    <q-item clickable v-ripple class="bg-blue-grey-2">
      <q-item-section side>
        <q-avatar rounded size="48px">
          <img src="https://cdn.quasar-framework.org/img/chaosmonkey.png" />
          <q-badge
            floating
            opaque
            :color="badgeColor"
            :text-color="badgeTextColor"
          >
            {{ count }}
            <q-icon
              name="fas fa-exclamation-triangle"
              size="14px"
            />
          </q-badge>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Ganglia
        </q-item-label>
        <q-item-label caption>
          {{ count }} new errors
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item>
          <span v-if="minutes >= 2">
            {{ minutes }} minutes ago
          </span>
          <span v-else>
            {{ since }}
          </span>
        </q-item>
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
export default {
  data () {
    return {
      count: 0,
      since: 'just now',
      minutes: 1,
      badgeColor: 'yellow-6',
      badgeTextColor: 'black'
    }
  },
  created () {
    const mailer = setInterval(() => {
      this.count++
      if (this.count === 99999) {
        setInterval(() => {
          this.minutes++
        }, 60000)
        this.badgeColor = 'red-8'
        this.badgeTextColor = 'white'
        this.count = '∞'
        clearInterval(mailer)
      }
    }, 5)
  }
}
</script>
