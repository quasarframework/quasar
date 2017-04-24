<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Basic Label Chips</p>
      <p>
        <q-chip class="bg-primary text-white">
          <q-icon name="alarm" slot="left" />
          q-chip
        </q-chip>
      </p>
      <p>
        <q-chip class="bg-primary text-white">
          <q-icon name="alarm" />
          q-chip
        </q-chip>
        <q-chip class="bg-primary text-white">
          q-chip
          <q-icon name="alarm" />
        </q-chip>
      </p>
      <p>
        <q-chip class="bg-primary text-white">q-chip</q-chip>
        <q-chip class="bg-secondary text-white shadow-1">10k</q-chip>
        <q-chip small class="bg-secondary text-white shadow-1">10k</q-chip>
        <q-chip class="bg-primary text-white">
          <q-icon name="alarm" slot="left" />
          q-chip
        </q-chip>
        <q-chip class="bg-primary text-white">
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
        <q-chip class="bg-primary text-white">
          <q-icon name="alarm" slot="left" />
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
        <q-chip class="bg-secondary text-white shadow-1">10k</q-chip>
      </p>
      <p>
        <q-chip square class="bg-primary text-white">q-chip</q-chip>
        <q-chip square class="bg-secondary text-white shadow-1">10k</q-chip>
        <q-chip square small class="bg-secondary text-white shadow-1">10k</q-chip>
        <q-chip square class="bg-primary text-white">
          <q-icon name="alarm" slot="left" />
          q-chip
        </q-chip>
        <q-chip square class="bg-primary text-white">
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
        <q-chip square class="bg-primary text-white">
          <q-icon name="alarm" slot="left" />
          q-chip
          <q-icon name="alarm" class="on-right" />
        </q-chip>
        <q-chip square class="bg-secondary text-white shadow-1">10k</q-chip>
      </p>

      <p class="caption">Floating Label Chips</p>
      <p>
        <q-btn class="light relative-position">
          Inbox
          <q-chip label floating  class="bg-primary text-white">22</q-chip>
        </q-btn>
        &nbsp;&nbsp;
        <q-btn class="red relative-position">
          Inbox
          <q-chip label floating class="bg-dark">22</q-chip>
        </q-btn>
      </p>

      <p class="caption">Advanced Label Chips</p>
      <p>
        <div class="group">
          <q-chip class="bg-grey-4"><img slot="left" src="~assets/boy-avatar.png"> John</q-chip>
          <q-chip class="bg-teal text-white"><img slot="left" src="~assets/boy-avatar.png"> Joe</q-chip>
          <q-chip class="bg-black text-white"><img slot="left" src="~assets/boy-avatar.png"> Jim</q-chip>
          <q-chip small class="bg-teal text-white"><img slot="left" src="~assets/boy-avatar.png"> Joe</q-chip>
          <br>
          <q-chip closable class="bg-light"><img slot="left" src="~assets/boy-avatar.png">John</q-chip>
          <q-chip closable class="bg-red text-white"><img slot="left" src="~assets/boy-avatar.png">Joe</q-chip>
          <q-chip closable class="bg-primary text-white"><img slot="left" src="~assets/boy-avatar.png">Jim</q-chip>
          <q-chip small closable class="bg-red text-white"><img slot="left" src="~assets/boy-avatar.png">Joe</q-chip>
          <br>
          <q-chip class="bg-grey-4">John</q-chip>
          <q-chip class="bg-teal text-white">Joe</q-chip>
          <q-chip class="bg-black text-white">Jim</q-chip>
          <q-chip small class="bg-teal text-white">Joe</q-chip>
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
        <q-chip tag square class="bg-primary text-white">Featured</q-chip>
      </p>

      <p class="caption">Pointing Label Chips</p>
      <p>
        <q-chip pointing="up" class="pointing-up bg-primary text-white">Pointing Up</q-chip>
        <q-chip pointing="down" class="pointing-down bg-primary text-white">Pointing Down</q-chip>
        <q-chip pointing="right" class="pointing-right bg-primary text-white">Pointing Right</q-chip>
        <q-chip pointing="left" class="pointing-left bg-primary text-white">Pointing Left</q-chip>
      </p>
      <p>
        <q-chip square pointing="up" class="bg-primary text-white">Pointing Up</q-chip>
        <q-chip square pointing="down" class="pointing-down bg-primary text-white">Pointing Down</q-chip>
        <q-chip square pointing="right" class="pointing-right bg-primary text-white">Pointing Right</q-chip>
        <q-chip square pointing="left" class="pointing-left bg-primary text-white">Pointing Left</q-chip>
      </p>

      <p class="caption">With Icons</p>
      <p>
        <q-chip class="bg-primary text-white">
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
