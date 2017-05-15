<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Basic Label Chips</p>
      <p>
        <q-chip color="primary">
          <q-icon name="alarm" slot="left" />
          q-chip
        </q-chip>
      </p>
      <p>
        <q-chip color="primary">
          <q-icon name="alarm" class="on-left" />
          q-chip
        </q-chip>
        <q-chip color="primary">
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
      </p>
      <p>
        <q-chip color="primary">q-chip</q-chip>
        <q-chip color="secondary" class="shadow-1">10k</q-chip>
        <q-chip small color="secondary" class="shadow-1">10k</q-chip>
        <q-chip color="primary">
          <q-icon name="alarm" slot="left" />
          q-chip
        </q-chip>
        <q-chip color="primary">
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
        <q-chip color="primary">
          <q-icon name="alarm" slot="left" />
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
        <q-chip class="bg-secondary text-white shadow-1">10k</q-chip>
      </p>
      <p>
        <q-chip square color="primary">q-chip</q-chip>
        <q-chip square color="secondary" class="shadow-1">10k</q-chip>
        <q-chip square small color="secondary" class="shadow-1">10k</q-chip>
        <q-chip square color="primary">
          <q-icon name="alarm" slot="left" />
          q-chip
        </q-chip>
        <q-chip square color="primary">
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
        <q-chip square color="primary">
          <q-icon name="alarm" slot="left" />
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
        <q-chip square color="secondary" class="shadow-1">10k</q-chip>
      </p>

      <p class="caption">Floating Label Chips</p>
      <p>
        <q-btn color="light" class="text-black relative-position">
          Inbox
          <q-chip label floating  color="primary">22</q-chip>
        </q-btn>
        &nbsp;&nbsp;
        <q-btn color="red" class="relative-position">
          Inbox
          <q-chip label floating color="dark">22</q-chip>
        </q-btn>
      </p>

      <p class="caption">Advanced Label Chips</p>
      <p>
        <div class="group">
          <q-chip color="bg-grey-4" class="text-black"><img slot="left" src="~assets/boy-avatar.png"> John</q-chip>
          <q-chip color="teal"><img slot="left" src="~assets/boy-avatar.png"> Joe</q-chip>
          <q-chip color="black"><img slot="left" src="~assets/boy-avatar.png"> Jim</q-chip>
          <q-chip small color="teal"><img slot="left" src="~assets/boy-avatar.png"> Joe</q-chip>
          <br>
          <q-chip closable color="light" class="text-black"><img slot="left" src="~assets/boy-avatar.png">John</q-chip>
          <q-chip closable color="red"><img slot="left" src="~assets/boy-avatar.png">Joe</q-chip>
          <q-chip closable color="primary"><img slot="left" src="~assets/boy-avatar.png">Jim</q-chip>
          <q-chip small closable color="red"><img slot="left" src="~assets/boy-avatar.png">Joe</q-chip>
          <br>
          <q-chip color="grey-4" class="text-black">John</q-chip>
          <q-chip color="teal">Joe</q-chip>
          <q-chip color="black">Jim</q-chip>
          <q-chip small color="teal">Joe</q-chip>
        </div>
      </p>

      <p class="caption">Tag Label Chips</p>
      <p>
        <q-chip tag class="bg-light">New <q-icon class="on-right" name="mail" /></q-chip>
      </p>
      <p>
        <q-chip tag closable class="bg-red text-white">Upcoming</q-chip>
      </p>
      <p>
        <q-chip tag square color="primary">Featured</q-chip>
      </p>

      <p class="caption">Pointing Label Chips</p>
      <p>
        <q-chip pointing="up" class="pointing-up bg-primary text-white">1</q-chip>
        <q-chip pointing="down" class="pointing-down bg-primary text-white">2</q-chip>
        <q-chip pointing="right" class="pointing-right bg-primary text-white">3</q-chip>
        <q-chip pointing="left" class="pointing-left bg-primary text-white">4</q-chip>
      </p>
      <p>
        <q-chip pointing="up" class="pointing-up bg-primary text-white">Pointing Up</q-chip>
        <q-chip pointing="down" class="pointing-down bg-primary text-white">Pointing Down</q-chip>
        <q-chip pointing="right" class="pointing-right bg-primary text-white">Pointing Right</q-chip>
        <q-chip pointing="left" class="pointing-left bg-primary text-white">Pointing Left</q-chip>
      </p>
      <p>
        <q-chip square pointing="up" color="primary">Pointing Up</q-chip>
        <q-chip square pointing="down" class="pointing-down bg-primary text-white">Pointing Down</q-chip>
        <q-chip square pointing="right" class="pointing-right bg-primary text-white">Pointing Right</q-chip>
        <q-chip square pointing="left" class="pointing-left bg-primary text-white">Pointing Left</q-chip>
      </p>

      <p class="caption">With Icons</p>
      <p>
        <q-chip color="primary">
          <q-icon slot="left" name="mail" />
          10
        </q-chip>
        <q-chip class="bg-tertiary text-white">
          10
          <q-icon class="on-right" name="mail" />
        </q-chip>
      </p>

      <p class="caption">With Detail</p>
      <p>
        <q-chip detail>
          <q-icon name="email" slot="left" /> Detail
        </q-chip>
      </p>
    </div>
  </div>
</template>
