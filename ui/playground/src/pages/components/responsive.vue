<template>
  <div class="q-layout-padding q-gutter-md q-my-md" style="max-width: 600px;">
    <div>
      <div class="q-gutter-md">
        <q-responsive :ratio="16/9">
          <q-card>
            <q-card-section>
              <div class="text-h6">Ratio 16:9</div>
            </q-card-section>
          </q-card>
        </q-responsive>

        <q-card>
          <q-card-section>
            <div>Section</div>
          </q-card-section>

          <q-responsive :ratio="16/9">
            <q-card-section class="bg-primary text-white inherit-border-radius">
              <div class="text-h6">Ratio 16:9</div>
            </q-card-section>
          </q-responsive>
        </q-card>
      </div>
    </div>

    <div class="q-py-md">
      <div class="q-gutter-md">
        <q-responsive :ratio="1">
          <q-card>
            <q-card-section>
              <div class="text-h6">Ratio 1:1</div>
            </q-card-section>
          </q-card>
        </q-responsive>

        <q-card>
          <q-card-section>
            <div>Section</div>
          </q-card-section>

          <q-responsive :ratio="1">
            <q-card-section class="bg-primary text-white inherit-border-radius">
              <div class="text-h6">Ratio 1:1</div>
            </q-card-section>
          </q-responsive>
        </q-card>
      </div>
    </div>

    <div>
      <div class="row items-start q-gutter-md">
        <q-responsive :ratio="16/9" class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">Ratio 16:9</div>
            </q-card-section>
          </q-card>
        </q-responsive>

        <q-responsive :ratio="1" class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">Ratio 1:1</div>
            </q-card-section>
          </q-card>
        </q-responsive>
      </div>
    </div>

    <div>
      <div class="row items-start q-gutter-md">
        <q-responsive :ratio="16/9">
          <q-card>
            <q-card-section>
              <div class="text-h6">Ratio 16:9</div>
            </q-card-section>
          </q-card>
        </q-responsive>

        <q-responsive :ratio="1">
          <q-card>
            <q-card-section>
              <div class="text-h6">Ratio 1:1</div>
            </q-card-section>
          </q-card>
        </q-responsive>
      </div>
    </div>

    <div style="width: 200px">
      <q-responsive :ratio="16/9" style="width: 500px">
        <q-card>
          <q-card-section>
            <div class="text-h6">Ratio 16:9</div>
            <div class="text-caption">Should not extend to 500px width</div>
          </q-card-section>
        </q-card>
      </q-responsive>
    </div>

    <div style="height: 100px">
      <q-responsive :ratio="16/9" style="height: 500px">
        <q-card>
          <q-card-section>
            <div class="text-h6">Ratio 16:9</div>
            <div class="text-caption">Should not extend to 500px height</div>
          </q-card-section>
        </q-card>
      </q-responsive>
    </div>

    <div>
      <div class="row items-start q-gutter-md">
        <q-responsive :ratio="16/9" class="col">
          <q-card class="column">
            <q-img class="col" src="https://cdn.quasar.dev/img/parallax2.jpg" />

            <q-card-section>
              <div class="text-h6">Ratio 16:9</div>
            </q-card-section>
          </q-card>
        </q-responsive>

        <q-responsive :ratio="1" class="col">
          <q-card class="column">
            <q-img class="col" src="https://cdn.quasar.dev/img/parallax2.jpg" />

            <q-card-section>
              <div class="text-h6">Ratio 1:1</div>
            </q-card-section>
          </q-card>
        </q-responsive>
      </div>
    </div>

    <div>
      <q-responsive :ratio="16/9" style="max-height: 100px">
        <q-card>
          <q-card-section>
            <div class="text-h6">Ratio 1:1</div>
            <div class="text-caption">max-height: 100px; leave last -- should not generate padding below it</div>
          </q-card-section>
        </q-card>
      </q-responsive>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      position: 'top',
      reverse: false,
      size: 20,

      timeouts: []
    }
  },
  computed: {
    computedSize () {
      return this.size + 'px'
    }
  },
  methods: {
    trigger () {
      this.$refs.bar.start()

      setTimeout(() => {
        if (this.$refs.bar) {
          this.$refs.bar.stop()
        }
      }, Math.random() * 3000 + 1000)
    },

    start (speed) {
      this.$refs.bar.start(speed)
    },

    increment () {
      this.$refs.bar.increment(Math.random() * 20)
    },

    stop () {
      this.$refs.bar.stop()
    }
  }
}
</script>
