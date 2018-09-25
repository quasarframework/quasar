<template>
  <div>
    <div class="layout-padding card-examples row items-start">
      <q-card inline class="bigger">
        <q-card-media>
          <img src="~assets/donuts.png">
        </q-card-media>

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">Cafe Basilico</div>
            <div class="col-auto text-grey q-pt-md">
              <q-icon name="place" /> 250 ft
            </div>
          </div>

          <q-rating v-model="stars" :max="5" size="32px" />
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1">$・Italian, Cafe</div>
          <div class="text-subtitle2 text-grey">Small plates, salads & sandwiches in an intimate setting.</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat>5:30PM</q-btn>
          <q-btn flat>7:30PM</q-btn>
          <q-btn flat>9:00PM</q-btn>
          <q-btn flat color="primary">Reserve</q-btn>
        </q-card-actions>
      </q-card>

      <q-card flat bordered inline class="bigger">
        <q-card-media>
          <img src="~assets/donuts.png">
        </q-card-media>

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">Cafe Basilico</div>
            <div class="col-auto text-grey q-pt-md">
              <q-icon name="place" /> 250 ft
            </div>
          </div>

          <q-rating v-model="stars" :max="5" size="32px" />
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1">$・Italian, Cafe</div>
          <div class="text-subtitle2 text-grey">Small plates, salads & sandwiches in an intimate setting.</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat>5:30PM</q-btn>
          <q-btn flat>7:30PM</q-btn>
          <q-btn flat>9:00PM</q-btn>
          <q-btn flat color="primary">Reserve</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card inline>
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card flat inline>
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card inline dark bordered class="bg-grey-9">
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card inline class="bg-secondary text-white">
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
        </q-card-section>

        <q-separator dark />

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">by Kurt Wagner</div>
            </div>

            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-popover cover>
                  <q-list>
                    <q-item clickable v-close-overlay>
                      <q-item-section>Remove Card</q-item-section>
                    </q-item>
                    <q-item clickable v-close-overlay>
                      <q-item-section>Send Feedback</q-item-section>
                    </q-item>
                    <q-item clickable v-close-overlay>
                      <q-item-section>Share</q-item-section>
                    </q-item>
                  </q-list>
                </q-popover>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-separator />

        <q-card-actions vertical>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>

        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-section>
            <div class="text-subtitle2 text-center">
              Title
            </div>
          </q-card-section>
        </q-card-media>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-section>
            <div class="text-subtitle2">
              Title
            </div>
          </q-card-section>
        </q-card-media>

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card inline>
        <q-card-media overlay-position="top">
          <img src="~assets/parallax2.jpg">

          <q-card-section>
            <div class="text-subtitle2 text-center">
              Title
            </div>
          </q-card-section>
        </q-card-media>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-section>
            <div class="text-h5">
              Title
            </div>
          </q-card-section>
        </q-card-media>
      </q-card>

      <q-card inline>
        <q-card-media overlay-position="full">
          <img src="~assets/parallax2.jpg">

          <q-card-section>
            <div class="text-subtitle2">
              Title
            </div>
          </q-card-section>
        </q-card-media>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-section>
            <div class="text-h6">Our Changing Planet</div>
            <div class="text-subtitle2">by Kurt Wagner</div>
          </q-card-section>
        </q-card-media>

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <q-parallax src="statics/parallax1.jpg" :height="150" />
        </q-card-media>

        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <q-parallax src="statics/parallax2.jpg" :height="250" />

          <q-card-section>
            <div class="text-h6">Our Changing Planet</div>
            <div class="text-subtitle2">by Kurt Wagner</div>
          </q-card-section>
        </q-card-media>

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="/statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Title</q-item-label>
            <q-item-label caption>Subhead</q-item-label>
          </q-item-section>
        </q-item>

        <q-card-media>
          <img src="~assets/parallax2.jpg">
        </q-card-media>

        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">
        </q-card-media>

        <q-list>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Bar XYZ</q-item-label>
              <q-item-label caption>Have a drink.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-icon color="red" name="local_gas_station" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Gas Station</q-item-label>
              <q-item-label caption>Fill your gas tank.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-icon color="amber" name="local_movies" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Cinema XYZ</q-item-label>
              <q-item-label caption>Watch a movie.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card inline>
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-list>
          <q-expansion-item expand-separator icon="explore" label="First">
            <div class="q-pa-md">
              Lorem ipsum dolor sit amet...
            </div>
          </q-expansion-item>

          <q-expansion-item expand-separator icon="perm_identity" label="Second">
            <div class="q-pa-md">
              Lorem ipsum dolor sit amet...
            </div>
          </q-expansion-item>

          <q-expansion-item expand-separator icon="shopping_cart" label="Third">
            <div class="q-pa-md">
              Lorem ipsum dolor sit amet...
            </div>
          </q-expansion-item>
        </q-list>
      </q-card>

      <q-card inline>
        <q-card-media>
          <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
        </q-card-media>

        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card inline>
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>

        <q-card-actions align="around">
          <q-btn flat round color="red" icon="favorite" />
          <q-btn flat round color="teal" icon="bookmark" />
          <q-btn flat round color="primary" icon="share" />
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>

        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <q-rating size="24px" color="primary" v-model="stars" :max="5" />
        </q-card-section>
      </q-card>

      <q-card inline>
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by Kurt Wagner</div>
        </q-card-section>

        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Dessert (100g serving)</th>
              <th class="text-right">Calories</th>
              <th class="text-right">Fat (g)</th>
              <th class="text-right">Carbs (g)</th>
              <th class="text-right">Protein (g)</th>
              <th class="text-right">Sodium (mg)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">Frozen Yogurt</td>
              <td class="text-right">159</td>
              <td class="text-right">6</td>
              <td class="text-right">24</td>
              <td class="text-right">4</td>
              <td class="text-right">87</td>
            </tr>
            <tr>
              <td class="text-left">Ice cream sandwich</td>
              <td class="text-right">237</td>
              <td class="text-right">9</td>
              <td class="text-right">37</td>
              <td class="text-right">4.3</td>
              <td class="text-right">129</td>
            </tr>
            <tr>
              <td class="text-left">Eclair</td>
              <td class="text-right">262</td>
              <td class="text-right">16</td>
              <td class="text-right">23</td>
              <td class="text-right">6</td>
              <td class="text-right">337</td>
            </tr>
            <tr>
              <td class="text-left">Cupcake</td>
              <td class="text-right">305</td>
              <td class="text-right">3.7</td>
              <td class="text-right">67</td>
              <td class="text-right">4.3</td>
              <td class="text-right">413</td>
            </tr>
            <tr>
              <td class="text-left">Gingerbread</td>
              <td class="text-right">356</td>
              <td class="text-right">16</td>
              <td class="text-right">49</td>
              <td class="text-right">3.9</td>
              <td class="text-right">327</td>
            </tr>
          </tbody>
        </q-markup-table>

        <q-separator />

        <q-card-section>
          Lolo
        </q-card-section>
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
    margin 0 12px 12px 0
  .bigger
    width 450px
  @media (max-width $breakpoint-xs-max)
    .q-card
      width 100%
</style>
