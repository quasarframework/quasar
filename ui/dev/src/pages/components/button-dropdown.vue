<template>
  <div style="padding: 25px">
    <q-toggle v-model="toggle" label="Show" />
    <q-btn-dropdown persistent v-model="toggle" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Dropdown Button" style="margin: 15px">
      <q-list>
        <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown no-caps @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy style="margin: 15px">
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left name="map" />
          <div class="text-center">
            Custom<br>Content
          </div>
        </div>
      </template>
      <q-list>
        <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown split no-caps @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy style="margin: 15px">
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left name="map" />
          <div class="text-center">
            Custom<br>Content
          </div>
        </div>
      </template>
      <q-list>
        <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown to="/" color="primary" split glossy label="Link /" style="margin: 15px">
      <q-list>
        <q-item clickable v-for="n in 2" :key="`2.${n}`" v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Dropdown Button" style="margin: 15px">
      <q-list>
        <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown dropdown-icon="change_history" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Custom Dropdown Icon" style="margin: 15px">
      <q-list>
        <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown :disable-main-btn="disableMainBtn" :disable-dropdown="disableDropdown" color="primary" split glossy label="btn" @click="log('click')" style="margin: 15px">
      <q-list>
        <q-item clickable v-for="n in 2" :key="`2.${n}`" v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable v-close-popup @click="showNotification">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-toggle v-model="disableMainBtn" label="Disable main btn" />
    <q-toggle v-model="disableDropdown" label="Disable dropdown" />

    <p class="caption">
      Empty label reactivity problem. Label should be {{ labelA }}
    </p>
    <div class="q-ma-md">
      <q-btn-dropdown @click="labelA+='+'" :label="labelA" />
    </div>

    <q-btn-dropdown auto-close color="primary" glossy label="Auto close" style="margin: 15px;">
      <q-list>
        <q-item clickable v-for="n in 2" :key="`1.${n}`">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable>
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown color="primary" no-icon-animation dropdown-icon="more_vert" label="No icon animation" style="margin: 15px">
      <q-list>
        <q-item clickable v-for="n in 2" :key="`1.${n}`">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
        <q-separator inset="item" spaced />
        <q-item-label header inset>
          Files
        </q-item-label>
        <q-item clickable>
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>
              February 22, 2016
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <div class="row q-gutter-x-md q-my-md">
      <q-toggle v-model="fullWidth" label="Full width" />
    </div>
    <div class="column q-gutter-y-md items-start">
      <q-btn-dropdown :class="fullWidth ? 'self-stretch' : ''" persistent @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Dropdown Button" style="margin: 15px">
        <q-list>
          <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
          <q-separator inset="item" spaced />
          <q-item-label header inset>
            Files
          </q-item-label>
          <q-item clickable v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="assignment" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown :class="fullWidth ? 'self-stretch' : ''" no-caps @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy style="margin: 15px">
        <template v-slot:label>
          <div class="row items-center col-grow justify-center no-wrap">
            <q-icon left name="map" />
            <div class="text-center">
              Custom<br>Content
            </div>
          </div>
        </template>
        <q-list>
          <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
          <q-separator inset="item" spaced />
          <q-item-label header inset>
            Files
          </q-item-label>
          <q-item clickable v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="assignment" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown :class="fullWidth ? 'self-stretch' : ''" split no-caps @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy style="margin: 15px">
        <template v-slot:label>
          <div class="col row items-center no-wrap">
            <q-icon left name="map" />
            <div class="text-center">
              Custom<br>Content
            </div>
          </div>
        </template>
        <q-list>
          <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
          <q-separator inset="item" spaced />
          <q-item-label header inset>
            Files
          </q-item-label>
          <q-item clickable v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="assignment" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown :class="fullWidth ? 'self-stretch' : ''" dropdown-icon="change_history" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Custom Dropdown Icon" style="margin: 15px">
        <q-list>
          <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
          <q-separator inset="item" spaced />
          <q-item-label header inset>
            Files
          </q-item-label>
          <q-item clickable v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="assignment" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown :class="fullWidth ? 'full-width' : ''" persistent @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Dropdown Button" style="margin: 15px">
        <q-list>
          <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
          <q-separator inset="item" spaced />
          <q-item-label header inset>
            Files
          </q-item-label>
          <q-item clickable v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="assignment" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown :class="fullWidth ? 'full-width' : ''" no-caps @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy style="margin: 15px">
        <template v-slot:label>
          <div class="row items-center col-grow justify-center no-wrap">
            <q-icon left name="map" />
            <div class="text-center">
              Custom<br>Content
            </div>
          </div>
        </template>
        <q-list>
          <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
          <q-separator inset="item" spaced />
          <q-item-label header inset>
            Files
          </q-item-label>
          <q-item clickable v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="assignment" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown :class="fullWidth ? 'full-width' : ''" split no-caps @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy style="margin: 15px">
        <template v-slot:label>
          <div class="col row items-center no-wrap">
            <q-icon left name="map" />
            <div class="text-center">
              Custom<br>Content
            </div>
          </div>
        </template>
        <q-list>
          <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
          <q-separator inset="item" spaced />
          <q-item-label header inset>
            Files
          </q-item-label>
          <q-item clickable v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="assignment" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown :class="fullWidth ? 'full-width' : ''" dropdown-icon="change_history" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Custom Dropdown Icon" style="margin: 15px">
        <q-list>
          <q-item clickable v-for="n in 2" :key="`1.${n}`" v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
          <q-separator inset="item" spaced />
          <q-item-label header inset>
            Files
          </q-item-label>
          <q-item clickable v-close-popup @click="showNotification">
            <q-item-section avatar>
              <q-avatar icon="assignment" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      toggle: false,

      fullWidth: true,

      conf: [
        { split: false, dense: false, disable: false },
        { split: false, dense: true, disable: false },
        { split: true, dense: false, disable: false },
        { split: true, dense: true, disable: false },
        { split: false, dense: false, disable: true },
        { split: false, dense: true, disable: true },
        { split: true, dense: false, disable: true },
        { split: true, dense: true, disable: true }
      ],
      sizes: [ 'sm', 'md', 'lg' ],
      labelA: '',
      disableMainBtn: false,
      disableDropdown: false
    }
  },
  methods: {
    log (evt) {
      console.log(evt)
    },
    label (cfg) {
      let label = 'QBtnDropdown'
      if (cfg.split) {
        label += ' Split'
      }
      if (cfg.dense) {
        label += ' dense'
      }
      if (cfg.disable) {
        label += ' disable'
      }
      return label
    },
    hideDropdown (index) {
      console.log(this.$refs)
      this.$refs.first[ index ].hide()
    },
    showNotification () {
      this.$q.notify('wow')
    }
  }
}
</script>
