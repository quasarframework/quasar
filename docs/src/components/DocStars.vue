<template>
  <div class="doc-stars doc-stars--sm" />
  <div class="doc-stars doc-stars--md" />
  <div class="doc-stars doc-stars--lg" />
</template>

<style lang="sass">
$max-viewport-height: 7000 // max height at which stars are spread

@function generateRandomStars($number-of-stars, $max-viewport-height)
  $value: "#{random($max-viewport-height)}px #{random($max-viewport-height)}px #{$brand-primary}"
  @for $i from 1 through $number-of-stars
    $value: "#{$value}, #{random($max-viewport-height)}px #{random($max-viewport-height)}px #{$brand-primary}"
  @return unquote($value)

$shadows-sm: generateRandomStars(700, $max-viewport-height)
$shadows-md: generateRandomStars(600, $max-viewport-height)
$shadows-lg: generateRandomStars(500, $max-viewport-height)

@mixin createStar($size, $box-shadow, $animation-duration)
  animation: animateStar $animation-duration linear infinite
  background: transparent
  box-shadow: $box-shadow
  height: #{$size}px
  width: #{$size}px

.doc-stars
  position: absolute

  &--sm
    @include createStar(1, $shadows-sm, 70s)

  &--md
    @include createStar(2, $shadows-md, 100s)

  &--lg
    @include createStar(3, $shadows-lg, 150s)

body.body--light
  .doc-stars
    display: none

@keyframes animateStar
  from
    transform: translateY(0px)
  to
    // animate at half the spread distance of stars
    transform: translateY(-#{$max-viewport-height/2}px)
</style>
