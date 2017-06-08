<template>
  <div>
    <div class="layout-padding">
      <q-card>
        <q-card-title>
          Headings
        </q-card-title>
        <q-card-main>
          <h1>Header 1</h1>
          <p>Text</p>

          <h2>Header 2</h2>
          <p>Text</p>

          <h3>Header 3</h3>
          <p>Text</p>

          <h4>Header 4</h4>
          <p>Text</p>

          <h5>Header 5</h5>
          <p>Text</p>

          <h6>Header 6</h6>
          <p>Text</p>
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title>
          Text & Paragraphs
        </q-card-title>
        <q-card-main>
          <div>
            <small>Small Text</small>
            Normal Text
            <big>Big Text</big>
          </div>
          <div>
            <sub>Subtext</sub>
            Text
            <sup>Supertext</sup>
          </div>
          <br>
          <p><strong>Default Paragraph</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          <p class="caption"><strong>Caption Paragraph</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          <p class="light-paragraph"><strong>Light Paragraph</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          <p class="thin-paragraph"><strong>Thin Paragraph</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>

          <p class="text-bold">Bold text</p>
          <p class="text-italic">Italic text</p>

          <p class="caption">Tokens</p>
          Some <span class="token">token</span> and <span class="token">other token</span>
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title>
          Blockquotes
        </q-card-title>
        <q-card-main>
          <blockquote>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <small>Someone famous for <cite title="Quasar Framework">Quasar Framework</cite></small>
          </blockquote>

          <blockquote class="text-right">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <small>Someone famous for <cite title="Quasar Framework">Quasar Framework</cite></small>
          </blockquote>
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title>
          Definition Lists
        </q-card-title>
        <q-card-main>
          <p class="caption">Vertical</p>

          <dl>
            <dt>Description lists</dt>
            <dd>A description list is perfect for defining terms.</dd>
            <dt>Euismod</dt>
            <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
            <dd>Donec id elit non mi porta gravida at eget metus.</dd>
            <dt>Malesuada porta</dt>
            <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
          </dl>

          <p class="caption">Horizontal</p>
          <dl class="horizontal">
            <dt>Description lists</dt>
            <dd>A description list is perfect for defining terms.</dd>
            <dt>Euismod</dt>
            <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
            <dd>Donec id elit non mi porta gravida at eget metus.</dd>
            <dt>Malesuada porta</dt>
            <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
          </dl>
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title>
          Links
        </q-card-title>
        <q-card-main>
          <p>Links: <a>Some link</a> and <a>Some other link</a>.</p>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>
