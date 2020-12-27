<template>
  <div class="q-layout-padding">
    <div style="max-width: 700px;" class="q-gutter-y-md">
      <div class="row no-wrap btn-flex-container">
        <q-btn label="Btn1" color="primary" />
        <q-btn label="Btn2" color="primary" />
        <q-btn label="Btn3" color="primary" />
        <q-btn label="Btn4" color="primary" />
        <div class="btn-box">row</div>
        <button>Native btn</button>
        <a class="btn-border" :href="$route.path">Native link</a>
        <q-btn fab icon="android" />
        <q-btn fab-mini icon="android" />
      </div>

      <div class="row items-center no-wrap btn-flex-container">
        <q-btn label="Btn1" color="primary" />
        <q-btn label="Btn2" color="primary" />
        <q-btn label="Btn3" color="primary" />
        <q-btn label="Btn4" color="primary" />
        <div class="btn-box">row items-center</div>
        <button>Native btn</button>
        <a class="btn-border" :href="$route.path">Native link</a>
        <q-btn fab icon="android" />
        <q-btn fab-mini icon="android" />
      </div>

      <div class="column no-wrap btn-flex-container">
        <q-btn label="Btn1" color="primary" />
        <q-btn label="Btn2" color="primary" />
        <q-btn label="Btn3" color="primary" />
        <q-btn label="Btn4" color="primary" />
        <div class="btn-box">column</div>
        <button>Native btn</button>
        <a class="btn-border" :href="$route.path">Native link</a>
        <q-btn fab icon="android" />
        <q-btn fab-mini icon="android" />
      </div>

      <div class="column items-center no-wrap btn-flex-container">
        <q-btn label="Btn1" color="primary" />
        <q-btn label="Btn2" color="primary" />
        <q-btn label="Btn3" color="primary" />
        <q-btn label="Btn4" color="primary" />
        <div class="btn-box">column items-center</div>
        <button>Native btn</button>
        <a class="btn-border" :href="$route.path">Native link</a>
        <q-btn fab icon="android" />
        <q-btn fab-mini icon="android" />
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.btn-flex-container
  border: 1px solid $primary
  height: 400px
.btn-box
  color: #fff
  background: #000
  border-radius: $generic-border-radius
  padding: 5px
  height: 65px
  width: 100px
  display: flex
  align-items: center
  justify-content: center
.btn-border
  border: 1px solid #000
</style>
