# [5.0.0](https://github.com/ionic-team/ionicons/releases) (2020-02-06)

It's here! Please enjoy 🎈

### What's new
* Top to bottom re-draw of every icon to better match the latest iOS and Material platform styles.
* Plenty of additions to help you get icons you need for your project.
* Instead of platform specific variants for each icon we are providing appearance variants (filled, outline, and sharp) for each icon.
  * Using appearance variants:
  ```html
  <ion-icon name="heart"></ion-icon> <!--filled variant-->
  <ion-icon name="heart-outline"></ion-icon> <!--outline variant-->
  <ion-icon name="heart-sharp"></ion-icon> <!--sharp variant-->
  ```
  * There will no longer be auto-switching for platform specificity when using Ionicons in an Ionic Framework app. If you'd like to switch icon styles based on the platform in Ionic use the `md` and `ios` attributes and provide the platform specific icon/variant name.
  ```html
  <ion-icon ios="heart-outline" md="heart-sharp"></ion-icon>
  ```
* Adjust the stroke weight via CSS for icons that use the outline variant.

### BREAKING CHANGES
The table below outlines icons that were removed or renamed.

| Icon Name                    |             | Status      | Notes                                                                 |
| -----------------------------| ------------| ------------| ----------------------------------------------------------------------|
| add-circle            	     | :x:         | deleted     | re-added as "circled" icon                                            |
| alert                  	     | :pencil2:   | renamed     | renamed to "alert-circle"                                            |
| appstore                     | :x:         | deleted     | added as google play & apple app store logos                          |
| arrow-dropdown-circle        | :pencil2:   | renamed     | `md` version added as "caret-down-circle", `ios` version added as "chevron-down-circle"         |
| arrow-dropdown               | :pencil2:   | renamed     | `md` version added as "caret-down", `ios` version added as "chevron-down-circle-outline"        |
| arrow-dropleft-circle        | :pencil2:   | renamed     | `md` version added as "caret-back-circle", `ios` version added as "chevron-back-circle"         |
| arrow-dropleft               | :pencil2:   | renamed     | `md` version added as "caret-back", `ios` version added as "chevron-back-circle-outline"        |
| arrow-dropright-circle       | :pencil2:   | renamed     | `md` version added as "caret-forward-circle", `ios` version added as "chevron-forward-circle"   |
| arrow-dropright              | :pencil2:   | renamed     | `md` version added as "caret-forward", `ios` version added as "chevron-forward-circle-outline"  |
| arrow-dropup-circle          | :pencil2:   | renamed     | `md` version added as "caret-up-circle", `ios` version added as "chevron-up-circle"             |
| arrow-dropup                 | :pencil2:   | renamed     | `md` version added as "caret-up", `ios` version added as "chevron-up-circle-outline"            |
| arrow-round-back             | :x:         | deleted     | becomes "arrow-back"                                                  |
| arrow-round-down             | :x:         | deleted     | becomes "arrow-down"                                                  |
| arrow-round-forward          | :x:         | deleted     | becomes "arrow-forward"                                               |
| arrow-round-up               | :x:         | deleted     | becomes "arrow-up"                                                    |
| at                           | :pencil2:   | renamed     | becomes "at-circle"                                                   |
| bowtie                       | :x:         | deleted     |                                                                       |
| chatboxes                    | :pencil2:   | renamed     | renamed to "chatbox"                                                  |
| clock                        | :x:         | deleted     |                                                                       |
| contact                      | :pencil2:   | renamed     | renamed to "person-circle"                                            |
| contacts                     | :pencil2:   | renamed     | renamed to "person-circle"                                            |
| done-all                     | :pencil2:   | renamed     | renamed to "checkmark-done"                                           |
| fastforward	                 | :pencil2:   | renamed     | renamed to "play-forward"                                             |
| filing                       | :pencil2:   | renamed     | renamed to "file-tray"                                                |
| logo-freebsd-devil                | :x:         | deleted     |                                                                       |
| logo-game-controller-a            | :x:         | deleted     |                                                                       |
| logo-game-controller-b            | :x:         | deleted     | added as "game-controller"                                            |
| logo-googleplus                   | :x:         | deleted     |                                                                       |
| hand                         | :x:         | deleted     | split into "hand-left" and "hand-right"                               |
| heart-empty                  | :pencil2:   | renamed     | renamed to "heart-outline"                                            |
| jet                          | :x:         | deleted     | use "airplane"                                                        |
| list-box                     | :x:         | deleted     |                                                                       |
| lock                         | :pencil2:   | renamed     | renamed to "lock-closed"                                              |
| microphone                   | :x:         | deleted     |                                                                       |
| model-s                      | :x:         | deleted     | added as "car-sport"                                                  |
| more                         | :x:         | deleted     | use "ellipsis-horizontal" for `ios` and "ellipsis-vertical" for `md`  |
| notifications-outline        | :x:         | deleted     | exists as circled version                                             |
| outlet                       | :x:         | deleted     |                                                                       |
| paper                        | :pencil2:   | renamed     | renamed to "newspaper"                                                |
| logo-polymer                      | :x:         | deleted     |                                                                       |
| pie                          | :pencil2:   | renamed     | renamed to "pie-chart"                                                |
| photos                       | :x:         | deleted     | use "image" or "images"                                               |
| qr-scanner                      | :pencil2:   | renamed     | renamed to "qr-code"                                               |
| quote                        | :x:         | deleted     |                                                                       |
| redo                         | :pencil2:   | renamed     | renamed to "arrow-redo"                                               |
| reorder                      | :x:         | deleted     | added as "reorder-two", "reorder-three", "reorder-four"               |
| return-left                  | :pencil2:   | renamed     | renamed to "return-down-back"                                         |
| return-right                 | :pencil2:   | renamed     | renamed to "return-down-forward"                                      |
| rewind                       | :pencil2:   | renamed     | renamed to "play-back"                                                |
| reverse-camera               | :pencil2:   | renamed     | renamed to "camera-reverse"                                           |
| share-alt                    | :x:         | deleted     |                                                                       |
| skip-backward	               | :pencil2:   | renamed     | renamed to "play-skip-back"					                                 |
| skip-forward	               | :pencil2:   | renamed     | renamed to "play-skip-forward"					                               |
| stats	                       | :pencil2:   | renamed     | renamed to "stats-chart"                                              |
| swap                         | :x:         | deleted     | use "swap-horizontal" or "swap-vertical"                              |
| switch                       | :pencil2:   | renamed     | renamed to "toggle"                                                   |
| text                         | :pencil2:   | renamed     | renamed to "chatbox-ellipses"                                         |
| undo                         | :pencil2:   | renamed     | renamed to "arrow-undo"	                                             |
| unlock                       | :pencil2:   | renamed     | renamed to "lock-open"		                                             |
