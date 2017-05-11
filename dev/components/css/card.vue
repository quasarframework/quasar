<template>
  <div>
    <div class="layout-padding">
      <div class="card">
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          Card with Title
        </div>
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>

      <div class="card">
        <div class="card-title bg-primary text-white">
          Colored Card Title
        </div>
        <div class="card-content card-force-top-padding">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>

      <div class="card bg-teal text-white">
        <div class="card-title">
          Background Colored Card
        </div>
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>

      <div class="card" style="max-width: 600px;">
        <div class="card-media">
          <img src="~assets/map.png">
          <q-btn color="primary" round icon="place" />
        </div>
        <div class="card-content list no-border highlight">
          <div class="item two-lines">
            <div class="item-primary">
              <q-icon name="local bar" />
            </div>
            <div class="item-content">
              <div class="item-title">Bar XYZ</div>
              <div>Have a drink.</div>
            </div>
          </div>
          <div class="item two-lines">
            <div class="item-primary">
              <q-icon name="local gas station" />
            </div>
            <div class="item-content">
              <div class="item-title">Gas Station</div>
              <div>Fill your gas tank.</div>
            </div>
          </div>
          <div class="item two-lines">
            <div class="item-primary">
              <q-icon name="local movies" />
            </div>
            <div class="item-content">
              <div class="item-title">Cinema XYZ</div>
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
          <q-btn flat small color="primary" icon="directions"> Start</q-btn>
        </div>
      </div>

      <div class="card">
        <div class="item two-lines">
          <img class="item-primary" src="~assets/linux-avatar.png">
          <div class="item-content">
            <div>Joe</div>
            <div>Web Developer</div>
          </div>
        </div>
        <img src="~assets/mountains.jpg">
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
        <div class="card-actions">
          <div class="text-primary">
            <q-icon name="thumb_up" /> 11k likes
          </div>
          <div class="text-primary">
            <q-icon name="mode_comment" /> 8 comments
          </div>
          <div class="auto"></div>
          <div class="text-grey-6">
            23 minutes ago.
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 25px;">
        <div class="card-title">
          Card with Collapsible List
        </div>
        <div class="list item-delimiter">
          <q-collapsible icon="explore" label="Places">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </q-collapsible>

          <q-collapsible icon="perm_identity" label="People">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </q-collapsible>

          <q-collapsible icon="shopping_cart" label="Shopping">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </q-collapsible>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          Card with FAB
        </div>
        <div class="card-media">
          <div class="video">
            <iframe src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" frameborder="0" allowfullscreen></iframe>
          </div>
          <q-btn round color="primary" icon="share" />
        </div>
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>

      <div class="card">
        <img src="~assets/mountains.jpg">
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          Card with Parallax
        </div>
        <q-parallax :src="'statics/parallax2.jpg'" :height="150">
          <div slot="loading">Loading...</div>
        </q-parallax>
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          Card with List
        </div>
        <div class="list no-border">
          <div class="item link" v-for="n in 4">
            <div class="item-primary">
              <q-icon name="mail" />
            </div>
            <div class="item-content has-secondary">
              Quasar Framework
            </div>
            <div class="item-secondary">
              <q-icon name="keyboard_arrow_right" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          Card with List
        </div>
        <div class="list item-delimiter">
          <div class="item link" v-for="n in 4">
            <div class="item-primary">
              <q-icon name="mail" />
            </div>
            <div class="item-content has-secondary">
              Quasar Framework
            </div>
            <div class="item-secondary">
              <q-icon name="keyboard_arrow_right" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          Card with List
        </div>
        <div class="list item-inset-delimiter">
          <div class="item link" v-for="n in 4">
            <div class="item-primary">
              <q-icon name="mail" />
            </div>
            <div class="item-content has-secondary">
              Quasar Framework
            </div>
            <div class="item-secondary">
              <q-icon name="keyboard_arrow_right" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="video">
          <iframe src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>
    </div>
  </div>
</template>
