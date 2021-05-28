<template>
  <div class="q-layout-padding q-mx-auto">
    <div class="column flex-center" style="height: 200vh; width: 200vw;">
      <div v-for="n in 10" :key="n">
        Page has scroll on purpose
      </div>
      <div class="row justify-center">
        <div class="q-gutter-md" style="max-width: 700px">
          <q-btn label="Alert" flat color="primary" @click="alert = true" />
          <q-btn label="Confirm" flat color="primary" @click="confirm = true" />
          <q-btn label="Prompt" flat color="primary" @click="prompt = true" />
          <q-btn label="Persistent" flat color="primary" @click="persistent = true" />
          <q-btn label="Close Icon" flat color="primary" @click="icon = true" />
          <q-btn label="Bar" flat color="primary" @click="bar = true" />
          <q-btn label="Bar 2 (auto-close)" flat color="primary" @click="bar2 = true" />
          <q-btn label="Toolbar" flat color="primary" @click="toolbar = true" />
          <q-btn label="Scroll" flat color="primary" @click="scroll = true" />
          <q-btn label="Scroll 2" flat color="primary" @click="scroll2 = true" />
          <q-btn label="Scroll 3 bottom" flat color="primary" @click="scroll3 = true" />
          <q-btn label="Maximized" flat color="primary" @click="maximized = true" />
          <q-btn label="Positioned" flat color="primary" @click="positioned = true" />
          <q-btn label="Maximized & positioned" flat color="primary" @click="maxiPositioned = true" />
          <q-btn label="Seamless" flat color="primary" @click="seamless = true" />
          <q-btn label="Layout" flat color="primary" @click="layout = true" />
          <q-btn label="Inception" flat color="primary" @click="inception = true" />
          <q-btn label="Non standard content" flat color="primary" @click="nonStandard = true" />
          <q-btn label="Complex card" flat color="primary" @click="complexCard = true" />
          <q-btn label="Sliders" flat color="primary" @click="sliders = true" />
          <q-btn label="Layout Bottom" flat color="primary" @click="layoutBottom = true" />
          <q-btn label="Close popup test" flat color="primary" @click="closePopupTest = true" />
          <q-btn label="iOS top" flat color="primary" @click="iOSTestTop = true" />
          <q-btn label="iOS bottom" flat color="primary" @click="iOSTestBottom = true" />
          <q-btn label="iOS normal" flat color="primary" @click="iOSTestNormal = true" />
          <q-btn label="iOS test 2" flat color="primary" @click="iOSTest2 = true" />
        </div>
      </div>
    </div>

    <q-dialog attr="test" v-model="alert" class="test-class" no-esc-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Alert
          </div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-section>
          <q-toggle v-model="preventCloseToggle" label="Prevent closing with button" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup="!preventCloseToggle" :disable="preventCloseToggle" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog attr="test" :model-value="alert" class="test-class" no-esc-dismiss seamless position="bottom">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Alert - decoupled from model
          </div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-section>
          <q-toggle v-model="preventCloseToggle" label="Prevent closing with button" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup="!preventCloseToggle" :disable="preventCloseToggle" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">
            Persistent
          </div>
        </q-card-section>

        <q-card-section>
          Click/Tap on the backdrop.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="icon">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">
            Close icon
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="bar" persistent>
      <q-card>
        <q-bar>
          <q-icon name="network_wifi" />
          <q-icon name="network_cell" />
          <q-icon name="battery_full" />
          <div>9:34</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="bar2" auto-close persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-icon name="network_wifi" />
          <q-icon name="network_cell" />
          <q-icon name="battery_full" />
          <div>9:34</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">
              Close
            </q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">
            Alert, Auto-closing on click
          </div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>

          <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">You are currently not connected to any network.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            Your address
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="address" autofocus clearable />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add address" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="scroll" transition-show="rotate" transition-hide="rotate">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Terms of Agreement
          </div>
        </q-card-section>

        <q-card-section>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Decline" color="primary" v-close-popup />
          <q-btn flat label="Accept" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="scroll2">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Terms of Agreement
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
          </p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Decline" color="primary" v-close-popup />
          <q-btn flat label="Accept" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="scroll3" position="bottom" maximized>
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Terms of Agreement
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
          </p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Decline" color="primary" v-close-popup />
          <q-btn flat label="Accept" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="maximized" persistent :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">
              Minimize
            </q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">
              Maximize
            </q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">
              Close
            </q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">
            Alert
          </div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="positioned" position="bottom">
      <q-card style="width: 500px;">
        <q-linear-progress :value="0.6" color="pink" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">
              The Walker
            </div>
            <div class="text-grey">
              Fitz & The Tantrums
            </div>
          </div>

          <q-space />

          <q-btn flat round icon="fast_rewind" />
          <q-btn flat round icon="pause" />
          <q-btn flat round icon="fast_forward" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="maxiPositioned" position="bottom" maximized>
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Alert
          </div>
        </q-card-section>

        <q-card-section>
          3.6 Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-section>
          <q-toggle v-model="preventCloseToggle" label="Prevent closing with button" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup="!preventCloseToggle" :disable="preventCloseToggle" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="seamless" seamless position="bottom">
      <q-card style="width: 350px">
        <q-linear-progress :value="0.6" color="pink" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">
              The Walker
            </div>
            <div class="text-grey">
              Fitz & The Tantrums
            </div>
          </div>

          <q-space />

          <q-btn flat round icon="play_arrow" />
          <q-btn flat round icon="pause" />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="layout">
      <q-layout view="hhh lpR fff" style="height: 500px" container>
        <q-header reveal class="bg-black">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-footer reveal class="bg-black text-white">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            <q-toolbar-title>Footer</q-toolbar-title>
            <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
          </q-toolbar>
        </q-footer>

        <q-drawer v-model="drawer" :width="200" :breakpoint="600">
          <div v-for="n in 50" :key="n">
            Drawer {{ n }} / 50
          </div>
        </q-drawer>
        <q-drawer side="right" v-model="drawerR" :width="200" :breakpoint="300">
          <div v-for="n in 50" :key="n">
            Drawer {{ n }} / 50
          </div>
        </q-drawer>
        <q-page-container>
          <q-page style="padding-top: 50px" class="bg-yellow">
            <div v-for="n in contentSize" :key="n">
              My page My page My page My page My page My page My page My page My page {{ n }} / {{ contentSize }}
            </div>

            <q-page-sticky position="top-left" :offset="[18, 58]">
              <q-btn round color="primary" icon="arrow_back" class="rotate-45" />
            </q-page-sticky>
            <q-page-sticky position="top-right" :offset="[18, 58]">
              <q-btn round color="primary" icon="arrow_upward" class="rotate-45" />
            </q-page-sticky>
            <q-page-sticky position="bottom-left" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_forward" class="rotate-135" />
            </q-page-sticky>
            <q-page-sticky position="bottom-right" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_forward" class="rotate-45" />
            </q-page-sticky>

            <q-page-sticky position="top" expand class="bg-purple text-white">
              <q-toolbar>
                <q-btn flat round dense icon="map" />
                <q-toolbar-title>Title</q-toolbar-title>
                <q-checkbox dark color="yellow" v-model="moreContent" label="Scroll" />
              </q-toolbar>
            </q-page-sticky>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-dialog v-model="inception">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Inception
          </div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis laudantium minus earum totam modi laborum illo, corporis fuga saepe animi aliquam ea enim assumenda ut nulla natus aperiam quis. Iste.
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Open another dialog" @click="persistent = true" />
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="nonStandard">
      <q-carousel
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        v-model="slide"
        control-color="primary"
        navigation-icon="radio_button_unchecked"
        navigation
        padding
        height="200px"
        class="bg-white shadow-1 rounded-borders"
      >
        <q-carousel-slide :name="1" class="column no-wrap flex-center">
          <q-icon name="style" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" class="column no-wrap flex-center">
          <q-icon name="live_tv" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="3" class="column no-wrap flex-center">
          <q-icon name="layers" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="4" class="column no-wrap flex-center">
          <q-icon name="terrain" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-dialog>

    <q-dialog v-model="complexCard">
      <q-card>
        <q-img :src="require('assets/donuts.png')" />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 20px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Cafe Basilico
            </div>
            <div class="col-auto text-grey q-pt-md">
              <q-icon name="place" /> 250 ft
            </div>
          </div>

          <q-rating v-model="stars" :max="5" size="32px" />
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1">
            $・Italian, Cafe
          </div>
          <div class="text-subtitle2 text-grey">
            Small plates, salads & sandwiches in an intimate setting.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" v-close-popup />
          <q-btn flat v-close-popup>
            5:30PM
          </q-btn>
          <q-btn flat v-close-popup>
            7:30PM
          </q-btn>
          <q-btn flat v-close-popup>
            9:00PM
          </q-btn>
          <q-btn flat color="primary" v-close-popup>
            Reserve
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="sliders">
      <q-card style="width: 300px" class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">
            Volumes
          </div>
        </q-card-section>

        <q-item-label header>
          Media volume
        </q-item-label>
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="volume_up" />
          </q-item-section>
          <q-item-section>
            <q-slider color="teal" v-model="slideVol" :step="0" />
          </q-item-section>
        </q-item>

        <q-item-label header>
          Alarm volume
        </q-item-label>
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="alarm" />
          </q-item-section>
          <q-item-section>
            <q-slider color="teal" v-model="slideAlarm" :step="0" />
          </q-item-section>
        </q-item>

        <q-item-label header>
          Ring volume
        </q-item-label>
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="vibration" />
          </q-item-section>
          <q-item-section>
            <q-slider color="teal" v-model="slideVibration" :step="0" />
          </q-item-section>
        </q-item>

        <q-card-section class="q-gutter-md">
          <q-icon size="30px" name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="date" />
            </q-popup-proxy>
          </q-icon>

          <q-icon size="30px" name="colorize" class="cursor-pointer">
            <q-popup-proxy>
              <q-color v-model="color" />
            </q-popup-proxy>
          </q-icon>

          <q-icon size="30px" name="view_carousel" class="cursor-pointer">
            <q-popup-proxy>
              <q-carousel
                transition-prev="slide-right"
                transition-next="slide-left"
                swipeable
                animated
                v-model="slide"
                control-color="primary"
                navigation-icon="radio_button_unchecked"
                navigation
                padding
                height="500px"
                class="bg-white shadow-1 rounded-borders"
              >
                <q-carousel-slide :name="1" class="column no-wrap flex-center">
                  <q-icon name="style" color="primary" size="56px" />
                  <div class="q-mt-md text-center">
                    {{ lorem }}
                  </div>
                </q-carousel-slide>
                <q-carousel-slide :name="2" class="column no-wrap flex-center">
                  <q-icon name="live_tv" color="primary" size="56px" />
                  <div class="q-mt-md text-center">
                    {{ lorem }}
                  </div>
                </q-carousel-slide>
                <q-carousel-slide :name="3" class="column no-wrap flex-center">
                  <q-icon name="layers" color="primary" size="56px" />
                  <div class="q-mt-md text-center">
                    {{ lorem }}
                  </div>
                </q-carousel-slide>
                <q-carousel-slide :name="4" class="column no-wrap flex-center">
                  <q-icon name="terrain" color="primary" size="56px" />
                  <div class="q-mt-md text-center">
                    {{ lorem }}
                  </div>
                </q-carousel-slide>
              </q-carousel>
            </q-popup-proxy>
          </q-icon>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="select"
            :options="selectOptions"
            label="Select"
            clearable
          />
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <q-select
            v-model="select"
            :options="selectOptions"
            label="Select"
            clearable
          />
          <q-select
            v-model="select"
            :options="selectOptionsFiltered"
            use-input
            label="Select - Use input"
            @filter="filterFn"
            clearable
          />
          <q-input v-model="text1" autofocus label="Text 1" clearable />
          <q-input v-model="text2" label="Text 2" clearable />
          <q-input v-model="text3" type="textarea" label="Text 3 - textarea" clearable />
          <q-select
            v-model="selectMultiple"
            :options="selectOptions"
            multiple
            label="Select multiple"
            clearable
          />
          <q-select
            v-model="selectMultiple"
            :options="selectOptionsFiltered"
            use-input
            multiple
            label="Select multiple - Use input"
            @filter="filterFn"
            clearable
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="layoutBottom"
      maximized
      position="bottom"
    >
      <q-layout container style="height: 50vh">
        <q-header>Header</q-header>
        <q-page-container>
          <q-page padding class="bg-white">
            I should be a maximized dialog sliding from the bottom of the screen
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-dialog v-model="closePopupTest" v-bind="testDialog">
      <q-card>
        <q-card-section>
          <q-toggle v-model="closePopupBtn" label="Enable button" />
          <q-btn v-close-popup @click="closePopupBtnHandler" :disable="!closePopupBtn" label="Click" />
        </q-card-section>
        <q-card-section>
          <q-toggle v-model="testDialog.seamless" label="Seamless" />
          <q-toggle v-model="testDialog.persistent" label="Persistent" />
          <q-toggle v-model="testDialog.noBackdropDismiss" label="No Backdrop Dismiss" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="iOSTestTop" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Title
          </div>
          <div class="text-subtitle2">
            Subtitle
          </div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="iOStext" />
        </q-card-section>
        <q-card-section>
          <q-input v-model="iOStext" autofocus />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="iOSTestBottom" position="bottom">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Title
          </div>
          <div class="text-subtitle2">
            Subtitle
          </div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="iOStext" autofocus />
        </q-card-section>
        <q-card-section>
          <q-input v-model="iOStext" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="iOSTestNormal">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Title
          </div>
          <div class="text-subtitle2">
            Subtitle
          </div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="iOStext" autofocus />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="iOSTest2">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Title
          </div>
          <div class="text-subtitle2">
            Subtitle
          </div>
        </q-card-section>
        <q-card-section>
          <q-input v-for="n in 15" :key="n" v-model="iOStext" :label="`${n} of 15`" />
          <q-input v-model="iOStext" autofocus label="Last one" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      alert: true,
      persistent: false,
      confirm: false,
      prompt: false,
      icon: false,
      bar: false,
      bar2: false,
      toolbar: false,
      scroll: false,
      scroll2: false,
      scroll3: false,
      maximized: false,
      positioned: false,
      maxiPositioned: false,
      seamless: false,
      layout: false,
      inception: false,
      nonStandard: false,
      complexCard: false,
      sliders: false,
      layoutBottom: false,

      maximizedToggle: true,
      preventCloseToggle: false,

      testDialog: {
        seamless: false,
        persistent: false,
        noBackdropDismiss: false
      },

      address: '',
      text1: '',
      text2: '',
      text3: '',

      moreContent: true,
      drawer: false,
      drawerR: false,

      slide: 1,
      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!',

      stars: 3,

      slideVol: 39,
      slideAlarm: 56,
      slideVibration: 63,

      date: '2018/03/14',
      color: '#f46234',

      select: 'ten',
      selectMultiple: [],
      selectOptions: [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten' ],
      selectOptionsFiltered: [],

      closePopupTest: false,
      closePopupBtn: false,

      iOSTestTop: false,
      iOSTestBottom: false,
      iOSTestNormal: false,
      iOSTest2: false,
      iOStext: ''
    }
  },

  computed: {
    contentSize () {
      return this.moreContent ? 150 : 5
    }
  },

  methods: {
    openSpecialPosition (position) {
      this.$q.dialog({
        title: 'Positioned',
        message: `This dialog appears from ${ position }.`,
        position
      })
    },

    closePopupBtnHandler () {
      console.log('closePopupBtnHandler')
    },

    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.selectOptionsFiltered = this.selectOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.selectOptionsFiltered = this.selectOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
