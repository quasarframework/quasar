<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Basic Label Chips</p>
      <div>
        <q-chip icon="alarm" color="primary">
          q-chip
        </q-chip>
      </div>
      <div>
        <q-chip icon="alarm" outline color="primary">
          q-chip
        </q-chip>
        <q-chip icon-right="alarm" color="primary">
          q-chip
        </q-chip>
      </div>
      <div>
        <q-chip color="primary">q-chip</q-chip>
        <q-chip color="secondary" class="shadow-1">10k</q-chip>
        <q-chip small color="secondary" class="shadow-1">10k</q-chip>
        <q-chip icon="alarm" color="primary">
          q-chip
        </q-chip>
        <q-chip icon-right="alarm" color="primary">
          q-chip
        </q-chip>
        <q-chip icon="alarm" icon-right="alarm" color="primary">
          q-chip
        </q-chip>
        <q-chip color="secondary" class="shadow-1">10k</q-chip>
      </div>
      <div>
        <q-chip square color="primary">q-chip</q-chip>
        <q-chip square color="secondary" class="shadow-1">10k</q-chip>
        <q-chip square small color="secondary" class="shadow-1">10k</q-chip>
        <q-chip square icon="alarm" color="primary">
          q-chip
        </q-chip>
        <q-chip icon-right="alarm" square color="primary">
          q-chip
        </q-chip>
        <q-chip square icon="alarm" icon-right="alarm" color="primary">
          q-chip
        </q-chip>
        <q-chip square color="secondary" class="shadow-1">10k</q-chip>
      </div>

      <p class="caption">Floating Label Chips</p>
      <div>
        <q-btn color="light" class="text-black relative-position">
          Inbox
          <q-chip floating color="primary">22</q-chip>
        </q-btn>
        &nbsp;&nbsp;
        <q-btn color="red" class="relative-position">
          Inbox
          <q-chip floating color="dark">22</q-chip>
        </q-btn>
      </div>

      <p class="caption">Advanced Label Chips</p>
      <div>
        <div class="group">
          <q-chip avatar="/statics/boy-avatar.png" color="grey-4" class="text-black">John</q-chip>
          <q-chip avatar="/statics/boy-avatar.png" color="teal">Joe</q-chip>
          <q-chip avatar="/statics/boy-avatar.png" color="black">Jim</q-chip>
          <q-chip avatar="/statics/boy-avatar.png" small color="teal">Joe</q-chip>
          <br>
          <q-chip avatar="/statics/boy-avatar.png" closable color="light" class="text-black">John</q-chip>
          <q-chip avatar="/statics/boy-avatar.png" closable color="red">Joe</q-chip>
          <q-chip avatar="/statics/boy-avatar.png" closable color="primary">Jim</q-chip>
          <q-chip avatar="/statics/boy-avatar.png" small closable color="red">Joe</q-chip>
          <br>
          <q-chip color="grey-4" class="text-black">John</q-chip>
          <q-chip color="teal">Joe</q-chip>
          <q-chip color="black">Jim</q-chip>
          <q-chip small color="teal">Joe</q-chip>
        </div>
      </div>

      <q-chip avatar="/statics/boy-avatar.png" closable color="primary" @click="clickable">Jim</q-chip>

      <p class="caption">Tag Label Chips</p>
      <div>
        <q-chip tag icon-right="mail" color="light" class="text-black">New</q-chip>
      </div>
      <div>
        <q-chip tag closable color="red">Upcoming</q-chip>
      </div>
      <div>
        <q-chip tag square color="primary">Featured</q-chip>
      </div>

      <p class="caption">Pointing Label Chips</p>
      <div>
        <q-chip pointing="up" color="primary">1</q-chip>
        <q-chip pointing="down" color="primary">2</q-chip>
        <q-chip pointing="right" color="primary">3</q-chip>
        <q-chip pointing="left" color="primary">4</q-chip>
      </div>
      <div>
        <q-chip pointing="up" color="primary">Pointing Up</q-chip>
        <q-chip pointing="down" color="primary">Pointing Down</q-chip>
        <q-chip pointing="right" color="primary">Pointing Right</q-chip>
        <q-chip pointing="left" color="primary">Pointing Left</q-chip>
      </div>
      <div>
        <q-chip square pointing="up" color="primary">Pointing Up</q-chip>
        <q-chip square pointing="down" color="primary">Pointing Down</q-chip>
        <q-chip square pointing="right" color="primary">Pointing Right</q-chip>
        <q-chip square pointing="left" color="primary">Pointing Left</q-chip>
      </div>

      <p class="caption">With Icons</p>
      <div>
        <q-chip icon="mail" color="primary">
          10
        </q-chip>
        <q-chip icon-right="mail" color="tertiary">
          10
        </q-chip>
      </div>

      <p class="caption">With Detail</p>
      <div>
        <q-chip detail icon="mail">Detail</q-chip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    clickable () {
      console.log('@click')
    }
  }
}
</script>
