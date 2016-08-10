<template>
  <h2>Collapsible Types</h2>
  <h3>Accordion</h3>
  <ul class="collapsible">
    <li v-collapsible>
      <div><i>assignment_ind</i>First</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible>
      <div><i>explore</i>Second</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible>
      <div><i>shopping_cart</i>Third</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
  </ul>

  <h3>Popout</h3>
  <ul class="collapsible popout">
    <li v-collapsible>
      <div><i>room</i>First</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible>
      <div><i>shopping_basket</i>Second</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible>
      <div><i>loyalty</i>Third</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
  </ul>

  <h2>Options</h2>
  <h3>Preselected Section</h3>
  <h4>Accordion</h4>
  <ul class="collapsible">
    <li v-collapsible>
      <div><i>assignment_ind</i>First</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible class="active">
      <div><i>explore</i>Second</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible>
      <div><i>shopping_cart</i>Third</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
  </ul>

  <h4>Popout</h4>
  <ul class="collapsible popout">
    <li v-collapsible>
      <div><i>assignment_ind</i>First</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible class="active">
      <div><i>explore</i>Second</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible>
      <div><i>shopping_cart</i>Third</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
  </ul>

  <h3>Freely (not one at a time)</h3>
  <h4>Accordion</h4>
  <ul class="collapsible">
    <li v-collapsible.free>
      <div><i>assignment_ind</i>First</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible.free class="active">
      <div><i>explore</i>Second</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible.free>
      <div><i>shopping_cart</i>Third</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
  </ul>

  <h4>Popout</h4>
  <ul class="collapsible popout">
    <li v-collapsible.free>
      <div><i>assignment_ind</i>First</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible.free class="active">
      <div><i>explore</i>Second</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
    <li v-collapsible.free>
      <div><i>shopping_cart</i>Third</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
  </ul>

  <h2>Ubiquity</h2>
  <p class="caption">Using cards as content</p>
  <ul class="collapsible">
    <li v-collapsible>
      <div><i>assignment_ind</i>First Card</div>
      <div class="card bg-primary text-white">
        <div class="card-title">
          Card Title
        </div>
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>
    </li>
    <li v-collapsible>
      <div><i>explore</i>Second Card</div>
      <div class="card">
        <img src="../assets/mountains.jpg">
        <div class="card-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
      </div>
    </li>
    <li v-collapsible>
      <div><i>shopping_cart</i>Third Card</div>
      <div class="card">
        <div class="card-media">
          <img src="../assets/map.png">
          <button class="primary circular"><i>explore</i></button>
        </div>
        <div class="card-content">
          <div class="item">
            <i>local_bar</i>
            <div class="item-content">
              <div class="item-label">
                <p class="item-title">Bar XYZ</p>
                <p>Have a drink.</p>
              </div>
            </div>
          </div>
          <div class="item">
            <i>local_gas_station</i>
            <div class="item-content">
              <div class="item-label">
                <p class="item-title">Gas Station</p>
                <p>Fill your gas tank.</p>
              </div>
            </div>
          </div>
          <div class="item">
            <i>local_movies</i>
            <div class="item-content">
              <div class="item-label">
                <p class="item-title">Cinema XYZ</p>
                <p>Watch a movie.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card-actions card-no-top-padding">
          <div class="text-lime">
            13 minutes
          </div>
          <div>
            (1 mile)
          </div>
          <div class="auto"></div>
          <button class="primary clear small"><i class="on-left">directions</i> Start</button>
        </div>
      </div>
    </li>
  </ul>

  <div style="height: 700px;">&nbsp;</div>
</template>
