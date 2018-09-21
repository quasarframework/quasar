<template>
  <div :class="dark ? 'bg-black text-white' : ''">
    <div class="layout-padding" style="max-width: 500px">
      <q-item tag="label" :dark="dark">
        <q-item-section>
          <q-item-label>Dark background</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-toggle v-model="dark" color="primary" :dark="dark" />
        </q-item-section>
      </q-item>

      <q-list bordered class="q-my-md" :dark="dark">
        <q-item clickable class="text-primary">
          <q-item-section>Single line item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section>Single line item longer text</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="signal_wifi_off" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" rounded icon="bluetooth" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar square>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar rounded>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar rounded>
              <img src="statics/mountains.jpg">
            </q-avatar>
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section thumbnail>
            <img src="statics/mountains.jpg">
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>
      </q-list>

      <q-list dense bordered class="q-my-md" :dark="dark">
        <q-item-label header>Dense</q-item-label>

        <q-item clickable class="text-primary">
          <q-item-section>Single line item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section>Single line item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section>Single line item longer text</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-separator :dark="dark" />
        <q-item-label header>Dense</q-item-label>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" rounded icon="bluetooth" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar square>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar rounded>
              <img src="statics/mountains.jpg">
            </q-avatar>
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section thumbnail>
            <img src="statics/mountains.jpg">
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>
      </q-list>

      <q-list bordered class="q-my-md" :dark="dark">
        <q-item>
          <q-item-section>Single line item</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Single line item longer text</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>List item</q-item-section>
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>List item</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>List item</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" rounded icon="bluetooth" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>List item</q-item-section>
          <q-item-section avatar>
            <q-avatar>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>List item</q-item-section>
          <q-item-section avatar>
            <q-avatar square>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>List item</q-item-section>
          <q-item-section thumbnail>
            <img src="statics/mountains.jpg">
          </q-item-section>
        </q-item>
      </q-list>

      <q-list bordered class="q-my-md" :dark="dark">
        <q-item>
          <q-item-section>
            <q-item-label overline>OVERLINE</q-item-label>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" />
        <q-item-label header>Section</q-item-label>

        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" square icon="bluetooth" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar square>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item-thumbnail" />

        <q-item>
          <q-item-section thumbnail>
            <img src="statics/mountains.jpg">
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list bordered class="q-my-md" :dark="dark">
        <q-item>
          <q-item-section>
            <q-item-label overline>OVERLINE</q-item-label>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" />
        <q-item-label header>Section</q-item-label>

        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth" />
          </q-item-section>
          <q-item-section>List item</q-item-section>
          <q-item-section side>
            <q-item-label caption>meta</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
            <q-icon name="star" color="yellow" />
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" square icon="bluetooth" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>meta</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-chip color="primary" text-color="white" dense square>10k</q-chip>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar rounded>
              <img src="statics/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>meta</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" />

        <q-item>
          <q-item-section top thumbnail class="q-ml-none">
            <img class="generic-border-radius" src="statics/mountains.jpg">
          </q-item-section>

          <q-item-section>
            <q-item-label>Single line item</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>meta</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list bordered :dark="dark">
        <q-item-label header>User Controls</q-item-label>

        <q-item>
          <q-item-section>
            <q-item-label>Content filtering</q-item-label>
            <q-item-label caption>
              Set the content filtering level to restrict
              apps that can be downloaded
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>Password</q-item-label>
            <q-item-label caption>
              Require password for purchase or use
              password to restrict purchase
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator :dark="dark" />
        <q-item-label header>General</q-item-label>

        <q-item tag="label">
          <q-item-section side>
            <q-checkbox v-model="check1" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Notifications</q-item-label>
            <q-item-label caption>
              Notify me about updates to apps or games that I downloaded
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item tag="label">
          <q-item-section side>
            <q-checkbox v-model="check2" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Sound</q-item-label>
            <q-item-label caption>
              Auto-update apps at anytime. Data charges may apply
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item tag="label">
          <q-item-section side>
            <q-checkbox v-model="check3" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Auto-add widgets</q-item-label>
            <q-item-label caption>
              Automatically add home screen widgets
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false,

      check1: true,
      check2: false,
      check3: false
    }
  }
}
</script>
