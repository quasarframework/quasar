<template>
  <div>
    <div class="q-layout-padding buttons-test">
      <q-btn :type="tag" size="50px" label="clickme" @click="e => handle('click', e, true)" @keyup="e => handle('keyup', e)" @keydown="e => handle('keydown', e)" />
      <button @click="e => handle('click', e)" @keyup="e => handle('keyup', e)" @keydown="e => handle('keydown', e)">
        My btn
      </button>
      <a href="#" @click="e => handle('click', e, true)" @keyup="e => handle('keyup', e)" @keydown="e => handle('keydown', e)">
        My link
      </a>
      <q-toggle v-model="tag" :label="tag === 'button' ? 'Button' : 'Link'" true-value="button" false-value="a" />
      <div class="q-gutter-sm">
        <template v-for="n in ['xs', 'sm', 'md', 'lg', 'xl']" :key="`n_1_1_${ n }`">
          <q-btn :type="tag" :size="n" dense icon="android" color="primary" />
          <q-btn :type="tag" :size="n" icon="android" color="primary" />
          <q-btn :type="tag" :size="n" label="Test" color="primary" />
          <q-btn :type="tag" :size="n" icon="android" color="primary" label="Test" />
          <q-btn :type="tag" :size="n" round icon="android" color="primary" />
          <q-btn :type="tag" :size="n" round icon="android" color="primary" dense />
          <q-btn gigi="true" :type="tag" :size="n" label="Test" color="primary" />
          <span>{{ n }}</span>
          <br><br>
        </template>
        <template v-for="n in ['xs', 'sm', 'md', 'lg', 'xl']" :key="`n_2_1_${ n }`">
          <q-btn :type="tag" :size="n" dense label="Test" color="primary" />
          <q-btn :type="tag" :size="n" dense icon="android" color="primary" />
          <q-btn :type="tag" :size="n" dense icon="android" color="primary" label="Test" />
          <q-btn :type="tag" :size="n" dense round icon="android" color="primary" />
          <span>{{ n }}</span>
          <br><br>
        </template>
      </div>
      <div class="q-gutter-sm">
        <q-btn icon="fas fa-address-book" color="primary" />
        <q-btn round icon="fas fa-address-book" color="primary" />
        <q-btn icon="phone" label="Phone" stack color="primary" style="width: 300px" />
      </div>
      <q-toolbar color="secondary" style="width: 500px">
        <q-btn :type="tag" flat dense round icon="menu" />
        <q-btn :type="tag" flat round dense icon="android" />
        <q-btn :type="tag" flat dense icon="assignment_ind" />
        <q-btn :type="tag" flat dense icon="android" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn :type="tag" flat dense icon="sim_card" />
        <q-btn :type="tag" flat dense icon="gamepad" />
      </q-toolbar>
      <q-toolbar color="amber" text-color="black" style="width: 500px">
        <q-btn :type="tag" flat dense round icon="menu" />
        <q-btn :type="tag" flat dense round icon="android" />
        <q-btn :type="tag" flat dense round icon="assignment_ind" />
        <q-btn :type="tag" flat dense round icon="android" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn :type="tag" flat dense round icon="sim_card" />
        <q-btn :type="tag" flat dense round icon="gamepad" />
      </q-toolbar>
      <q-toolbar color="black" style="width: 500px">
        <q-btn :type="tag" flat round icon="menu" />
        <q-btn :type="tag" flat round icon="android" />
        <q-btn :type="tag" flat dense icon="assignment_ind" />
        <q-btn :type="tag" flat round icon="android" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn :type="tag" flat round icon="sim_card" />
        <q-btn :type="tag" flat round icon="gamepad" />
      </q-toolbar>

      <br><br>
      <div class="heading-3">
        Links
        <q-toggle v-model="toDisable" label="Disabled" />
      </div>
      <q-btn to="/" :disable="toDisable" label="To index" outline color="secondary" />
      <q-btn type="a" href="#/gigi" label="Type 'a' - bogus href" push color="secondary" class="q-ml-md" />
      <q-btn type="a" href="#/gigi" target="_blank" label="Type 'a' - external" color="secondary" class="q-ml-md" />
      <q-btn to="/" :disable="toDisable" label="To index in 2s" @click="linkClick" glossy color="secondary" class="q-ml-md" />
      <br><br>
      <div>
        <q-toggle v-model="testD" label="Disable form buttons" />
        <q-toggle v-model="testR" label="Wait for ripple" />
        <form @submit.prevent="submit" @reset.prevent="reset" class="shadow-2 q-pa-md row items-center">
          <div class="col row items-center q-gutter-md">
            <div class="col">
              <q-input v-model="test" />
            </div>
            <div class="col">
              <q-input :model-value="testC" @change="v => testC = v.target.value" />
            </div>
            <div class="col">
              <q-input type="number" v-model="testN" />
            </div>
          </div>
          <q-btn :tag="tag" fab-mini color="primary" icon="android" type="reset" class="on-right" title="Reset" @click="onClick" :disable="testD" :wait-for-ripple="testR" />
          <q-btn :tag="tag" fab color="primary" icon="android" type="submit" class="on-right" title="Submit" @click="onClick" :disable="testD" :wait-for-ripple="testR" />
        </form>
      </div>

      <br><br>
      <q-btn :type="tag" color="amber" text-color="black" icon="map" label="Some label" @click="onClick" />
      <q-btn :type="tag" text-color="amber" icon="map" label="Some label" @click="onClick" />

      <br><br>
      <div class="caption">
        Ripple management
      </div>
      <q-btn :ripple="false" color="secondary" :type="tag" label="No ripple" no-caps />
      <q-btn :ripple="{ color: 'yellow' }" color="secondary" :type="tag" label="Yellow ripple" no-caps class="q-ml-sm" />
      <q-btn :ripple="{ center: true }" color="secondary" :type="tag" label="Center ripple" no-caps class="q-ml-sm" />

      <div class="caption">
        Regular (rectangle) and Circular
      </div>
      <q-btn :type="tag" color="primary" label="Some very, but very long button title that should wrap to the next line without any problems" />
      <div class="q-gutter-md q-py-md">
        <q-btn :type="tag" icon="alarm" color="orange" label="Icoon" />
        <q-btn :type="tag" icon="ion-shuffle" label="Icoon" />
        <q-btn :type="tag" icon="fas fa-bath" label="Icoon" />
        <q-btn :type="tag" icon-right="check" label="Icoon" />
        <q-btn :type="tag" icon-right="more_horiz" label="Icoon" />
        <q-btn :type="tag" icon="cloud" icon-right="alarm" label="Icoon" />
        <q-btn :type="tag" icon="edit" icon-right="alarm" label="Icoon" />
        <q-btn :type="tag" icon="edit" icon-right="alarm" size="sm" label="Icoon" />
        <q-btn :type="tag" icon="edit" icon-right="alarm" size="lg" color="amber" label="Icoon" />

        <q-btn :type="tag" size="sm" color="primary" icon="mail" />
        <q-btn :type="tag" color="primary" icon="mail" />
        <q-btn :type="tag" size="lg" color="primary" icon="mail" />

        <q-btn :type="tag" round color="primary" size="sm" icon="mail" />
        <q-btn :type="tag" round color="primary" icon="mail" />
        <q-btn :type="tag" round color="primary" size="lg" icon="mail" />

        <q-btn :type="tag" label="Button" />
        <q-btn :type="tag" color="amber" label="Button" />
        <q-btn :type="tag" round icon="card_giftcard" />
        <q-btn :type="tag" round color="secondary" icon="card_giftcard" />

        <q-btn :type="tag" icon="alarm" label="Icoon" />
        <q-btn :type="tag" icon-right="check" label="Icoon" />
        <q-btn :type="tag" icon="ion-shuffle" label="Icoon" />
        <q-btn :type="tag" icon="fas fa-bath" label="Icoon" />
        <q-btn :type="tag" icon-right="more_horiz" label="Icoon" />
        <q-btn :type="tag" icon="cloud" icon-right="alarm" label="Icoon" />
        <q-btn :type="tag" icon="edit" icon-right="alarm" label="Icoon" />
      </div>

      <div class="q-gutter-md q-py-md">
        <q-btn color="primary" :type="tag" :loading="!!loading[0]" @click="simulateProgress(0)" label="Button">
          <template v-slot:loading>
            <q-spinner-oval />
          </template>
        </q-btn>
        <q-btn color="primary" :type="tag" :loading="!!loading[1]" @click="simulateProgress(1)" label="Button">
          <template v-slot:loading>
            <span>Loading...</span>
          </template>
        </q-btn>
        <q-btn push color="primary" :type="tag" :loading="!!loading[0]" @click="simulateProgress(0)" label="Button">
          <template v-slot:loading>
            <q-spinner-oval />
          </template>
        </q-btn>
        <q-btn push color="primary" :type="tag" :loading="!!loading[1]" @click="simulateProgress(1)" label="Button">
          <template v-slot:loading>
            <span>Loading...</span>
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[2]" color="orange" @click="simulateProgress(2)" label="Button">
          <template v-slot:loading>
            <q-spinner-bars />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[3]" color="secondary" @click="simulateProgress(3)" label="Button">
          <template v-slot:loading>
            <q-spinner-cube />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[4]" color="amber" @click="simulateProgress(4)" label="Button">
          <template v-slot:loading>
            <q-spinner-comment />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[5]" color="primary" size="xs" @click="simulateProgress(5)" label="Button">
          <template v-slot:loading>
            <q-spinner-cube />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[6]" color="primary" size="sm" @click="simulateProgress(6)" label="Button">
          <template v-slot:loading>
            <q-spinner-dots />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[7]" color="primary" size="md" @click="simulateProgress(7)" label="Button">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[8]" color="primary" size="lg" @click="simulateProgress(8)" label="Button">
          <template v-slot:loading>
            <q-spinner-grid />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[9]" color="primary" size="xl" @click="simulateProgress(9)" label="Button">
          <template v-slot:loading>
            <q-spinner-hearts />
          </template>
        </q-btn>
        <q-btn :type="tag" size="xs" round :loading="!!loading[10]" @click="simulateProgress(10)" color="primary" icon="mail">
          <template v-slot:loading>
            <q-spinner-hourglass />
          </template>
        </q-btn>
        <q-btn :type="tag" size="sm" round :loading="!!loading[11]" @click="simulateProgress(11)" color="primary" icon="mail">
          <template v-slot:loading>
            <q-spinner-infinity />
          </template>
        </q-btn>
        <q-btn :type="tag" round :loading="!!loading[12]" @click="simulateProgress(12)" color="primary" icon="mail">
          <template v-slot:loading>
            <q-spinner-pie />
          </template>
        </q-btn>
        <q-btn :type="tag" size="lg" round :loading="!!loading[13]" @click="simulateProgress(13)" color="primary" icon="mail">
          <template v-slot:loading>
            <q-spinner-puff />
          </template>
        </q-btn>
        <q-btn :type="tag" size="xl" round :loading="!!loading[14]" @click="simulateProgress(14)" color="primary" icon="mail">
          <template v-slot:loading>
            <q-spinner-gears />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[15]" color="orange" @click="simulateProgress(15)" label="Button">
          <template v-slot:loading>
            <q-spinner-radio />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[16]" color="orange" @click="simulateProgress(16)" label="Button">
          <template v-slot:loading>
            <q-spinner-rings />
          </template>
        </q-btn>
        <q-btn :type="tag" :loading="!!loading[17]" color="orange" @click="simulateProgress(17)" label="Button">
          <template v-slot:loading>
            <q-spinner-tail />
          </template>
        </q-btn>

        <q-btn :type="tag" color="primary" :loading="!!loading[18]" size="sm" @click="simulateProgress(18)" icon-right="alarm" label="Button">
          <template v-slot:loading>
            <q-spinner-audio />
          </template>
        </q-btn>
        <q-btn :type="tag" round :loading="!!loading[19]" @click="simulateProgress(19)" color="primary" size="lg" icon="alarm">
          <template v-slot:loading>
            <q-spinner-ball />
          </template>
        </q-btn>

        <q-btn :type="tag" round :loading="!!loading[20]" color="black" @click="simulateProgress(20)" icon="camera_rear">
          <template v-slot:loading>
            <q-spinner-gears />
          </template>
        </q-btn>

        <br>
        <q-btn :type="tag" color="negative" label="Stop" @click="stopProgress" />
        <q-chip small v-for="(l, i) in loading" :key="i">
          {{ i }}: {{ l }}
        </q-chip>
      </div>

      <div class="q-gutter-md q-py-md">
        <q-btn :type="tag" color="primary" icon="alarm" label="Label" />
        <q-btn :type="tag" color="primary" icon-right="alarm" label="Label" />
        <q-btn :type="tag" color="primary" icon="alarm" icon-right="alarm" label="Label" />
        <q-btn :type="tag" color="primary" icon="alarm" icon-right="alarm" />
        <q-btn :type="tag" color="secondary" icon="alarm" label="Label">
          Slot
        </q-btn>
        <q-btn :type="tag" color="secondary" icon-right="alarm" label="Label">
          Slot
        </q-btn>
        <q-btn :type="tag" color="secondary" icon="alarm" icon-right="alarm" label="Label">
          Slot
        </q-btn>
        <q-btn :type="tag" color="secondary" icon="alarm" icon-right="alarm">
          Slot
        </q-btn>
        <q-btn :type="tag" color="positive" icon="alarm" label="Label" />
        <q-btn :type="tag" color="positive" icon-right="alarm" label="Label" />
        <q-btn :type="tag" color="positive" icon="alarm" icon-right="alarm" label="Label" />
        <q-btn :type="tag" color="positive" icon="alarm" icon-right="alarm" />
        <q-btn :type="tag" color="negative" icon="alarm" label="Label">
          <q-tooltip>Popover</q-tooltip>
        </q-btn>
        <q-btn :type="tag" color="negative" icon-right="alarm" label="Label">
          <q-tooltip>Popover</q-tooltip>
        </q-btn>
        <q-btn :type="tag" color="negative" icon="alarm" icon-right="alarm" label="Label">
          <q-tooltip>Popover</q-tooltip>
        </q-btn>
        <q-btn :type="tag" color="negative" icon="alarm" icon-right="alarm">
          <q-tooltip>Popover</q-tooltip>
        </q-btn>
      </div>
      <div class="q-gutter-md q-py-md">
        <q-btn :type="tag" round color="primary" icon="alarm" label="Label" />
        <q-btn :type="tag" round color="primary" icon-right="alarm" label="Label" />
        <q-btn :type="tag" round color="primary" icon="alarm" icon-right="alarm" label="Label" />
        <q-btn :type="tag" round color="primary" icon="alarm" icon-right="alarm" />
        <q-btn :type="tag" round color="positive" icon="alarm" label="Label" />
        <q-btn :type="tag" round color="positive" icon-right="alarm" label="Label" />
        <q-btn :type="tag" round color="positive" icon="alarm" icon-right="alarm" label="Label" />
        <q-btn :type="tag" round color="positive" icon="alarm" icon-right="alarm" />
        <q-btn :type="tag" round color="negative" icon="alarm" label="Label">
          <q-tooltip>Popover</q-tooltip>
        </q-btn>
        <q-btn :type="tag" round color="negative" icon-right="alarm" label="Label">
          <q-tooltip>Popover</q-tooltip>
        </q-btn>
        <q-btn :type="tag" round color="negative" icon="alarm" icon-right="alarm" label="Label">
          <q-tooltip>Popover</q-tooltip>
        </q-btn>
        <q-btn :type="tag" round color="negative" icon="alarm" icon-right="alarm">
          <q-tooltip>Popover</q-tooltip>
        </q-btn>
      </div>

      <div class="q-gutter-md q-py-md">
        <q-btn :type="tag" :loading="loading2" :percentage="percentage" color="primary" @click="startProgress">
          Btn with progress
          <template v-slot:loading>
            <span class="row items-center">
              <q-spinner class="on-left" />
              Computing...
            </span>
          </template>
        </q-btn>

        <q-btn push :type="tag" :loading="loading2" :percentage="percentage" color="primary" @click="startProgress">
          Btn with progress
          <template v-slot:loading>
            <span class="row items-center">
              <q-spinner class="on-left" />
              Computing...
            </span>
          </template>
        </q-btn>

        <q-btn :type="tag" round :loading="loading2" :percentage="percentage" color="primary" @click="startProgress" icon="wifi" />
      </div>

      <div class="caption">
        Small, Medium (default) and Big
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" size="sm" color="primary" label="Button" />
        <q-btn :type="tag" color="primary" label="Button" />
        <q-btn :type="tag" size="lg" color="primary" label="Button" />
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" icon="check" size="sm" color="primary" label="Button" />
        <q-btn :type="tag" icon="cloud" color="primary" label="Button" />
        <q-btn :type="tag" icon="alarm" size="lg" color="primary" label="Button" />
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" round size="sm" icon="check" color="primary" />
        <q-btn :type="tag" round icon="cloud" color="primary" />
        <q-btn :type="tag" round size="lg" icon="alarm" color="primary" />
      </div>

      <div class="q-gutter-sm">
        <q-btn :type="tag" v-for="i in 30" :key="'a' + i" round icon="cloud" color="primary" :size="`${8 + i * 4}px`" :title="`Size ${8 + i * 4}px`" />
        <q-btn :type="tag" v-for="size in sizes" :key="'aq' + size" round icon="cloud" color="primary" :size="size" :title="`Size ${size}`" />
      </div>

      <div class="q-gutter-sm">
        <q-btn :type="tag" v-for="i in 15" :key="'b' + i" :label="`Size ${4 + i * 4}px`" color="primary" :size="`${4 + i * 4}px`" />
        <q-btn :type="tag" v-for="size in sizes" :key="'c' + size" :label="`Size ${size}`" color="primary" :size="size" />
      </div>

      <div class="q-gutter-sm">
        <q-btn :type="tag" v-for="i in 15" :key="'d' + i" icon="cloud" :label="`Size ${4 + i * 4}px`" color="primary" :size="`${4 + i * 4}px`" />
        <q-btn :type="tag" v-for="size in sizes" :key="'e' + size" icon="cloud" :label="`Size ${size}`" color="primary" :size="size" />
      </div>

      <div class="caption">
        dense - Small, Medium (default) and Big
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" dense size="sm" color="primary" label="Button" />
        <q-btn :type="tag" dense color="primary" label="Button" />
        <q-btn :type="tag" dense size="lg" color="primary" label="Button" />
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" dense icon="check" size="sm" color="primary" label="Button" />
        <q-btn :type="tag" dense icon="cloud" color="primary" label="Button" />
        <q-btn :type="tag" dense icon="alarm" size="lg" color="primary" label="Button" />
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" dense round size="sm" icon="check" color="primary" />
        <q-btn :type="tag" dense round icon="cloud" color="primary" />
        <q-btn :type="tag" dense round size="lg" icon="alarm" color="primary" />
      </div>

      <div class="caption">
        Regular with Icons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" color="primary" icon="mail" label="On Left" />
        <q-btn :type="tag" color="secondary" icon-right="mail" label="On Right" />
      </div>

      <div class="caption">
        Color Examples
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" color="secondary" label="Secondary" />
        <q-btn :type="tag" color="primary" label="Dark" />
        <q-btn :type="tag" color="orange" label="Orange" />
        <q-btn :type="tag" color="light" class="text-black" label="Light" />
        <q-btn :type="tag" color="indigo" label="Indigo" />
        <q-btn :type="tag" color="red" label="Red" />
        <q-btn :type="tag" round color="teal" icon="alarm" />
      </div>
      <div class="caption">
        Custom Color Examples
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" flat style="color: #FF0080" label="Fuchsia Flat" />
        <q-btn :type="tag" style="background: #FF0080; color: white" label="Fuchsia" />
        <q-btn :type="tag" style="background: goldenrod; color: white" label="Goldenrod" />
        <q-btn :type="tag" outline style="color: goldenrod;" label="Goldenrod" />
      </div>

      <div class="caption">
        Disabled Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" color="primary" disable label="Disabled" />
        <q-btn :type="tag" round color="primary" disable icon="card_giftcard" />
        <q-btn :type="tag" push color="primary" disable label="Push" />
        <q-btn :type="tag" push color="primary" disable round icon="card_giftcard" />
        <q-btn :type="tag" push color="white" text-color="primary" disable label="Push" />
        <q-btn :type="tag" push color="white" text-color="primary" disable round icon="card_giftcard" />
      </div>

      <div class="caption">
        Flat Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" flat color="primary" label="Flat" />
        <q-btn :type="tag" flat round color="primary" icon="card_giftcard" />
      </div>

      <div class="caption">
        Unelevated Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" unelevated color="primary" label="Flat" />
        <q-btn :type="tag" unelevated round color="primary" icon="card_giftcard" />
      </div>

      <div class="caption">
        Outline Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" outline color="primary" label="Outline" />
        <q-btn :type="tag" round outline color="primary" icon="card_giftcard" />
      </div>

      <div class="caption">
        Push Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" push color="primary" label="Push" />
        <q-btn :type="tag" push color="primary" round icon="card_giftcard" />
        <q-btn :type="tag" push color="white" text-color="primary" label="Push" />
        <q-btn :type="tag" push color="white" text-color="primary" round icon="card_giftcard" />
      </div>

      <div class="caption">
        Round Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" round color="secondary" icon="alarm" />
      </div>

      <div class="caption">
        Rounded Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" rounded color="secondary" icon="alarm" />
      </div>

      <div class="caption">
        Glossy Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" color="primary" glossy label="Glossy" />
        <q-btn :type="tag" color="secondary" glossy label="Glossy" />
        <q-btn :type="tag" color="deep-orange" glossy label="Glossy" />
        <q-btn :type="tag" round color="primary" glossy icon="card_giftcard" />
        <q-btn :type="tag" round color="secondary" glossy icon="card_giftcard" />
        <q-btn :type="tag" round color="deep-orange" glossy icon="card_giftcard" />
      </div>

      <div class="caption">
        Block Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" color="primary" class="block" icon="alarm" label="Block" />
        <q-btn :type="tag" color="secondary" class="block" label="Block" />
      </div>

      <div class="caption">
        Full Width Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" color="primary" class="full-width" label="Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width" />
        <q-btn :type="tag" color="secondary" class="full-width" label="Full-width" justify="start" />
        <q-btn :type="tag" color="primary" icon="alarm" class="full-width" label="Full-width" justify="end" />
        <q-btn :type="tag" color="secondary" icon-right="alarm" class="full-width" label="Full-width" justify="center" />
        <q-btn :type="tag" color="secondary" icon="lock" icon-right="alarm" class="full-width" label="Full-width" justify="between" />
        <q-btn :type="tag" color="secondary" icon="lock" icon-right="alarm" class="full-width" label="Full-width" justify="around" />
      </div>

      <div class="caption">
        Multiline Buttons
      </div>
      <div class="q-gutter-sm">
        <q-btn :type="tag" color="primary" size="sm">
          Small<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary">
          Normal<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" size="lg">
          Big<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="alarm" size="sm">
          Small<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="alarm">
          Normal<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="alarm" size="lg">
          Big<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon-right="alarm" size="sm">
          Small<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon-right="alarm">
          Normal<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon-right="alarm" size="lg">
          Big<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="lock" icon-right="alarm" size="sm">
          Small<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="lock" icon-right="alarm">
          Normal<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="lock" icon-right="alarm" size="lg">
          Big<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" class="full-width" icon="lock" icon-right="alarm" size="sm">
          Very long text that should wrap on the next line. I really mean it, it's a very long text. Maybe it's not clear, but it should be very, very long, so long that even a fullscreen width is not enough. I know it's not easy, but we should try.
        </q-btn>
        <q-btn :type="tag" color="primary" class="full-width" icon="lock" icon-right="alarm">
          Very long text that should wrap on the next line. I really mean it, it's a very long text. Maybe it's not clear, but it should be very, very long, so long that even a fullscreen width is not enough. I know it's not easy, but we should try.
        </q-btn>
        <q-btn :type="tag" color="primary" class="full-width" icon="lock" icon-right="alarm" size="lg">
          Very long text that should wrap on the next line. I really mean it, it's a very long text. Maybe it's not clear, but it should be very, very long, so long that even a fullscreen width is not enough. I know it's not easy, but we should try.
        </q-btn>
        <q-btn :type="tag" color="primary" size="sm" class="full-width">
          Small Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" class="full-width">
          Normal Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" size="lg" class="full-width">
          Big Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="alarm" size="sm" class="full-width">
          Small Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="alarm" class="full-width">
          Normal Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="alarm" size="lg" class="full-width">
          Big Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon-right="alarm" size="sm" class="full-width">
          Small Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon-right="alarm" class="full-width">
          Normal Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon-right="alarm" size="lg" class="full-width">
          Big Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="lock" icon-right="alarm" justify="between" size="sm" class="full-width">
          Small Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="lock" icon-right="alarm" justify="between" class="full-width">
          Normal Full-width<br>Multiline<br>Button
        </q-btn>
        <q-btn :type="tag" color="primary" icon="lock" icon-right="alarm" justify="between" size="lg" class="full-width">
          Big Full-width<br>Multiline<br>Button
        </q-btn>
      </div>

      <div class="caption">
        Wrap test
      </div>
      <div class="q-gutter-sm" style="width: 610px">
        <q-btn :type="tag" color="primary" label="Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width" />
        <q-btn :type="tag" color="primary" no-wrap label="No wrap. Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width" />
        <q-btn :type="tag" color="primary" no-wrap label="No wrap with label prop. Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width" />
      </div>

      <h2>Sizes</h2>
      <div v-for="size in sizes" :key="'f' + size">
        <h3 class="capitalize">
          {{ size }}
        </h3>
        <q-btn :type="tag" color="primary" :size="size" label="Btn" />
        <q-btn :type="tag" color="primary" :size="size" :icon="icon" label="Btn" />
        <q-btn :type="tag" color="primary" :size="size" :icon="icon" />
        text
        <q-btn :type="tag" class="bg-primary text-white disabled" :size="size" label="Disabled" />
        <q-btn
          v-for="extra in extras"
          :key="'g' + extra"
          color="primary"
          :size="size"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
          :label="extra"
        />
      </div>
      <div v-for="size in sizes" :key="'h' + size">
        <h3 class="capitalize">
          {{ size }}
        </h3>
        <q-btn :type="tag" color="primary" round :size="size" :icon="icon" />
        text
        <q-btn :type="tag" color="primary" round disable :size="size" :icon="icon" />
        <q-btn
          v-for="extra in extras"
          :key="'i' + extra"
          color="primary"
          round
          :size="size"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :icon="icon"
        />
      </div>
      <br><br>
      <h2>Types</h2>
      <h3 class="capitalize">
        Rectangular
      </h3>
      <div v-for="color in colors" :key="'j' + color">
        <h4 class="capitalize">
          {{ color }}
        </h4>
        <q-btn :type="tag" :color="color" :label="color" />
        <q-btn :type="tag" :color="color" :icon="icon" :label="color" />
        <q-btn :type="tag" :color="color">
          <q-icon :name="icon" />
        </q-btn>
        <q-btn :type="tag" class="disabled" :color="color">
          <q-icon :name="icon" />
        </q-btn>
        <q-btn
          v-for="extra in extras"
          :key="'k' + extra"
          :color="color"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
          :label="`${ color }-${ extra }`"
        />
      </div>

      <h3 class="capitalize">
        Circular
      </h3>
      <div v-for="color in colors" :key="'l' + color">
        <h4 class="capitalize">
          {{ color }}
        </h4>
        <q-btn :type="tag" round :color="color" :icon="icon" />
        <q-btn :type="tag" round disable :color="color" :icon="icon" />
        <q-btn
          v-for="extra in extras"
          round
          :key="'m' + extra"
          :color="color"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
          icon="wifi"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { extend } from 'quasar'

export default {
  data () {
    return {
      icon: 'alarm',
      sizes: [ 'xs', 'sm', 'md', 'lg', 'xl' ],
      colors: [
        'primary', 'secondary', 'accent', 'positive', 'negative', 'warning', 'info', '', 'light', 'dark',
        'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green',
        'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'
      ],
      extras: [ 'flat', 'outline', 'round', 'rounded', 'push', 'glossy' ],
      loading: {},
      loading2: false,
      percentage: 0,
      clickTimes: 0,
      test: 'Initial value',
      testC: 'Initial value onChange',
      testN: 0,
      testD: false,
      testR: false,
      tag: 'button',
      toDisable: false
    }
  },
  methods: {
    startProgress () {
      this.percentage = 0
      this.loading2 = true
      this.interval = setInterval(() => {
        this.percentage += Math.floor(Math.random() * 8 + 10)
        if (this.percentage >= 100) {
          this.percentage = 0
          clearInterval(this.interval)
          this.loading2 = false
        }
      }, 700)
    },
    simulateProgress (index) {
      const timeout = setTimeout(() => {
        if (index in this.loading) {
          this.loading = extend({}, this.loading, { [ index ]: false })
        }
      }, 5 * 60 * 1000)
      this.loading = extend({}, this.loading, { [ index ]: timeout })
    },
    stopProgress () {
      Object.values(this.loading).filter(t => t).map(t => clearTimeout(t))
      this.loading = {}
    },
    submit () {
      this.$q.notify(`Submit called with: [${ this.test }], [${ this.testC }], [${ this.testN }]`)
    },
    reset () {
      this.test = 'Initial value'
      this.testN = 0
      this.$q.notify('Reset called')
    },
    onClick (e) {
      this.$q.notify('Click called')
    },
    linkClick (e, go) {
      e.preventDefault() // we choose when we navigate

      console.log('triggering navigation in 2s')
      setTimeout(() => {
        console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    },
    handle (type, e, abort) {
      console.log(type, e)
      abort === true && e.preventDefault()
    }
  },
  beforeUnmount () {
    clearInterval(this.interval)
  }
}
</script>
