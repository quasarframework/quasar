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
    <div class="card-title row items-center">
      <span class="auto">Card Title</span>
      <div class="group">
        <button class="primary clear small" v-card-minimize><i>vertical_align_bottom</i></button>
        <button class="primary clear small" v-card-close><i>close</i></button>
      </div>
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
    <div class="list bordered inner-delimiter">
      <div class="item" v-for="n in 4">
        <i>mail</i>
        <div class="item-content">
          <div class="item-label">Quasar Framework</div>
          <button class="item-value"><i>keyboard_arrow_right</i></button>
        </div>
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
    <parallax src="../assets/parallax2.jpg" :height="150">
      <div slot="loading">Loading...</div>
    </parallax>
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
    <div class="item">
      <img class="avatar" src="../assets/avatar.png">
      <div class="item-content">
        <div class="item-label">
          <p class="item-title">Gina</p>
          <p>3 hours ago</p>
        </div>
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
      <div class="item">
        <i>local_bar</i>
        <div class="item-content">
          <div class="item-label">
            <p class="item-title">Bar XYZ</p>
            <p>Have a drink.</p>
          </div>
        </div>
      </div>
      <div class="item">
        <i>local_gas_station</i>
        <div class="item-content">
          <div class="item-label">
            <p class="item-title">Gas Station</p>
            <p>Fill your gas tank.</p>
          </div>
        </div>
      </div>
      <div class="item">
        <i>local_movies</i>
        <div class="item-content">
          <div class="item-label">
            <p class="item-title">Cinema XYZ</p>
            <p>Watch a movie.</p>
          </div>
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

  <div class="card">
    <div class="card-title bg-purple text-white">
      Card with Collapsible
    </div>
    <ul v-collapsible>
      <li>
        <div><i>filter_drama</i>First</div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </li>
      <li>
        <div><i>place</i>Second</div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </li>
      <li>
        <div><i>whatshot</i>Third</div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Notify } from 'quasar'

export default {
  methods: {
    dismissMe () {
      Notify.create('Card dismissed.')
    }
  }
}
</script>
