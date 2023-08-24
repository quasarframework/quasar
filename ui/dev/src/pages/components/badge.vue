<template>
  <div class="q-layout-padding" style="min-height: 100vh">
    <div class="q-gutter-md" style="max-width: 500px">
      <q-badge color="blue">
        #4D96F2
      </q-badge>

      <q-badge color="orange" text-color="black" label="2" />

      <q-badge color="purple">
        <q-icon name="fab fa-bluetooth-b" color="white" />
      </q-badge>

      <q-badge color="red">
        12 <q-icon name="warning" color="white" class="q-ml-xs" />
      </q-badge>

      <q-badge color="yellow" rounded />

      <q-badge color="green" rounded />

      <q-badge color="red" rounded />

      <div class="text-h6">
        Badge <q-badge color="primary">
          v1.0.0+
        </q-badge>
      </div>

      <div class="text-h6">
        Badge <q-badge color="primary" multi-line style="width: 40px">
          v1.0.0+ multi liiiiine
        </q-badge>
      </div>

      <div>
        Feature <q-badge color="primary">
          v1.0.0+
        </q-badge>
      </div>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar rounded>
            <img src="https://cdn.quasar.dev/img/chaosmonkey.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            Ganglia
          </q-item-label>
          <q-item-label caption>
            <q-badge color="yellow-6" text-color="black">
              3
              <q-icon
                name="fas fa-exclamation-triangle"
                size="14px"
                class="q-ml-xs"
              />
            </q-badge>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span>2 min ago</span>
        </q-item-section>
      </q-item>

      <div class="text-h4">
        Title
        <q-badge align="top">
          cli v1.0.0
        </q-badge>
      </div>

      <q-separator />

      <div class="text-h4">
        Title
        <q-badge align="middle">
          app v1.0.0
        </q-badge>
      </div>

      <q-separator />

      <div class="text-h4">
        Title
        <q-badge align="bottom">
          docs v1.0.0
        </q-badge>
      </div>

      <q-btn push color="white" text-color="primary" label="Unread Mails">
        <q-badge color="orange" floating>
          22
        </q-badge>
      </q-btn>

      <q-btn dense color="purple" round icon="email" class="q-ml-md">
        <q-badge color="red" floating>
          4
        </q-badge>
      </q-btn>

      <q-btn color="teal" size="sm" label="Unread Mails">
        <q-badge color="orange" floating transparent>
          ∞
        </q-badge>
      </q-btn>

      <q-btn dense round flat icon="email">
        <q-badge color="red" floating transparent>
          4
        </q-badge>
      </q-btn>

      <q-btn dense color="purple" round icon="email" class="q-ml-md">
        <q-badge color="red" floating rounded />
      </q-btn>

      <q-btn dense round flat icon="email">
        <q-badge color="red" floating rounded transparent />
      </q-btn>

      <div class="text-h4">
        Title
        <q-badge transparent align="middle" color="orange">
          app v1.0.0
        </q-badge>
      </div>

      <div>Some text <q-badge>100</q-badge></div>
      <div>
        Some text <q-badge color="orange">
          100
        </q-badge>
      </div>
      <div>
        Some text <q-badge color="yellow" text-color="black">
          100
        </q-badge>
      </div>

      <q-btn color="primary" label="Button">
        <q-badge color="orange" floating>
          100+
        </q-badge>
      </q-btn>
      <q-btn size="sm" color="primary" label="Button" class="q-ml-md">
        <q-badge color="orange" floating>
          100+
        </q-badge>
      </q-btn>
      <q-btn size="lg" dense color="primary" label="Button" class="q-ml-md">
        <q-badge color="orange" floating>
          4
        </q-badge>
      </q-btn>
      <q-btn color="primary" icon="map" round class="q-ml-md">
        <q-badge color="orange" floating>
          2
        </q-badge>
      </q-btn>
      <q-btn dense color="primary" icon="map" round class="q-ml-md">
        <q-badge color="orange" floating>
          2
        </q-badge>
      </q-btn>

      <h2>
        Some title
        <q-badge align="top">
          1.0.0+
        </q-badge>
      </h2>

      <h2>
        Some title
        <q-badge>1.0.0+</q-badge>
      </h2>

      <q-badge color="orange" label="Outline" outline />

      <q-avatar icon="mail" size="60px">
        <q-badge text-color="red" floating outline>
          40
        </q-badge>
      </q-avatar>

      <div class="text-h4">
        Text
        <q-badge outline align="middle" color="primary">
          v1.0.0
        </q-badge>
      </div>

      <div>
        Some text <q-badge color="red" label="1" rounded />
      </div>
      <div>
        Some text <q-badge color="green" label="999+" rounded />
      </div>
      <div>
        <q-badge color="blue" rounded class="q-mr-sm" />Some text
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dense: false
    }
  }
}
</script>
