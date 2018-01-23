<template>
  <div class="layout-padding" style="max-width: 600px;">
    <p class="caption">QCollapsible is a QItem with extended functionality</p>
    <q-collapsible icon="explore" label="Explore">
      <div>{{ lorem }}</div>
    </q-collapsible>

    <p class="caption">Explore the possibilities</p>
    <q-list separator>
      <q-collapsible
        v-model="open"
        icon="perm_identity"
        label="With a model and events"
        @show="notify('Opened a Collapsible')"
        @hide="notify('Closed a Collapsible', true)"
      >
        <div>{{ lorem }}</div>
      </q-collapsible>

      <q-collapsible icon="shopping_cart" label="Toggle by right-side icon only" icon-toggle>
        <div>{{ lorem }}</div>
      </q-collapsible>

      <q-collapsible icon="explore" right-icon="map" label="With right-side icon too">
        <div>{{ lorem }}</div>
      </q-collapsible>

      <q-collapsible>
        <template slot="header">
          <q-chip color="primary" small class="q-mr-sm">Custom header</q-chip>
          <q-item-main label="using slot" />
          <q-item-side right>
            <q-icon name="star" color="red" size="24px" />
          </q-item-side>
        </template>

        <div>{{ lorem }}</div>
      </q-collapsible>

      <q-collapsible avatar="statics/boy-avatar.png" label="With avatar">
        <div>{{ lorem }}</div>
      </q-collapsible>

      <q-collapsible icon="drafts" label="Disabled" disable>
        <div>{{ lorem }}</div>
      </q-collapsible>

      <q-collapsible letter="J" right-avatar="statics/boy-avatar.png" label="Jim">
        <div>{{ lorem }}</div>
      </q-collapsible>
    </q-list>

    <p class="caption">Multiline</p>
    <q-list inset-separator>
      <q-collapsible icon="mail" label="Inbox" sublabel="5 unread emails">
        <div>{{ lorem }}</div>
      </q-collapsible>
      <q-collapsible icon="send" label="Outbox" sublabel="Empty">
        <div>{{ lorem }}</div>
      </q-collapsible>
    </q-list>

    <p class="caption">Popups</p>
    <div>
      <q-collapsible popup icon="mail" label="Inbox" sublabel="5 unread emails">
        <div>{{ lorem }}</div>
      </q-collapsible>
      <q-collapsible popup icon="send" label="Outbox" sublabel="Empty">
        <div>{{ lorem }}</div>
      </q-collapsible>
      <q-collapsible popup icon="drafts" label="Draft" sublabel="Draft a new email">
        <div>{{ lorem }}</div>
      </q-collapsible>
    </div>

    <p class="caption">Menu</p>
    <q-list separator>
      <q-collapsible indent icon="mail" label="Inbox" sublabel="5 unread emails" opened>

        <q-collapsible indent icon="receipt" label="Receipts">

          <q-collapsible label="Today">
            <div>{{ lorem }}</div>
          </q-collapsible>
          <q-collapsible label="Yesterday">
            <div>{{ lorem }}</div>
          </q-collapsible>

        </q-collapsible>

        <q-collapsible indent icon="schedule" label="Postponed">
          <div>{{ lorem }}</div>
        </q-collapsible>

      </q-collapsible>

      <q-collapsible indent icon="send" label="Outbox" sublabel="Empty">
        <q-collapsible label="Today">
          <div>{{ lorem }}</div>
        </q-collapsible>
        <q-collapsible label="Yesterday">
          <div>{{ lorem }}</div>
        </q-collapsible>
      </q-collapsible>

      <q-collapsible indent icon="drafts" label="Draft" sublabel="Draft a new email">
        <div>{{ lorem }}</div>
      </q-collapsible>
    </q-list>

    <p class="caption">Group a.k.a Accordion (opening one closes the other)</p>
    <q-list>
      <q-collapsible group="somegroup" icon="explore" label="First" opened>
        <div>{{ lorem }}</div>
      </q-collapsible>
      <q-collapsible group="somegroup" icon="perm_identity" label="Second" header-class="text-red">
        <div>{{ lorem }}</div>
      </q-collapsible>
      <q-collapsible group="somegroup" icon="shopping_cart" label="Third">
        <div>{{ lorem }}</div>
      </q-collapsible>
    </q-list>

    <p class="caption">Preselected/Opened Collapsible (or use a model)</p>
    <q-list separator>
      <q-collapsible icon="explore" label="First">
        <div>{{ lorem }}</div>
      </q-collapsible>
      <q-collapsible icon="perm_identity" label="Second" opened>
        <div>{{ lorem }}</div>
      </q-collapsible>
    </q-list>

    <p class="caption">Make use of events</p>
    <q-collapsible indent icon="explore" label="Counter" @show="startCounting" @hide="stopCounting">
      <div>
        <q-chip color="secondary">Counting: {{ counter }}</q-chip>
      </div>
      <div class="q-mt-md">Will only count when opened, using the show/hide events to control count timer.</div>
    </q-collapsible>

    <p class="caption">Ubiquity. Using Cards as content.</p>
    <q-list separator>
      <q-collapsible icon="explore" label="First Card">
        <q-card color="primary">
          <q-card-title>
            Card Title
          </q-card-title>
          <q-card-main>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </q-card-main>
        </q-card>
      </q-collapsible>
      <q-collapsible icon="perm_identity" label="Second Card">
        <q-card>
          <q-card-media>
            <img src="statics/mountains.jpg">
          </q-card-media>
          <q-card-main>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </q-card-main>
        </q-card>
      </q-collapsible>
      <q-collapsible icon="shopping_cart" label="Third Card">
        <q-card>
          <q-card-media>
            <img src="~assets/map.png">
          </q-card-media>
          <q-card-main>
            <q-item>
              <q-item-side icon="local_bar" />
              <q-item-main>
                <q-item-tile label>Bar XYZ</q-item-tile>
                <q-item-tile sublabel>Have a drink.</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side icon="local_gas_station" />
              <q-item-main>
                <q-item-tile label>Gas Station</q-item-tile>
                <q-item-tile sublabel>Fill your gas tank.</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side icon="local_movies" />
              <q-item-main>
                <q-item-tile label>Cinema XYZ</q-item-tile>
                <q-item-tile sublabel>Watch a movie.</q-item-tile>
              </q-item-main>
            </q-item>
          </q-card-main>
          <q-card-actions class="group">
            <div class="text-lime">
              13 minutes
            </div>
            <div>
              (1 mile)
            </div>
            <div class="col" />
            <q-btn flat color="primary" size="sm" icon="directions" label="Start" />
          </q-card-actions>
        </q-card>
      </q-collapsible>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: false,
      counter: 0,
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, nemo minus dolore facere saepe molestias, fugiat officia aspernatur expedita pariatur, accusantium hic exercitationem perspiciatis voluptate possimus nobis temporibus ipsa officiis!'
    }
  },
  methods: {
    notify (message, close) {
      this.$q.notify({
        color: close ? 'tertiary' : 'secondary',
        message
      })
    },
    startCounting () {
      console.log('counter start')

      this.hndl = setInterval(() => {
        this.counter++
      }, 1000)
    },
    stopCounting () {
      console.log('counter stop')

      clearInterval(this.hndl)
    }
  }
}
</script>
