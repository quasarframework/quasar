<template>
  <div class="card">
    <div class="card-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
  </div>

  <div class="card">
    <div class="card-title">
      Card Title
    </div>
    <div class="card-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
  </div>

  <div class="card">
    <div class="card-title bg-primary text-white">
      Card Title
    </div>
    <div class="card-content card-force-top-padding">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
  </div>

  <div class="card bg-tertiary text-white">
    <div class="card-title">
      Card Title
    </div>
    <div class="card-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
  </div>

  <div class="card bg-indigo text-white">
    <div class="card-title">
      Card Title
    </div>
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
    <div class="list highlight no-border">
      <div class="item item-link" v-for="n in 4">
        <i class="item-primary">mail</i>
        <div class="item-content has-secondary">
          Quasar Framework
        </div>
        <i class="item-secondary">keyboard_arrow_right</i>
      </div>
    </div>
  </div>

  <div class="card">
    <img src="../assets/mountains.jpg">
    <div class="card-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
  </div>

  <div class="card">
    <div class="card-title">
      Card with Parallax Image
    </div>
    <quasar-parallax :src="'statics/parallax2.jpg'" :height="150">
      <div slot="loading">Loading...</div>
    </quasar-parallax>
    <div class="card-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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

  <div class="card">
    <div class="item two-lines">
      <img class="item-primary" src="../assets/avatar.png">
      <div class="item-content">
        <div>Gina</div>
        <div>3 hours ago</div>
      </div>
    </div>
    <img src="../assets/mountains.jpg">
    <div class="card-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
    <div class="card-actions">
      <div class="text-primary">
        <i>thumb_up</i> 11k likes
      </div>
      <div class="text-primary">
        <i>mode_comment</i> 8 comments
      </div>
      <div class="auto"></div>
      <div class="text-grey-6">
        23 minutes ago.
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-media">
      <img src="../assets/map.png">
      <button class="primary circular"><i>place</i></button>
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
      <button class="primary clear small"><i class="on-left">directions</i> Start</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">
      Recommended
    </div>
    <div class="card-media">
      <div class="video">
        <iframe src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" frameborder="0" allowfullscreen></iframe>
      </div>
      <button class="red circular"><i>share</i></button>
    </div>
    <div class="card-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
  </div>

  <div class="card" style="margin-top: 25px;">
    <div class="card-title">
      Card with Collapsible List
    </div>
    <div class="list no-border">
      <hr>
      <quasar-collapsible icon="explore" label="First">
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </quasar-collapsible>
      <hr>
      <quasar-collapsible icon="perm_identity" label="Second">
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </quasar-collapsible>
      <hr>
      <quasar-collapsible icon="shopping_cart" label="Third">
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </quasar-collapsible>
    </ul>
  </div>
</template>

<script>
import { Toast } from 'quasar'

export default {
  methods: {
    dismissMe () {
      Toast.create('Card dismissed.')
    }
  }
}
</script>
