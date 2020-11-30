<template>
  <div>
    <div class="q-layout-padding q-mx-auto" style="max-width: 600px;">
      <h6>
        Explore the possibilities
      </h6>
      <pre>Model: {{ open }}</pre>
      <q-list bordered>
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Account settings wwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwww"
          label-lines="1"
          caption="John Dowwwwwwwwwwww wwwwwwwwwww wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwe"
          caption-lines="1"
        >
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
              commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          v-model="open"
          expand-separator
          icon="perm_identity"
          label="With a model and events"
        >
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          :model-value="open"
          expand-separator
          icon="perm_identity"
          label="With a model and events - decoupled"
          expand-icon="text_rotation_down"
          expanded-icon="text_rotate_up"
        >
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="signal_wifi_off" />
          </q-item-section>

          <q-item-section>
            Regular item
          </q-item-section>
        </q-item>

        <q-expansion-item expand-separator icon="shopping_cart" label="Toggle by right-side icon only" expand-icon-toggle>
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item :header-inset-level="1" expand-separator label="With header inset">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item :content-inset-level="1" expand-separator icon="map" label="With content inset">
          <div class="q-py-md q-pr-md">
            {{ lorem }}
          </div>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="explore" label="With right-side icon too">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator>
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar icon="bluetooth" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <div>
                <q-chip dense color="secondary" text-color="white" class="q-mr-sm">
                  Using slot
                </q-chip>
                <q-badge color="secondary">
                  Using slot
                </q-badge>
              </div>
            </q-item-section>

            <q-item-section side>
              <div class="row items-center">
                <q-icon name="star" color="red" size="24px" />
                <q-icon name="star" color="red" size="24px" />
                <q-icon name="star" color="red" size="24px" />
              </div>
            </q-item-section>
          </template>

          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator>
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              With Avatar
            </q-item-section>
          </template>

          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item icon="drafts" label="Disabled" disable>
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator label="Jim">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator dense label="Dense" icon="settings">
          <div class="q-pa-sm">
            {{ lorem }}
          </div>
        </q-expansion-item>

        <q-expansion-item expand-separator dense label="With textarea autogrow - default CLOSED">
          <div class="q-pa-md">
            <q-input v-model="lorem" stack-label label="textarea" outlined autogrow class="bg-white" />
          </div>
        </q-expansion-item>

        <q-expansion-item expand-separator dense label="With textarea autogrow - default OPENED" default-opened>
          <div class="q-pa-md">
            <q-input v-model="lorem" stack-label label="textarea" outlined autogrow class="bg-white" />
          </div>
        </q-expansion-item>
      </q-list>

      <h6>
        Links
      </h6>
      <q-list bordered>
        <q-expansion-item expand-separator to="/" exact icon="home" label="Inactive link">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator to="/" exact disable icon="home" label="Inactive link - Disabled">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator :to="$route.path" icon="home" label="Active link">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- check .my-expand-link CSS class below -->
        <q-expansion-item
          expand-separator
          :to="$route.path"
          active-class="my-expand-link"
          icon="home"
          label="Customized active link"
        >
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <h6>
        Testing icon toggle attached events
      </h6>
      <q-expansion-item expand-separator icon="shopping_cart" label="Toggle by right-side icon only" expand-icon-toggle>
        <q-card>
          <q-card-section>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora voluptatum natus consectetur ipsam laboriosam tenetur? Et ducimus quaerat labore a amet distinctio, facilis dolores, iusto, quam excepturi tempora porro fugit?
            <q-btn label="Btn" />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item to="/" expand-separator icon="shopping_cart" label="Toggle by right-side icon only">
        <q-card>
          <q-card-section>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod soluta neque, earum porro nostrum odio iure numquam temporibus beatae non reiciendis consequuntur. Minima reiciendis, modi possimus explicabo beatae necessitatibus voluptas.
            <q-btn label="Btn" />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item disable expand-separator icon="shopping_cart" label="Toggle by right-side icon only" expand-icon-toggle>
        <q-card>
          <q-card-section>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora voluptatum natus consectetur ipsam laboriosam tenetur? Et ducimus quaerat labore a amet distinctio, facilis dolores, iusto, quam excepturi tempora porro fugit?
            <q-btn label="Btn" />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item disable to="/" expand-separator icon="shopping_cart" label="Toggle by right-side icon only">
        <q-card>
          <q-card-section>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod soluta neque, earum porro nostrum odio iure numquam temporibus beatae non reiciendis consequuntur. Minima reiciendis, modi possimus explicabo beatae necessitatibus voluptas.
            <q-btn label="Btn" />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <h6>
        Make use of events
      </h6>
      <q-expansion-item class="shadow-1 overflow-hidden" style="border-radius: 30px" icon="explore" label="Counter" @show="startCounting" @hide="stopCounting">
        <q-card>
          <q-card-section>
            Counting: <q-chip dense color="secondary" text-color="white">
              {{ counter }}
            </q-chip>
            Will only count when opened, using the show/hide events to control count timer.
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <h6>
        On dark Background
      </h6>
      <q-expansion-item dark class="bg-black" icon="shopping_cart" label="Toggle me">
        <q-card dark class="bg-black">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <h6>
        Multiline
      </h6>
      <q-list bordered inset-separator>
        <q-expansion-item icon="mail" label="Inbox" caption="5 unread emails">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item icon="send" label="Outbox" caption="Empty">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <h6>
        Switch toggle side
      </h6>
      <q-list bordered padding inset-separator>
        <q-expansion-item expand-icon-toggle switch-toggle-side icon="mail" label="Inbox" caption="5 unread emails">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-icon-toggle switch-toggle-side icon="send" label="Outbox" caption="Empty">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator />
        <q-expansion-item expand-icon-toggle switch-toggle-side dense-toggle icon="mail" label="Inbox" caption="5 unread emails">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-icon-toggle switch-toggle-side dense-toggle icon="mail" label="Inbox" caption="5 unread emails">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <h6>
        Popups
      </h6>
      <div>
        <q-expansion-item popup icon="mail" label="Inbox" caption="5 unread emails">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item popup icon="send" label="Outbox" caption="Empty">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item popup icon="drafts" label="Draft" caption="Draft a new email">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>

      <h6>
        Menu
      </h6>
      <q-list bordered>
        <q-expansion-item expand-separator icon="mail" label="Inbox" :content-inset-level="1" caption="5 unread emails" default-opened>
          <q-expansion-item expand-separator icon="receipt" label="Receipts">
            <q-expansion-item label="Today" :header-inset-level="1" :content-inset-level="1">
              <q-card>
                <q-card-section>
                  {{ lorem }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item label="Yesterday" :header-inset-level="1" :content-inset-level="1">
              <q-card>
                <q-card-section>
                  {{ lorem }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-expansion-item>

          <q-expansion-item expand-separator icon="schedule" label="Postponed">
            <q-card>
              <q-card-section>
                {{ lorem }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="mail" label="Inbox" caption="5 unread emails" default-opened>
          <q-expansion-item expand-separator :header-inset-level="1" icon="receipt" label="Receipts">
            <q-expansion-item label="Today" :header-inset-level="2" :content-inset-level="2">
              <q-card>
                <q-card-section>
                  {{ lorem }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item label="Yesterday" :header-inset-level="2" :content-inset-level="2">
              <q-card>
                <q-card-section>
                  {{ lorem }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-expansion-item>

          <q-expansion-item expand-separator :header-inset-level="1" :content-inset-level="2" icon="schedule" label="Postponed">
            <q-card>
              <q-card-section>
                {{ lorem }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-expansion-item>

        <q-expansion-item expand-separator label="Inbox" caption="5 unread emails" :content-inset-level="0.5" default-opened>
          <q-expansion-item expand-separator label="Receipts">
            <q-expansion-item label="Today" :header-inset-level="0.5" :content-inset-level="0.5">
              <q-card>
                <q-card-section>
                  {{ lorem }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item label="Yesterday" :header-inset-level="0.5" :content-inset-level="0.5">
              <q-card>
                <q-card-section>
                  {{ lorem }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-expansion-item>

          <q-expansion-item expand-separator :content-inset-level="0.5" label="Postponed">
            <q-card>
              <q-card-section>
                {{ lorem }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="send" label="Outbox" caption="Empty">
          <q-expansion-item label="Today" :header-inset-level="1" :content-inset-level="1">
            <q-card>
              <q-card-section>
                {{ lorem }}
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item label="Yesterday" :header-inset-level="1" :content-inset-level="1">
            <q-card>
              <q-card-section>
                {{ lorem }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-expansion-item>

        <q-expansion-item expand-separator :content-inset-level="1" icon="drafts" label="Draft" caption="Draft a new email">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <h6 class="q-mb-md">
        Group a.k.a Accordion (opening one closes the other)
      </h6>
      <div class="q-mb-sm">
        <q-toggle v-model="somegroup" true-value="somegroup" false-value="othergroup" label="Last two have same group" />
      </div>

      <q-list bordered>
        <q-expansion-item group="somegroup" icon="explore" label="First" default-opened>
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item group="somegroup" icon="perm_identity" label="Second" header-class="text-red">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item :group="somegroup" icon="shopping_cart" label="Third" header-class="text-primary">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item :group="somegroup" icon="bluetooth" label="Fourth">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <h6>
        Preselected/Opened Collapsible (or use a model)
      </h6>
      <q-list bordered separator>
        <q-expansion-item icon="explore" label="First">
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item icon="perm_identity" label="Second" default-opened>
          <q-card>
            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <h6>
        Ubiquity. Using Cards as content.
      </h6>
      <q-list bordered class="q-pa-none">
        <q-expansion-item icon="explore" label="First Card">
          <q-card class="bg-grey-3">
            <q-card-section>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta vero vitae consequatur, id commodi magnam deleniti voluptas, alias, numquam labore maiores sit a dolores aliquid molestias veritatis nulla. Deleniti, debitis?
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item icon="explore" label="Second Card">
          <q-card class="bg-grey-3">
            <q-card-section>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta vero vitae consequatur, id commodi magnam deleniti voluptas, alias, numquam labore maiores sit a dolores aliquid molestias veritatis nulla. Deleniti, debitis?
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item icon="explore" label="Third Card">
          <q-card class="bg-grey-3">
            <q-card-section>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta vero vitae consequatur, id commodi magnam deleniti voluptas, alias, numquam labore maiores sit a dolores aliquid molestias veritatis nulla. Deleniti, debitis?
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item icon="shopping_cart" label="Fourth Card">
          <q-card class="q-ma-md" flat>
            <img src="~assets/map.png">

            <q-list>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="local_bar" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Bar XYZ</q-item-label>
                  <q-item-label caption>
                    Have a drink.
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="red" name="local_gas_station" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Gas Station</q-item-label>
                  <q-item-label caption>
                    Fill your gas tank.
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="amber" name="local_movies" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Cinema XYZ</q-item-label>
                  <q-item-label caption>
                    Watch a movie.
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-card-actions class="items-center">
              <div class="text-body2 text-primary">
                13 minutes
              </div>
              <div class="text-body2 q-pl-sm">
                (1 mile)
              </div>
              <q-space />
              <q-btn flat color="primary" icon="directions" label="Start" />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-list>

      <h6>
        Events test
      </h6>
      <q-expansion-item @click="onClick(1)" @keyup="onKeyup(1)" expand-separator icon="shopping_cart" label="1. Toggle by right-side icon only">
        <q-card>
          <q-card-section>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod soluta neque, earum porro nostrum odio iure numquam temporibus beatae non reiciendis consequuntur. Minima reiciendis, modi possimus explicabo beatae necessitatibus voluptas.
            <q-btn label="Btn" />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item @click="onClick(2)" @keyup="onKeyup(2)" to="/" expand-separator icon="shopping_cart" label="2. Toggle by right-side icon only">
        <q-card>
          <q-card-section>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod soluta neque, earum porro nostrum odio iure numquam temporibus beatae non reiciendis consequuntur. Minima reiciendis, modi possimus explicabo beatae necessitatibus voluptas.
            <q-btn label="Btn" />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-item @click="onClick(3)" @keyup="onKeyup(3)" clickable>
        <q-item-section>
          3. Gigi
        </q-item-section>
      </q-item>

      <q-item to="/" @click="onClick(4)" @keyup="onKeyup(4)" clickable>
        <q-item-section>
          4. Gigi
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: true,
      counter: 0,
      somegroup: 'somegroup',
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, nemo minus dolore facere saepe molestias, fugiat officia aspernatur expedita pariatur, accusantium hic exercitationem perspiciatis voluptate possimus nobis temporibus ipsa officiis!'
    }
  },
  methods: {
    notify (message, close) {
      this.$q.notify({
        color: close ? 'accent' : 'secondary',
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
    },

    onClick (which) {
      console.log('onClick', which)
    },
    onKeyup (which) {
      console.log('onKeyup', which)
    }
  }
}
</script>

<style lang="sass">
.my-expand-link
  color: $secondary
  background: rgba($secondary, .1)
  .q-item__section--side .q-icon
    color: $secondary
</style>
