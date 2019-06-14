<template>
  <div class="bg-white">
    <div class="q-layout-padding">
      <p>Basic</p>
      <div class="q-ma-md">
        <q-chip icon="event" size="10px">
          Add to calendar
        </q-chip>
        <q-chip icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip icon="alarm" label="Set alarm" />
        <q-chip icon="directions">
          Get directions
        </q-chip>

        <q-chip>Get directions</q-chip>
        <q-chip dense>
          Get directions
        </q-chip>
      </div>
      <div class="q-ma-md">
        <q-chip color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip color="teal" text-color="white" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip color="orange" text-color="white" icon-right="star">
          Star
        </q-chip>
        <q-chip color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip color="deep-orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip>
          <q-avatar icon="fas fa-address-book" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip>
          <q-avatar color="red" text-color="white">
            50
          </q-avatar>
          Emails
        </q-chip>
        <q-chip>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Tooltip test</p>
      <div class="q-ma-md">
        <q-chip color="primary" text-color="white" icon="event" removable>
          With tooltip
          <q-tooltip>Tooltip</q-tooltip>
        </q-chip>
      </div>

      <p>Square</p>
      <div class="q-ma-md">
        <q-chip square color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip square color="teal" text-color="white" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip square color="orange" text-color="white" icon-right="star">
          Star
        </q-chip>
        <q-chip square color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip square color="deep-orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip square>
          <q-avatar icon="bookmark" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip square>
          <q-avatar color="red" text-color="white">
            50
          </q-avatar>
          Emails
        </q-chip>
        <q-chip square>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Dense</p>
      <div class="q-ma-md">
        <q-chip dense color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip dense color="teal" text-color="white" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip dense color="orange" text-color="white" icon-right="star">
          Star
        </q-chip>
        <q-chip dense color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip dense color="deep-orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip dense>
          <q-avatar icon="bookmark" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip dense>
          <q-avatar color="red" text-color="white">
            50
          </q-avatar>
          Emails
        </q-chip>
        <q-chip dense>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Dense Square</p>
      <div class="q-ma-md">
        <q-chip square dense color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip square dense color="teal" text-color="white" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip square dense color="orange" text-color="white" icon-right="star">
          Star
        </q-chip>
        <q-chip square dense color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip square dense color="deep-orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip square dense>
          <q-avatar icon="fas fa-address-book" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip square dense>
          <q-avatar color="red" text-color="white">
            50
          </q-avatar>
          Emails
        </q-chip>
        <q-chip square dense>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Clickable</p>
      <div class="q-ma-md">
        <q-chip clickable color="primary" text-color="white" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip clickable icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip clickable color="teal" text-color="white" icon="fas fa-address-book">
          Bookmark
        </q-chip>
        <q-chip clickable color="red" text-color="white" icon="alarm" label="Set alarm" removable />
        <q-chip clickable color="orange" text-color="white" icon="directions" removable>
          Get directions
        </q-chip>
      </div>

      <p>Selected</p>
      <div class="q-ma-md">
        <q-chip :selected.sync="selected1" icon="bookmark" removable>
          Bookmark
        </q-chip>
        <q-chip :selected.sync="selected1" removable>
          EmptyTest
        </q-chip>

        <q-chip :selected.sync="selected2">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip :selected.sync="selected3">
          <q-avatar color="primary" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip :selected.sync="selected4" color="orange">
          <q-avatar color="teal" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip :selected.sync="selected5" removable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>

        <q-chip dense :selected.sync="selected5" removable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Removable</p>
      <div class="q-ma-md">
        <q-btn label="Reset" flat size="sm" @click="resetRemovable" />

        <q-chip v-model="close1" icon="bookmark" removable>
          Bookmark
        </q-chip>

        <q-chip v-model="close2" removable>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-model="close3" removable>
          <q-avatar color="primary" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-model="close4" removable color="orange">
          <q-avatar color="teal" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-model="close5" disable removable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Disable</p>
      <div class="q-ma-md">
        <q-chip disable :selected.sync="selected1" clickable icon="bookmark" removable>
          Bookmark
        </q-chip>

        <q-chip disable :selected.sync="selected2" clickable>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip disable :selected.sync="selected3" clickable>
          <q-avatar color="primary" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip disable :selected.sync="selected4" clickable color="orange">
          <q-avatar color="teal" text-color="white">
            J
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip disable :selected.sync="selected5" clickable removable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Outline</p>
      <div class="q-ma-md">
        <q-chip outline icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip outline color="primary" icon="event" removable>
          Add to calendar
        </q-chip>
        <q-chip outline color="teal" icon="bookmark">
          Bookmark
        </q-chip>
        <q-chip outline color="red" icon="alarm" label="Set alarm" removable />
        <q-chip outline color="orange" icon="directions" removable>
          Get directions
        </q-chip>
        <q-chip outline color="teal" icon-right="bookmark">
          Bookmark
        </q-chip>

        <q-chip outline>
          Get directions
        </q-chip>
        <q-chip dense outline>
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
      close5: true
    }
  },
  methods: {
    resetRemovable () {
      for (let i = 1; i <= 5; i++) {
        this['close' + i] = true
      }
    },
    clickable () {
      console.log('@click')
    }
  }
}
</script>
