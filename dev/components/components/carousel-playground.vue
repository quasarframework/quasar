<template>
  <div class="layout-padding">
    <div style="margin-bottom: 25px" class="group">
      <q-checkbox v-model="checked" />
      <q-checkbox v-model="infinite" />
      <q-checkbox v-model="autoplay" />
    </div>

    <p class="caption">Empty</p>
    <q-carousel :infinite="infinite" :autoplay="autoplay" arrows dots fullscreen class="text-white shadow-2" name="empty"/>

    <p class="caption">Only if checked</p>
    <q-carousel :infinite="infinite" :autoplay="autoplay" arrows dots fullscreen class="text-white shadow-2" name="only if checked">
      <div v-if="checked" slot="slide" class="bg-primary">
        <div>v-if checked</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
    </q-carousel>

    <p class="caption">Only if NOT checked</p>
    <q-carousel :infinite="infinite" :autoplay="autoplay" arrows dots fullscreen class="text-white shadow-2" name="only if not checked">
      <div v-if="!checked" slot="slide" class="bg-primary">
        <div>v-if !checked</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
    </q-carousel>

    <p class="caption">Checked + slide</p>
    <q-carousel :infinite="infinite" :autoplay="autoplay" arrows dots fullscreen class="text-white shadow-2" name="checked + slide">
      <div v-if="checked" slot="slide" class="bg-primary">
        <div>v-if checked + slide</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
      <div slot="slide" class="bg-primary">
        <div>Slide 2</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
    </q-carousel>

    <p class="caption">NOT checked + slide</p>
    <q-carousel :infinite="infinite" :autoplay="autoplay" arrows dots fullscreen class="text-white shadow-2" name="NOT checked + slide">
      <div v-if="!checked" slot="slide" class="bg-primary">
        <div>v-if !checked + slide</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
      <div slot="slide" class="bg-primary">
        <div>Slide 2</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
    </q-carousel>

    <p class="caption">1 slides</p>
    <q-carousel :infinite="infinite" :autoplay="autoplay" arrows dots fullscreen class="text-white shadow-2">
      <div slot="slide" class="bg-primary">
        <div>Slide 1</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
    </q-carousel>

    <p class="caption">2 slides</p>
    <q-carousel :infinite="infinite" :autoplay="autoplay" arrows dots fullscreen class="text-white shadow-2">
      <div slot="slide" class="bg-primary">
        <div>Slide 1</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
      <div slot="slide" class="bg-secondary">
        <div>Slide 2</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
    </q-carousel>

    <p class="caption">3 slides</p>
    <q-carousel :infinite="infinite" :autoplay="autoplay" arrows dots fullscreen class="text-white shadow-2">
      <div slot="slide" class="bg-primary">
        <div>Slide 1</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
      <div slot="slide" class="bg-secondary">
        <div>Slide 2</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
      <div slot="slide" class="bg-dark">
        <div>Slide 3</div>
        <div v-for="n in 12">Line {{(n+2)}}</div>
      </div>
    </q-carousel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checked: false,
      infinite: true,
      autoplay: false
    }
  }
}
</script>
