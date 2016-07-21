<template>
  <label>
    <toggle :model.sync="border"></toggle>
    Grid Borders
  </label>
  <div id="layout-container" :class="{'with-border': border}">

  <div class="row gutter">
    <div class="sm">SM</div>
    <div class="md">MD</div>
    <div class="bg">BG</div>
    <div class="lg">LG</div>
    <div class="lt-md">lt-MD</div>
    <div class="lt-bg">lt-BG</div>
    <div class="lt-lg">lt-LG</div>
    <div class="gt-sm">gt-SM</div>
    <div class="gt-md">gt-MD</div>
    <div class="gt-bg">gt-BG</div>
  </div>

  <div class="row gutter wrap justify-stretch content-center text-center">
    <div class="sm-width-2of3 bg-width-1of7 auto"><div>2/3</div></div>
    <div class="auto"><div>auto</div></div>
    <div class="auto"><div>auto</div></div>
  </div>

  <div class="row gutter wrap justify-stretch content-center text-center">
    <div class="width-2of3"><div>2/3</div></div>
    <div class="width-1of5"><div>1/5</div></div>
    <div class="auto"><div>auto</div></div>
    <div class="auto"><div>auto</div></div>
  </div>

  <div class="row gutter wrap">
    <div class="offset-1of3"><div>offset 1/3</div></div>
    <div class="auto"><div>auto</div></div>
  </div>

  <h3>Grid-ception</h3>
  <div class="row gutter">
    <div>
      <div>
        <div class="row gutter">
          <div class="width-1of3">
            <div>1/3</div>
          </div>
          <div>
            <div>
              <div class="row gutter">
                <div>
                  <div>1/2</div>
                </div>
                <div>
                  <div>1/2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="width-1of3">
      <div>1/3</div>
    </div>
  </div>

  <h3>Top-aligned Row Cells</h3>
  <div class="row gutter items-start">
    <div>
      <div>This cell should be top-aligned.</div>
    </div>
    <div class="width-1of2">
      <div>Pellentesque sagittis vel erat ac laoreet. Phasellus ac aliquet enim, eu aliquet sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pulvinar porta leo, eu ultricies nunc sollicitudin vitae. Curabitur pulvinar dolor lectus, quis porta turpis ullamcorper nec. Quisque eget varius turpis, quis iaculis nibh.</div>
    </div>
    <div>
      <div>This cell should be top-aligned.</div>
    </div>
  </div>
  <h3>Bottom-aligned Row Cells</h3>
  <div class="row gutter items-end">
    <div class="auto">
      <div>This cell should be bottom-aligned.</div>
    </div>
    <div>
      <div>Curabitur pulvinar dolor lectus, quis porta turpis ullamcorper nec. Quisque eget varius turpis, quis iaculis nibh. Ut interdum ligula id metus hendrerit cursus. Integer eu leo felis. Aenean commodo ultrices nunc, sit amet blandit elit gravida in.</div>
    </div>
    <div>
      <div>This cell should be bottom-aligned.</div>
    </div>
  </div>
  <h3>Vertically Centered Row Cells</h3>
  <div class="row gutter items-center">
    <div>
      <div>This cell should be vertically-centered with the cell to its right.</div>
    </div>
    <div>
      <div>Curabitur pulvinar dolor lectus, quis porta turpis ullamcorper nec. Quisque eget varius turpis, quis iaculis nibh. Ut interdum ligula id metus hendrerit cursus. Integer eu leo felis. Aenean commodo ultrices nunc, sit amet blandit elit gravida in. Sed est ligula, ornare ac nisi adipiscing, iaculis facilisis tellus. Nullam vel facilisis libero. Duis semper lobortis elit, vitae dictum erat.</div>
    </div>
  </div>
  <h3>Mixed Vertical Alignment</h3>
  <div class="row gutter">
    <div class="self-start">
      <div>This cell should be top aligned.</div>
    </div>
    <div>
      <div>Curabitur pulvinar dolor lectus, quis porta turpis ullamcorper nec. Quisque eget varius turpis, quis iaculis nibh. Ut interdum ligula id metus hendrerit cursus. Integer eu leo felis. Aenean commodo ultrices nunc, sit amet blandit elit gravida in. Sed est ligula, ornare ac nisi adipiscing, iaculis facilisis tellus.</div>
    </div>
    <div class="self-center">
      <div>This cell should be center-aligned.</div>
    </div>
    <div class="self-end">
      <div>This cell should be bottom-aligned.</div>
    </div>
  </div>

  <h3>Small Gutter</h3>
  <div class="row small-gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>
  <div class="row small-gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>

  <h3>Medium Gutter</h3>
  <div class="row gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>
  <div class="row gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>

  <h3>Big Gutter</h3>
  <div class="row big-gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>
  <div class="row big-gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>

  <h3>Large Gutter</h3>
  <div class="row large-gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>
  <div class="row large-gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>


  <h3>Responsive Gutter</h3>
  <div class="row sm-small-gutter md-gutter gt-md-large-gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>
  <div class="row sm-small-gutter md-gutter gt-md-large-gutter">
    <div class="auto">
      <div>1/2</div>
    </div>
    <div class="auto">
      <div>1/2</div>
    </div>
  </div>

  <h3>Responsive</h3>
  <div class="row gutter sm-column">
    <div class="width-2of3"><div>2/3</div></div>
    <div class="width-1of5"><div>1/5</div></div>
    <div class="auto"><div>auto</div></div>
    <div class="auto"><div>auto</div></div>
  </div>

  </div>
</template>

<style lang="styl">
$bg = rgba(147, 128, 108, .1)

#layout-container
  margin-top 30px

  .row, .column, .flex
    > div > div
      padding 10px
      border-radius 3px
      background $bg
      text-align center

  &.with-border
    .row, .column, .flex
      border 2px solid teal
      > div
        border 1px dashed orange
</style>

<script>
export default {
  data () {
    return {
      border: false
    }
  }
}
</script>
