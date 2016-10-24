<template>
  <div>
    <div class="layout-padding">
      <div class="timeline">
        <div class="timeline-label">
          <h4 class="bg-white text-italic">
            Friday
          </h4>
        </div>
        <div v-for="n in 2" class="timeline-item">
          <div class="timeline-badge">
            <img v-if="n % 2 === 0" :src="'statics/linux-avatar.png'">
            <i v-else>alarm</i>
          </div>
          <div class="timeline-title">
            Mountain Trip
          </div>
          <div class="timeline-date text-italic">
            <div>17:01</div>
            <div>June 16th, 2016</div>
          </div>
          <div class="card">
            <img :src="'statics/mountains.jpg'">
            <div class="card-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </div>
        </div>
        <div class="timeline-label">
          <h4 class="bg-white text-italic">
            Saturday
          </h4>
        </div>
        <div v-for="n in 5" class="timeline-item">
          <div class="timeline-badge">
            <img v-if="n % 2 === 0" :src="'statics/boy-avatar.png'">
            <i v-else>alarm</i>
          </div>
          <div class="timeline-date text-italic">
            <div>17:01</div>
            <div>June 16th, 2016</div>
          </div>
          <div class="card">
            <div class="card-title">
              Card Title
            </div>
            <div class="card-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </div>
        </div>
        <div class="timeline-label">
          <h4 class="bg-white text-italic">
            Sunday
          </h4>
        </div>
        <div v-for="n in 4" class="timeline-item">
          <div class="timeline-badge">
            <img v-if="n % 2 === 0" :src="'statics/guy-avatar.png'">
            <i v-else>alarm</i>
          </div>
          <div class="timeline-date text-italic">
            <div>17:01</div>
            <div>June 16th, 2016</div>
          </div>
          <div class="card">
            <div class="card-title">
              Card Title
            </div>
            <div class="card-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
