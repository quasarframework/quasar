<template>
  <div>
    <div class="layout-padding" style="max-width: 600px;">
      <div class="list">
        <q-item icon="mail">Label</q-item>
        <q-collapsible icon="explore" label="First">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="perm_identity" label="Second">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="shopping_cart" label="Third">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
      </div>

      <p class="caption">With Item Delimiters</p>
      <div class="list item-delimiter">
        <q-collapsible icon="explore" label="First">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="perm_identity" label="Second">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
        <q-collapsible icon="shopping_cart" label="Third">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-collapsible>
      </div>

      <p class="caption">Preselected/Opened Collapsible</p>
      <div class="list item-delimiter">
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
      </div>

      <p class="caption">Group a.k.a Accordion (opening one closes the other)</p>
      <div class="list">
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
      </div>

      <p class="caption">use open and close emit</p>
      <div class="list">
        <q-collapsible group="somegroup" icon="explore" label="counter" @open="counter_start" @close="counter_stop">
          <div>Will only count when opened, using the open and close event to control count timer</div>
          <label>Counter : {{counter}}</label>
        </q-collapsible>
      </div>


      <p class="caption">Ubiquity. Using Cards as content.</p>
      <div class="list item-delimiter">
        <q-collapsible icon="explore" label="First Card">
          <div class="card bg-primary text-white">
            <div class="card-title">
              Card Title
            </div>
            <div class="card-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        </q-collapsible>
        <q-collapsible icon="perm_identity" label="Second Card">
          <div class="card">
            <img src="~assets/mountains.jpg">
            <div class="card-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        </q-collapsible>
        <q-collapsible icon="shopping_cart" label="Third Card">
          <div class="card">
            <div class="card-media">
              <img src="~assets/map.png">
              <q-btn color="primary" round><q-icon name="explore" /></q-btn>
            </div>
            <div class="card-content">
              <div class="item">
                <div class="item-primary">
                  <q-icon name="local_bar" />
                </div>
                <div class="item-content">
                  <div>Bar XYZ</div>
                  <div>Have a drink.</div>
                </div>
              </div>
              <div class="item two-lines">
                <div class="item-primary">
                  <q-icon name="local_gas_station" />
                </div>
                <div class="item-content">
                  <div>Gas Station</div>
                  <div>Fill your gas tank.</div>
                </div>
              </div>
              <div class="item two-lines">
                <div class="item-primary">
                  <q-icon name="local_movies" />
                </div>
                <div class="item-content">
                  <div>Cinema XYZ</div>
                  <div>Watch a movie.</div>
                </div>
              </div>
            </div>
            <div class="card-actions card-no-top-padding">
              <div class="text-lime">
                13 minutes
              </div>
              <div>
                (1 mile)
              </div>
              <div class="auto"></div>
              <q-btn flat color="primary" small icon="directions">
                Start
              </q-btn>
            </div>
          </div>
        </q-collapsible>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    hndl: 0,

    data () {
      return {
        counter: 0
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
      }
    }
  }
</script>
