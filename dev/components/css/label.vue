<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Basic Labels</p>
      <p>
        <span class="label bg-primary text-white">label</span>
        <span class="label bg-secondary text-white shadow-1">10k</span>
      </p>

      <p class="caption">Floating Labels</p>
      <p>
        <button class="light relative-position">
          Inbox
          <span class="floating label circular bg-primary text-white">22</span>
        </button>
        &nbsp;&nbsp;
        <button class="red relative-position">
          Inbox
          <span class="floating label bg-dark">22</span>
        </button>
      </p>

      <p class="caption">Chip Labels</p>
      <p>
        <div class="group">
          <div class="chip label bg-grey-4"><img :src="'statics/boy-avatar.png'"> John</div>
          <div class="chip label bg-teal text-white"><img :src="'statics/boy-avatar.png'"> Joe</div>
          <div class="chip label bg-black text-white"><img :src="'statics/boy-avatar.png'"> Jim</div>
          <br>
          <div class="chip label bg-light"><img :src="'statics/boy-avatar.png'"> John <i class="on-right">close</i></div>
          <div class="chip label bg-red text-white"><img :src="'statics/boy-avatar.png'"> Joe <i class="on-right">close</i></div>
          <div class="chip label bg-primary text-white"><img :src="'statics/boy-avatar.png'"> Jim <i class="on-right">close</i></div>
          <br>
          <div class="chip label bg-grey-4">John</div>
          <div class="chip label bg-teal text-white">Joe</div>
          <div class="chip label bg-black text-white">Jim</div>
        </div>
      </p>

      <p class="caption">Tag Labels</p>
      <p>
        <span class="tag label tag bg-light">New <i class="on-right">mail</i></span>
      </p>
      <p>
        <span class="tag label bg-red text-white">Upcoming</span>
      </p>
      <p>
        <span class="tag label bg-primary text-white">Featured</span>
      </p>

      <p class="caption">Pointing Labels</p>
      <p>
        <span class="label pointing-up bg-primary text-white">up</span>
        <span class="label pointing-down bg-primary text-white">down</span>
        <span class="label pointing-right bg-primary text-white">right</span>
        <span class="label pointing-left bg-primary text-white">left</span>
      </p>

      <p class="caption">With Icons</p>
      <p>
        <span class="label bg-primary text-white">
          <i class="on-left">mail</i>
          10
        </span>
        <span class="label bg-tertiary text-white">
          10
          <i class="on-right">mail</i>
        </span>
      </p>

      <p class="caption">With Text or Icon Detail</p>
      <p>
        <span class="label bg-amber">
          <span class="left-detail">Left</span> Detail
        </span>
        <span class="label bg-secondary text-white">
          Right <span class="right-detail">Detail</span>
        </span>
      </p>
      <p>
        <span class="label bg-orange text-white">
          <i class="left-detail">mail</i> 10
        </span>
        <span class="label bg-orange text-white">
          10 <i class="right-detail">mail</i>
        </span>
      </p>

      <p class="caption">Circular/Oval Labels</p>
      <p>
        <span class="label circular bg-primary text-white">2</span>
        <span class="label circular bg-secondary text-white shadow-1">10k</span>
      </p>
    </div>
  </div>
</template>
