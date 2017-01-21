<template>
  <div>
    <div class="layout-padding" style="max-width: 600px;">
      <q-accordion class="list">
        <q-accordion-item icon="explore" label="First">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
        <q-accordion-item icon="perm_identity" label="Second">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
        <q-accordion-item icon="shopping_cart" label="Third">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
      </q-accordion>

      <p class="caption">With Item Delimiters</p>
      <q-accordion class="list item-delimiter">
        <q-accordion-item icon="explore" label="First">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
        <q-accordion-item icon="perm_identity" label="Second">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
        <q-accordion-item icon="shopping_cart" label="Third">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
      </q-accordion>

      <p class="caption">Preselected/Opened Accordion</p>
      <q-accordion class="list item-delimiter">
        <q-accordion-item icon="explore" label="First">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
        <q-accordion-item icon="perm_identity" label="Second" opened>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
        <q-accordion-item icon="shopping_cart" label="Third" opened>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
        </q-accordion-item>
      </q-accordion>

      <p class="caption">Ubiquity. Using Cards as content.</p>
      <q-accordion class="list item-delimiter">
        <q-accordion-item icon="explore" label="First Card">
          <div class="card bg-primary text-white">
            <div class="card-title">
              Card Title
            </div>
            <div class="card-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        </q-accordion-item>
        <q-accordion-item icon="perm_identity" label="Second Card">
          <div class="card">
            <img src="~assets/mountains.jpg">
            <div class="card-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        </q-accordion-item>
        <q-accordion-item icon="shopping_cart" label="Third Card">
          <div class="card">
            <div class="card-media">
              <img src="~assets/map.png">
              <button class="primary circular"><i>explore</i></button>
            </div>
            <div class="card-content">
              <div class="item two-lines">
                <i class="item-primary">local_bar</i>
                <div class="item-content">
                  <div>Bar XYZ</div>
                  <div>Have a drink.</div>
                </div>
              </div>
              <div class="item two-lines">
                <i class="item-primary">local_gas_station</i>
                <div class="item-content">
                  <div>Gas Station</div>
                  <div>Fill your gas tank.</div>
                </div>
              </div>
              <div class="item two-lines">
                <i class="item-primary">local_movies</i>
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
              <button class="primary clear small">
                <i class="on-left">directions</i>
                Start
              </button>
            </div>
          </div>
        </q-accordion-item>
      </q-accordion>
    </div>
  </div>
</template>
