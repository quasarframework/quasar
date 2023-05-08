<template>
  <h1>Vue Template Transform Asset URLs</h1>

  <div>
    Native image tag:
    <img src="~assets/logo.png" />
  </div>

  <div>
    QImg with src:
    <q-img id="qimg-src" src="~assets/logo.png" width="50px" />
  </div>

  <div>
    QImg with placeholder-src:
    <q-img id="qimg-placeholder-src" placeholder-src="~assets/logo.png" width="50px" />
  </div>

  <div>
    QParallax with src:
    <q-parallax id="qparallax-src" src="~assets/logo.png" />
  </div>

  <!-- The list is not exhaustive and doesn't need to be -->
</template>
