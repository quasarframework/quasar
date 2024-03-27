<template>
  <div class="q-layout-padding test-flex-demo">
    <h6 class="text-red">
      You need to enable flex-addons from /ui/dev/app.js
    </h6>
    <h1>
      Columns - container height auto
      <small class="pull-right q-px-xs text-red">XS</small>
      <small class="pull-right q-px-xs text-purple gt-xs">SM</small>
      <small class="pull-right q-px-xs text-indigo gt-sm">MD</small>
      <small class="pull-right q-px-xs text-green gt-md">LG</small>
      <small class="pull-right q-px-xs text-orange gt-lg">XL</small>
    </h1>
    <div class="test-flex row">
      <div class="col-1">
        <div class="column">
          <div class="col-3">
            .col-3
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-7">
            .col-7
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 5" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-6">
            .col-6
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 5" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-2">
            .col-2
            <div class="placeholder" v-for="i in 2" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 5" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 2" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 6" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-2">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-2">
            .col-2
            <div class="placeholder" v-for="i in 2" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 10" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-2">
        <div class="column">
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 10" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-4">
            .col-4
            <div class="placeholder" v-for="i in 2" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-2">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 10" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-4">
            .col-4
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1">
        <div class="column">
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1">
        <div class="column">
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-2">
            .col-2
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <h1>
      Columns - container height 300px
      <small class="pull-right q-px-xs text-red">XS</small>
      <small class="pull-right q-px-xs text-purple gt-xs">SM</small>
      <small class="pull-right q-px-xs text-indigo gt-sm">MD</small>
      <small class="pull-right q-px-xs text-green gt-md">LG</small>
      <small class="pull-right q-px-xs text-orange gt-lg">XL</small>
    </h1>
    <div class="test-flex row" style="height: 300px;">
      <div class="col-1 full-height">
        <div class="column">
          <div class="col-3">
            .col-3
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-7">
            .col-7
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 full-height">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 5" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-6">
            .col-6
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 full-height">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 5" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-2">
            .col-2
            <div class="placeholder" v-for="i in 2" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 full-height">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 5" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 2" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 6" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-2 full-height">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-2">
            .col-2
            <div class="placeholder" v-for="i in 2" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 10" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-2 full-height">
        <div class="column">
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 10" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-4">
            .col-4
            <div class="placeholder" v-for="i in 2" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-2 full-height">
        <div class="column">
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 10" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-4">
            .col-4
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 full-height">
        <div class="column">
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-auto">
            .col-auto
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 full-height">
        <div class="column">
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col">
            .col
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
          <div class="col-grow">
            .col-grow
            <div class="placeholder" v-for="i in 4" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <h1>
      Rows - container width 100%
      <small class="pull-right q-px-xs text-red">XS</small>
      <small class="pull-right q-px-xs text-purple gt-xs">SM</small>
      <small class="pull-right q-px-xs text-indigo gt-sm">MD</small>
      <small class="pull-right q-px-xs text-green gt-md">LG</small>
      <small class="pull-right q-px-xs text-orange gt-lg">XL</small>
    </h1>
    <div class="test-flex">
      <div class="row">
        <div class="col-3">
          .col-3
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-7">
          .col-7
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 5" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-6">
          .col-6
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 5" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-2">
          .col-2
          <div class="placeholder" v-for="i in 2" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 5" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 2" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 6" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-2">
          .col-2
          <div class="placeholder" v-for="i in 2" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 10" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 10" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-4">
          .col-4
          <div class="placeholder" v-for="i in 2" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 10" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-4">
          .col-4
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-grow offset-1">
          .col-grow.offset-1
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-1">
          .col-1
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col offset-1">
          .col.offset-1
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-grow offset-1">
          .col-grow.offset-1
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col col-md-6 col-lg-4 offset-1 offset-md-3 offset-lg-0">
          .col.offset-1.offset-md-3.offset-lg-0
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col col-sm-auto col-md-3">
          .col.col-sm-auto.col-md-3
          <div class="placeholder" v-for="i in 10" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col col-sm-auto col-md-3">
          .col.col-sm-auto.col-md-3
          <div class="placeholder" v-for="i in 10" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
    </div>

    <h1>
      Rows - container width 500px
      <small class="pull-right q-px-xs text-red">XS</small>
      <small class="pull-right q-px-xs text-purple gt-xs">SM</small>
      <small class="pull-right q-px-xs text-indigo gt-sm">MD</small>
      <small class="pull-right q-px-xs text-green gt-md">LG</small>
      <small class="pull-right q-px-xs text-orange gt-lg">XL</small>
    </h1>
    <div class="test-flex" style="width: 500px;">
      <div class="row">
        <div class="col-3">
          .col-3
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-7">
          .col-7
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 5" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-6">
          .col-6
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 5" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-2">
          .col-2
          <div class="placeholder" v-for="i in 2" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 5" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 2" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 6" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-2">
          .col-2
          <div class="placeholder" v-for="i in 2" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 10" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 10" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-4">
          .col-4
          <div class="placeholder" v-for="i in 2" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 10" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-4">
          .col-4
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-auto">
          .col-auto
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col">
          .col
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
        <div class="col-grow">
          .col-grow
          <div class="placeholder" v-for="i in 4" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
    </div>

    <h1>
      Responsive - .column.row-md.column-lg.q-col-gutter-sm.q-col-gutter-sm-md.q-col-gutter-md-lg.q-col-gutter-lg-xl - height 500px
      <small class="pull-right q-px-xs text-red">XS</small>
      <small class="pull-right q-px-xs text-purple gt-xs">SM</small>
      <small class="pull-right q-px-xs text-indigo gt-sm">MD</small>
      <small class="pull-right q-px-xs text-green gt-md">LG</small>
      <small class="pull-right q-px-xs text-orange gt-lg">XL</small>
    </h1>
    <div class="test-flex q-pa-xl">
      <div class="column row-md column-lg q-col-gutter-sm q-col-gutter-sm-md q-col-gutter-md-lg q-col-gutter-lg-xl" style="height: 500px;">
        <div class="col-4 col-lg-2 row">
          <div class="fit">
            .col-4.col-lg-2
          </div>
        </div>
        <div class="col col-lg-3 row">
          <div class="fit">
            .col.col-lg-3
          </div>
        </div>
        <div class="col col-md-4 row">
          <div class="fit">
            .col.col-md-4
          </div>
        </div>
        <div class="col-xs-2 col-md-3 col-lg-6 row">
          <div class="fit">
            .col-xs-2.col-md-3.col-lg-6
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.test-flex-demo
  padding-bottom: 30vh
  h1
    font-size: 1.5em
    margin: 1em 0 .2em 0
    &:first-child
      margin-top: 0
  .test-flex
    .placeholder
      color: #ccc

    :not(.placeholder)
      position: relative
      &:hover:before
        content: attr(class)
        position: absolute
        top: 0
        left: 50%
        transform: translateX(-50%) translateY(-100%)
        min-width: 100%
        padding: 2px 5px
        background-color: rgba(0,0,0,.5)
        color: white
        white-space: normal

    [class^='column']
      height: 100%
      background-color: rgba(255, 0, 0, .05)
      outline: 1px solid #c33
      > div
        background-color: rgba(0, 255, 0, .1)
        text-align: center
        outline: 1px solid #ccc
        > div.fit
          background-color: rgba(0, 0, 255, .2)
    [class^='row']
      @extends .test-flex-demo .test-flex [class^='column']
      > div
        white-space: nowrap
        text-overflow: ellipsis
      .placeholder
        display: inline-block
        width: 2em
</style>

<script>
export default {
  data () {
    return {}
  }
}
</script>
