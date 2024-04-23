<template>
  <div>
    <div class="q-layout-padding">
      <div>
        <q-chip size="10px" v-model:selected="selected2">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>
      </div>
      <div>
        <q-chip size="50px" v-model:selected="selected2">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>
      </div>

      <div>
        <q-chip icon="bookmark" size="10px" v-model:selected="selected2">
          Add to calendar
        </q-chip>
      </div>
      <div>
        <q-chip icon="bookmark" size="50px" v-model:selected="selected2">
          Add to calendar
        </q-chip>
      </div>

      <div>
        <q-chip dense size="10px" v-model:selected="selected2">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>
      </div>
      <div>
        <q-chip dense size="50px" v-model:selected="selected2">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>
      </div>
      <div>
        <q-chip icon="bookmark" dense size="10px" v-model:selected="selected2">
          Add to calendar
        </q-chip>
      </div>
      <div>
        <q-chip icon="bookmark" dense size="50px" v-model:selected="selected2">
          Add to calendar
        </q-chip>
      </div>

      <q-slider v-model="size" :min="10" :max="50" label-always label />
      <p>Basic</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" icon="event">
          Add to calendar
        </q-chip>
        <q-chip v-bind="chipProps" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" icon="alarm" label="Set alarm" />
        <q-chip v-bind="chipProps" icon="feedback" label="With tooltip">
          <q-tooltip>
            With tooltip
          </q-tooltip>
        </q-chip>
        <q-chip v-bind="chipProps" icon="feedback">
          With tooltip2
          <q-tooltip>
            With tooltip and inline label
          </q-tooltip>
        </q-chip>
        <q-chip v-bind="chipProps" icon="directions">
          Get directions
        </q-chip>

        <q-chip v-bind="chipProps">
          Get directions
        </q-chip>
        <q-chip v-bind="chipProps" dense>
          Get directions
        </q-chip>
      </div>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip v-bind="chipProps" color="teal" text-color="white" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" color="orange" text-color="white" icon-right="star">
          Star
        </q-chip>
        <q-chip v-bind="chipProps" color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip v-bind="chipProps" color="deep-orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip v-bind="chipProps">
          <q-avatar icon="fas fa-address-book" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps">
          <q-avatar color="red" text-color="white">
            50
          </q-avatar>
          Emails
        </q-chip>
        <q-chip v-bind="chipProps">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Tooltip test</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" color="primary" text-color="white" icon="event" removable>
          With tooltip
          <q-tooltip>Tooltip</q-tooltip>
        </q-chip>
      </div>

      <p>Square</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" square color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip v-bind="chipProps" square color="teal" text-color="white" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" square color="orange" text-color="white" icon-right="star">
          Star
        </q-chip>
        <q-chip v-bind="chipProps" square color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip v-bind="chipProps" square color="deep-orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip v-bind="chipProps" square>
          <q-avatar icon="bookmark" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" square>
          <q-avatar color="red" text-color="white">
            50
          </q-avatar>
          Emails
        </q-chip>
        <q-chip v-bind="chipProps" square>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Dense</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" dense color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip v-bind="chipProps" dense color="teal" text-color="white" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" dense color="orange" text-color="white" icon-right="star">
          Star
        </q-chip>
        <q-chip v-bind="chipProps" dense color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip v-bind="chipProps" dense color="deep-orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip v-bind="chipProps" dense>
          <q-avatar icon="bookmark" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" dense>
          <q-avatar color="red" text-color="white">
            50
          </q-avatar>
          Emails
        </q-chip>
        <q-chip v-bind="chipProps" dense>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Dense Square</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" square dense color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip v-bind="chipProps" square dense color="teal" text-color="white" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" square dense color="orange" text-color="white" icon-right="star">
          Star
        </q-chip>
        <q-chip v-bind="chipProps" square dense color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip v-bind="chipProps" square dense color="deep-orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip v-bind="chipProps" square dense>
          <q-avatar icon="fas fa-address-book" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" square dense>
          <q-avatar color="red" text-color="white">
            50
          </q-avatar>
          Emails
        </q-chip>
        <q-chip v-bind="chipProps" square dense>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Clickable</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" clickable color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip v-bind="chipProps" clickable icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" clickable color="teal" text-color="white" icon="fas fa-address-book">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" clickable color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip v-bind="chipProps" clickable color="orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
      </div>

      <p>Selected</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" v-model:selected="selected1" icon="bookmark" removable>
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" v-model:selected="selected1" removable>
          EmptyTest
        </q-chip>

        <q-chip v-bind="chipProps" v-model:selected="selected2">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" v-model:selected="selected3">
          <q-avatar color="primary" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" v-model:selected="selected4" color="orange">
          <q-avatar color="teal" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" v-model:selected="selected5" removable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>

        <q-chip v-bind="chipProps" dense v-model:selected="selected5" removable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Removable</p>
      <div class="q-ma-md">
        <q-btn label="Reset" flat size="sm" @click="resetRemovable" />

        <q-chip v-bind="chipProps" v-model="close1" icon="bookmark" removable>
          Bookmark
        </q-chip>

        <q-chip v-bind="chipProps" v-model="close2" removable>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" v-model="close3" removable>
          <q-avatar color="primary" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" v-model="close4" removable color="orange">
          <q-avatar color="teal" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" v-model="close5" disable removable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Disable</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" disable v-model:selected="selected1" clickable icon="bookmark" removable>
          Bookmark
        </q-chip>

        <q-chip v-bind="chipProps" disable v-model:selected="selected2" clickable>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" disable v-model:selected="selected3" clickable>
          <q-avatar color="primary" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" disable v-model:selected="selected4" clickable color="orange">
          <q-avatar color="teal" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-bind="chipProps" disable v-model:selected="selected5" clickable removable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Outline</p>
      <div class="q-ma-md">
        <q-chip v-bind="chipProps" outline icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" outline color="primary" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip v-bind="chipProps" outline color="teal" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip v-bind="chipProps" outline color="red" icon="alarm" label="Set alarm" removable />
        <q-chip v-bind="chipProps" outline color="orange" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip v-bind="chipProps" outline color="teal" icon-right="bookmark">
          Bookmark
        </q-chip>

        <q-chip v-bind="chipProps" outline>
          Get directions
        </q-chip>
        <q-chip v-bind="chipProps" dense outline>
          Get directions
        </q-chip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected1: false,
      selected2: false,
      selected3: false,
      selected4: false,
      selected5: false,

      close1: true,
      close2: true,
      close3: true,
      close4: true,
      close5: true,

      size: void 0
    }
  },
  computed: {
    chipProps () {
      return {
        size: this.size ? this.size + 'px' : void 0
      }
    }
  },
  methods: {
    resetRemovable () {
      for (let i = 1; i <= 5; i++) {
        this[ 'close' + i ] = true
      }
    },
    clickable () {
      console.log('@click')
    }
  }
}
</script>
