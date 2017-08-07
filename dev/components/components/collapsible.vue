<template>
  <div>
    <div class="layout-padding" style="max-width: 600px;">
      <q-list>
        <q-collapsible icon="explore" label="First">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="perm_identity" label="Second" @open="disable_third" @close="enable_third">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="shopping_cart" label="Third (disabled when Second is open)" :disable="third_disabled">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
      </q-list>

      <p class="caption">With Item Separators</p>
      <q-list inset-separator>
        <q-collapsible icon="mail" label="Inbox" sublabel="5 unread emails">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="send" label="Outbox" sublabel="Empty">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="drafts" label="Draft" sublabel="Draft a new email">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
      </q-list>

      <p class="caption">Toggle only on icon (on right)</p>
      <q-list separator>
        <q-collapsible icon-toggle icon="mail" label="Inbox" sublabel="5 unread emails">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon-toggle icon="send" label="Outbox" sublabel="Empty">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon-toggle icon="drafts" label="Draft" sublabel="Draft a new email">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
      </q-list>

      <p class="caption">Preselected/Opened Collapsible</p>
      <q-list separator>
        <q-collapsible icon="explore" label="First">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="perm_identity" label="Second" opened>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="shopping_cart" label="Third">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
      </q-list>

      <p class="caption">Group a.k.a Accordion (opening one closes the other)</p>
      <q-list>
        <q-collapsible group="somegroup" icon="explore" label="First" opened>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible group="somegroup" icon="perm_identity" label="Second">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible group="somegroup" icon="shopping_cart" label="Third">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
      </q-list>

      <p class="caption">use open and close emit</p>
      <q-list>
        <q-collapsible group="somegroup" icon="explore" label="Counter" @open="counter_start" @close="counter_stop">
          <div>Will only count when opened, using the open and close event to control count timer</div>
          <label>Counter: {{counter}}</label>
        </q-collapsible>
      </q-list>


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
              <img src="~assets/mountains.jpg">
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
              <div class="col"></div>
              <q-btn flat color="primary" small icon="directions">
                Start
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-collapsible>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      counter: 0,
      third_disabled: false
    }
  },
  methods: {
    counter_start () {
      console.log('counter start')

      this.hndl = setInterval(() => {
        this.counter++
      }, 1000)
    },
    counter_stop () {
      console.log('counter stop')

      clearInterval(this.hndl)
    },
    enable_third () {
      this.third_disabled = false
    },
    disable_third () {
      this.third_disabled = true
    }
  }
}
</script>
