<template>
  <div class="bg-white">
    <div class="q-layout-padding">
      <p>Basic</p>
      <div class="q-ma-md">
        <q-chip icon="event" size="10px">Add to calendar</q-chip>
        <q-chip icon="bookmark">Bookmark</q-chip>
        <q-chip icon="alarm" label="Set alarm" />
        <q-chip icon="directions">Get directions</q-chip>
      </div>
      <div class="q-ma-md">
        <q-chip color="primary" text-color="white" icon="event" closable>Add to calendar</q-chip>
        <q-chip color="teal" text-color="white" icon="bookmark">Bookmark</q-chip>
        <q-chip color="orange" text-color="white" icon-right="star">Star</q-chip>
        <q-chip color="red" text-color="white" icon="alarm" label="Set alarm" closable />
        <q-chip color="deep-orange" text-color="white" icon="directions" closable>Get directions</q-chip>
        <q-chip>
          <q-avatar icon="bookmark" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip>
          <q-avatar color="red" text-color="white">50</q-avatar>
          Emails
        </q-chip>
        <q-chip>
          <q-avatar>
            <img src="statics/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Square</p>
      <div class="q-ma-md">
        <q-chip square color="primary" text-color="white" icon="event" closable>Add to calendar</q-chip>
        <q-chip square color="teal" text-color="white" icon="bookmark">Bookmark</q-chip>
        <q-chip square color="orange" text-color="white" icon-right="star">Star</q-chip>
        <q-chip square color="red" text-color="white" icon="alarm" label="Set alarm" closable />
        <q-chip square color="deep-orange" text-color="white" icon="directions" closable>Get directions</q-chip>
        <q-chip square>
          <q-avatar icon="bookmark" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip square>
          <q-avatar color="red" text-color="white">50</q-avatar>
          Emails
        </q-chip>
        <q-chip square>
          <q-avatar>
            <img src="statics/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Dense</p>
      <div class="q-ma-md">
        <q-chip dense color="primary" text-color="white" icon="event" closable>Add to calendar</q-chip>
        <q-chip dense color="teal" text-color="white" icon="bookmark">Bookmark</q-chip>
        <q-chip dense color="orange" text-color="white" icon-right="star">Star</q-chip>
        <q-chip dense color="red" text-color="white" icon="alarm" label="Set alarm" closable />
        <q-chip dense color="deep-orange" text-color="white" icon="directions" closable>Get directions</q-chip>
        <q-chip dense>
          <q-avatar icon="bookmark" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip dense>
          <q-avatar color="red" text-color="white">50</q-avatar>
          Emails
        </q-chip>
        <q-chip dense>
          <q-avatar>
            <img src="statics/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Dense Square</p>
      <div class="q-ma-md">
        <q-chip square dense color="primary" text-color="white" icon="event" closable>Add to calendar</q-chip>
        <q-chip square dense color="teal" text-color="white" icon="bookmark">Bookmark</q-chip>
        <q-chip square dense color="orange" text-color="white" icon-right="star">Star</q-chip>
        <q-chip square dense color="red" text-color="white" icon="alarm" label="Set alarm" closable />
        <q-chip square dense color="deep-orange" text-color="white" icon="directions" closable>Get directions</q-chip>
        <q-chip square dense>
          <q-avatar icon="bookmark" color="red" text-color="white" />
          Bookmark
        </q-chip>
        <q-chip square dense>
          <q-avatar color="red" text-color="white">50</q-avatar>
          Emails
        </q-chip>
        <q-chip square dense>
          <q-avatar>
            <img src="statics/boy-avatar.png">
          </q-avatar>
          Emails
        </q-chip>
      </div>

      <p>Clickable</p>
      <div class="q-ma-md">
        <q-chip clickable color="primary" text-color="white" icon="event" closable>Add to calendar</q-chip>
        <q-chip clickable icon="bookmark">Bookmark</q-chip>
        <q-chip clickable color="teal" text-color="white" icon="bookmark">Bookmark</q-chip>
        <q-chip clickable color="red" text-color="white" icon="alarm" label="Set alarm" closable />
        <q-chip clickable color="orange" text-color="white" icon="directions" closable>Get directions</q-chip>
      </div>

      <p>Selected</p>
      <div class="q-ma-md">
        <q-chip :selected.sync="selected1" clickable icon="bookmark" closable>Bookmark</q-chip>

        <q-chip :selected.sync="selected2" clickable>
          <q-avatar>
            <img src="statics/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip :selected.sync="selected3" clickable>
          <q-avatar color="primary" text-color="white">J</q-avatar>
          Add to calendar
        </q-chip>

        <q-chip :selected.sync="selected4" clickable color="orange">
          <q-avatar color="teal" text-color="white">J</q-avatar>
          Add to calendar
        </q-chip>

        <q-chip :selected.sync="selected5" clickable closable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>

        <q-chip dense :selected.sync="selected5" clickable closable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Closable</p>
      <div class="q-ma-md">
        <q-btn label="Reset" flat size="sm" @click="resetClosable" />

        <q-chip v-model="close1" icon="bookmark" closable>Bookmark</q-chip>

        <q-chip v-model="close2" closable>
          <q-avatar>
            <img src="statics/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-model="close3" closable>
          <q-avatar color="primary" text-color="white">J</q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-model="close4" closable color="orange">
          <q-avatar color="teal" text-color="white">J</q-avatar>
          Add to calendar
        </q-chip>

        <q-chip v-model="close5" disable closable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Disable</p>
      <div class="q-ma-md">
        <q-chip disable :selected.sync="selected1" clickable icon="bookmark" closable>Bookmark</q-chip>

        <q-chip disable :selected.sync="selected2" clickable>
          <q-avatar>
            <img src="statics/boy-avatar.png">
          </q-avatar>
          Add to calendar
        </q-chip>

        <q-chip disable :selected.sync="selected3" clickable>
          <q-avatar color="primary" text-color="white">J</q-avatar>
          Add to calendar
        </q-chip>

        <q-chip disable :selected.sync="selected4" clickable color="orange">
          <q-avatar color="teal" text-color="white">J</q-avatar>
          Add to calendar
        </q-chip>

        <q-chip disable :selected.sync="selected5" clickable closable>
          <q-avatar color="red" text-color="white" icon="directions" />
          Bookmark
        </q-chip>
      </div>

      <p>Outline</p>
      <div class="q-ma-md">
        <q-chip outline icon="bookmark">Bookmark</q-chip>
        <q-chip outline color="primary" icon="event" closable>Add to calendar</q-chip>
        <q-chip outline color="teal" icon="bookmark">Bookmark</q-chip>
        <q-chip outline color="red" icon="alarm" label="Set alarm" closable />
        <q-chip outline color="orange" icon="directions" closable>Get directions</q-chip>
        <q-chip outline color="teal" icon-right="bookmark">Bookmark</q-chip>
      </div>

      <p>Floating</p>
      <div class="q-ma-md">
        <q-btn color="orange" text-color="black" label="Inbox">
          <q-chip floating color="black" text-color="white">22</q-chip>
        </q-btn>
        &nbsp;&nbsp;
        <q-btn color="red" label="Inbox">
          <q-chip floating color="black" text-color="white">22</q-chip>
        </q-btn>
        &nbsp;&nbsp;
        <q-btn color="red" label="Inbox">
          <q-chip floating color="black" text-color="white">22</q-chip>
        </q-btn>
        &nbsp;&nbsp;
        <q-btn round dense color="black" icon="announcement">
          <q-chip floating color="red" text-color="white">22</q-chip>
        </q-btn>
        &nbsp;&nbsp;
        <q-btn round dense color="black" icon="announcement">
          <q-chip floating color="red" text-color="white">1</q-chip>
        </q-btn>
      </div>

      <p>Pointing</p>
      <div class="q-my-md">
        <q-chip color="orange" pointing="up">1</q-chip>
        <q-chip pointing="down">2</q-chip>
        <q-chip pointing="right" class="q-mr-md">3</q-chip>
        <q-chip pointing="left">4</q-chip>
      </div>
      <div class="q-my-md">
        <q-chip color="primary" text-color="white" pointing="up" clickable>Pointing Up</q-chip>
        <q-chip color="black" text-color="white" pointing="down" clickable>Pointing Down</q-chip>
        <q-chip pointing="right" clickable class="q-mr-md">Pointing Right</q-chip>
        <q-chip pointing="left" icon="bookmark" clickable>Pointing Left</q-chip>
        <q-chip pointing="left" clickable>
          <q-avatar>
            <img src="statics/boy-avatar.png">
          </q-avatar>
          Pointing Left
        </q-chip>
        <q-chip pointing="left">
          <q-avatar color="teal">J</q-avatar>
          Pointing Left
        </q-chip>
      </div>
      <div class="q-my-md">
        <q-chip square pointing="up">Pointing Up</q-chip>
        <q-chip square pointing="down">Pointing Down</q-chip>
        <q-chip square pointing="right" class="q-mr-md">Pointing Right</q-chip>
        <q-chip square pointing="left">Pointing Left</q-chip>
      </div>

      <div class="q-my-md">
        <q-chip dense pointing="up" clickable>Pointing Up</q-chip>
        <q-chip dense pointing="down" clickable>Pointing Down</q-chip>
        <q-chip dense pointing="right" class="q-mr-md" clickable>Pointing Right</q-chip>
        <q-chip dense pointing="left" clickable>Pointing Left</q-chip>
      </div>
      <div class="q-my-md">
        <q-chip dense square pointing="up" clickable>Pointing Up</q-chip>
        <q-chip dense square pointing="down" clickable>Pointing Down</q-chip>
        <q-chip dense square pointing="right" class="q-mr-md" clickable>Pointing Right</q-chip>
        <q-chip dense square pointing="left" clickable>Pointing Left</q-chip>
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
    resetClosable () {
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
