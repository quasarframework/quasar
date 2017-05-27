<template>
  <div>
    <div class="layout-padding card-examples">
      <q-card class="bigger">
        <q-card-media>
          <img src="~assets/donuts.png">
        </q-card-media>
        <q-card-title>
          Cafe Basilico
          <q-rating slot="subtitle" v-model="stars" :max="5" />
          <div slot="right" class="row items-center">
            <q-icon name="place" /> 250 ft
          </div>
        </q-card-title>
        <q-card-main>
          <p>$・Italian, Cafe</p>
          <p class="text-faded">Small plates, salads & sandwiches in an intimate setting.</p>
        </q-card-main>
        <hr>
        <q-card-actions>
          <q-btn flat round small><q-icon name="event" /></q-btn>
          <q-btn flat>5:30PM</q-btn>
          <q-btn flat>7:30PM</q-btn>
          <q-btn flat>9:00PM</q-btn>
          <q-btn flat color="primary">Reserve</q-btn>
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
          <q-icon slot="right" name="more_vert">
            <q-popover ref="popover">
              <div class="list link no-border">
                <div class="item" @click="$refs.popover.close()">
                  <div class="item-content">Remove Card</div>
                </div>
                <div class="item" @click="$refs.popover.close()">
                  <div class="item-content">Send Feedback</div>
                </div>
                <div class="item" @click="$refs.popover.close()">
                  <div class="item-content">Share</div>
                </div>
              </div>
            </q-popover>
          </q-icon>
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
        <hr>
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <hr>
        <q-card-actions vertical>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
          </q-card-title>
        </q-card-media>
      </q-card>

      <q-card>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
            <span slot="subtitle">Subtitle</span>
          </q-card-title>
        </q-card-media>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-media overlay-position="top">
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
            <span slot="subtitle">Subtitle</span>
          </q-card-title>
        </q-card-media>
      </q-card>

      <q-card>
        <q-card-media overlay-position="top">
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            <div slot="subtitle" class="text-right">Subtitle</div>
          </q-card-title>
        </q-card-media>
      </q-card>

      <q-card>
        <q-card-media overlay-position="full">
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
            <span slot="subtitle">Subtitle</span>
          </q-card-title>
        </q-card-media>
      </q-card>

      <q-card>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
            <span slot="subtitle">Subtitle</span>
          </q-card-title>
        </q-card-media>
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-media>
          <q-parallax :src="'statics/parallax1.jpg'" :height="150">
            <div slot="loading">Loading...</div>
          </q-parallax>
        </q-card-media>
        <q-card-title>
          Parallax
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <hr>
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card>
        <div class="item">
          <div class="item-primary">
            <img src="~assets/boy-avatar.png">
          </div>
          <div class="item-content text">
            <div>Title</div>
            <div>Subhead</div>
          </div>
        </div>
        <q-card-media>
          <img src="~assets/parallax2.jpg">
        </q-card-media>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-media>
          <img src="~assets/parallax2.jpg">
        </q-card-media>
        <q-card-list>
          <div class="item">
            <div class="item-primary">
              <q-icon class="text-primary" name="local bar" />
            </div>
            <div class="item-content text">
              <div>Bar XYZ</div>
              <div>Have a drink.</div>
            </div>
          </div>
          <div class="item">
            <div class="item-primary">
              <q-icon class="text-red" name="local gas station" />
            </div>
            <div class="item-content text">
              <div>Gas Station</div>
              <div>Fill your gas tank.</div>
            </div>
          </div>
          <div class="item">
            <div class="item-primary">
              <q-icon class="text-amber" name="local movies" />
            </div>
            <div class="item-content text">
              <div>Cinema XYZ</div>
              <div>Watch a movie.</div>
            </div>
          </div>
        </q-card-list>
      </q-card>

      <q-card>
        <q-card-media>
          <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
        </q-card-media>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title>
          Title
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
        <hr class="inset">
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>
        <q-card-actions align="around">
          <q-btn flat round small color="red"><q-icon name="favorite" /></q-btn>
          <q-btn flat round small color="faded"><q-icon name="bookmark" /></q-btn>
          <q-btn flat round small color="primary"><q-icon name="share" /></q-btn>
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>
        <q-card-title>
          Title
          <q-rating slot="subtitle" v-model="stars" :max="5" />
          <span slot="right" class="row items-center">
            <q-icon name="place" /> 20 miles
          </span>
        </q-card-title>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      stars: 3,
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  }
}
</script>

<style lang="stylus">
.card-examples
  .q-card
    width 300px
  .bigger
    width 450px
  .card-double
    width 600px
</style>
