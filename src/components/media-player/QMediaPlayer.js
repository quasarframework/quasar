import Vue from 'vue'

import QSlideTransition from '../slide-transition/QSlideTransition.js'
import QSlider from '../slider/QSlider'
import QBtn from '../btn/QBtn'
import QTooltip from '../tooltip/QTooltip'
// was QPopover
import QMenu from '../menu/QMenu.js'
// was QCollapsible
import QExpansionItem from '../list/QExpansionItem'
import QList from '../list/QList.js'
// import QItem from '../list/QItem.js'
// import QItemSide from '../list/QItemSide.js'
// import QItemMain from '../list/QItemMain.js'
import QIcon from '../icon/QIcon'
import QSpinner from '../spinner/QSpinner'
// import CloseMenu from '../../directives/close-menu'

const getMousePosition = function (e, type = 'x') {
  if (type === 'x') {
    return e.pageX
  }
  return e.pageY
}
const padTime = (val) => {
  val = Math.floor(val)
  if (val < 10) {
    return '0' + val
  }
  return val + ''
}
const timeParse = (sec) => {
  let min = 0
  min = Math.floor(sec / 60)
  sec = sec - min * 60
  return padTime(min) + ':' + padTime(sec)
}

export default Vue.extend({
  name: 'QMediaPlayer',

  props: {
    type: {
      type: String,
      required: false,
      default: 'video',
      validator: v => ['video', 'audio'].includes(v)
    },
    mobileMode: {
      type: Boolean,
      required: false,
      default: false
    },
    sources: {
      type: Array,
      required: false,
      default: () => []
    },
    poster: {
      type: String,
      required: false,
      default: ''
    },
    tracks: {
      type: Array,
      required: false,
      default: () => []
    },
    autoplay: {
      type: Boolean,
      required: false,
      default: false
    },
    crossOrigin: {
      type: [String, null],
      default: null,
      validator: v => [null, 'anonymous', 'use-credentials'].includes(v)
    },
    volume: {
      type: Number,
      required: false,
      default: 0.6,
      validator: v => v >= 0 && v <= 100
    },
    muted: {
      type: Boolean,
      required: false,
      default: false
    },
    trackLanguage: {
      type: String,
      required: false,
      default: ''
    },
    showTooltips: {
      type: Boolean,
      required: false,
      default: false
    },
    showBigPlayButton: {
      type: Boolean,
      required: false,
      default: true
    },
    showSpinner: {
      type: Boolean,
      required: false,
      default: true
    },
    controlsDisplayTime: {
      type: Number,
      required: false,
      default: 2000
    },
    playbackRates: {
      type: Array,
      required: false,
      default: () => []
    },
    // initial playback rate
    playbackrate: {
      type: Number,
      required: false,
      default: 1
    },
    color: {
      type: String,
      required: false,
      default: 'teal-6'
    },
    controlsColor: {
      type: String,
      required: false,
      default: 'white'
    },
    backgroundColor: {
      type: String,
      required: false,
      default: 'black'
    }
  },

  data () {
    return {
      $media: null, // the actual video/audio player
      timer: {
        // timer used to hide control during mouse inactivity
        hideControlsTimer: null
      },
      state: {
        errorText: null,
        controls: false,
        showControls: true,
        volume: 60,
        muted: false,
        currentTime: 0,
        durationTime: '00:00',
        remainingTime: '00:00',
        displayTime: '00:00',
        videoPercent: 0,
        fullScreen: false,
        loading: true,
        playReady: false,
        playing: false,
        captions: false,
        playbackRates: () => [
          { label: this.$q.i18n.media.ratePoint5, value: 0.5 },
          { label: this.$q.i18n.media.rateNormal, value: 1 },
          { label: this.$q.i18n.media.rate1Point5, value: 1.5 },
          { label: this.$q.i18n.media.rate2, value: 2 }
        ],
        playbackRate: 1,
        trackLanguage: this.$q.i18n.media.trackLanguageOff,
        showBigPlayButton: true
      },
      allEvents: [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'interruptbegin',
        'interruptend',
        'loadeddata',
        'loadedmetadata',
        'loadedstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'timeupdate',
        'volumechange',
        'waiting'
      ],
      settingsPopover: false
    }
  },

  created () {
    document.body.addEventListener('mousemove', this.__mouseMoveAction, false)
    // document.body.addEventListener('mouseup', this.__mouseUpAction, false)
  },

  mounted () {
    this.__init()
  },

  beforeDestroy () {
    document.body.removeEventListener('mousemove', this.__mouseMoveAction)
    // document.body.removeEventListener('mouseup', this.__mouseUpAction)

    this.__removeSourceEventListeners()
    this.__removeMediaEventListeners()
  },

  computed: {
    classes () {
      return {
        'q-media--fullwindow': this.state.fullScreen
      }
    },
    style () {
      return {
        backgroundColor: this.backgroundColor
      }
    },
    videoWidth () {
      if (this.$el) {
        const width = this.$el.getBoundingClientRect().width
        return width
      }
      return 0
    },
    volumeIcon () {
      if (this.state.volume > 1 && this.state.volume < 70 && !this.state.muted) {
        return 'volume_down'
      }
      else if (this.state.volume > 70 && !this.state.muted) {
        return 'volume_up'
      }
      else {
        return 'volume_off'
      }
    },
    selectTracksLanguageList () {
      let tracksList = []
      // provide option to turn subtitles/captions/chapters off
      let track = {}
      track.label = this.$q.i18n.media.trackLanguageOff
      track.value = 'off'
      tracksList.push(track)
      for (let index = 0; index < this.tracks.length; ++index) {
        let track = {}
        track.label = track.value = this.tracks[index].label
        tracksList.push(track)
      }
      return tracksList
    }
  },

  watch: {
    showBigPlayButton () {
      this.__updateBigPlayButton()
    },
    volume () {
      this.__updateVolume()
    },
    muted () {
      this.__updateMuted()
    },
    trackLanguage () {
      this.__updateTrackLanguage()
    },
    playbackRates () {
      this.__updatePlaybackRates()
    },
    plybackRate () {
      this.__updatePlaybackRate()
    },
    '$q.fullscreen.isActive' (val) {
      if (!val) {
        this.state.fullScreen = false
      }
    },
    'state.playbackRate' (val) {
      if (val && this.$media) {
        this.$media.playbackRate = parseFloat(val)
      }
    },
    'state.trackLanguage' (val) {
      this.toggleCaptions()
    }
  },

  methods: {
    showControls: function () {
      if (this.timer.hideControlsTimer) {
        clearTimeout(this.timer.hideControlsTimer)
        this.timer.hideControlsTimer = null
      }
      this.state.showControls = true
      if (this.controlsDisplayTime !== -1 && !this.mobileMode) {
        this.timer.hideControlsTimer = setTimeout(() => {
          if (!this.__hasPopover()) {
            this.state.showControls = false
            this.timer.hideControlsTimer = null
          }
          else {
            this.showControls()
          }
        }, this.controlsDisplayTime)
      }
    },
    hideControls: function () {
      if (this.timer.hideControlsTimer) {
        clearTimeout(this.timer.hideControlsTimer)
      }
      if (this.controlsDisplayTime !== -1) {
        this.state.showControls = false
      }
      this.timer.hideControlsTimer = null
    },
    toggleControls: function () {
      if (this.state.showControls) {
        this.hideControls()
      }
      else {
        this.showControls()
      }
    },
    toggleCaptions: function () {
      this.showCaptions(this.state.trackLanguage)
    },
    showCaptions: function (lang) {
      if (this.$media) {
        for (let index = 0; index < this.$media.textTracks.length; ++index) {
          if (this.$media.textTracks[index].label === lang) {
            this.$media.textTracks[index].mode = 'showing'
            this.$media.textTracks[index].oncuechange = this.__cueChanged
          }
          else {
            this.$media.textTracks[index].mode = 'hidden'
            this.$media.textTracks[index].oncuechange = null
          }
        }
      }
    },
    hideCaptions: function () {
      if (this.$media) {
        for (let index = 0; index < this.$media.textTracks.length; ++index) {
          this.$media.textTracks[index].mode = 'hidden'
        }
      }
    },
    play: function () {
      if (this.state.playReady) {
        this.state.playing = !this.state.playing
        if (this.state.playing) {
          this.state.showBigPlayButton = false
          this.$media.play()
          this.__mouseLeaveVideo()
        }
        else {
          this.$media.pause()
          this.state.showBigPlayButton = true
        }
      }
    },
    volumeMuted: function () {
      this.state.muted = !this.state.muted
      if (this.$media) {
        this.$media.muted = this.state.muted
      }
    },
    fullScreen: function () {
      // in fullscreen mode?
      if (this.state.fullScreen) {
        this.$q.fullscreen.exit()
      }
      else {
        this.$q.fullscreen.request()
      }
      this.state.fullScreen = !this.state.fullScreen
    },

    __init () {
      this.$media = this.$refs['video']
      // set big play button
      this.__updateBigPlayButton()
      // set the volume
      this.__updateVolume()
      // set muted
      this.__updateMuted()
      // set default track language
      this.__updateTrackLanguage()
      // set playback rates
      this.__updatePlaybackRates()
      // set playback rate default
      this.__updatePlaybackRate()
      // does user want cors?
      if (this.crossOrigin) {
        this.$media.setAttribute('crossorigin', this.crossOrigin)
      }
      // make sure "controls" is turned off
      this.$media.controls = false
      // get the default playback rate
      this.state.playbackRate = this.rate
      // set up event listeners on video
      this.__addMediaEventListeners()
      this.__addSourceEventListeners()
      this.toggleCaptions()
      // send player to parent, if they are interested
    },

    __addMediaEventListeners: function () {
      if (this.$media) {
        this.allEvents.forEach((event) => {
          this.$media.addEventListener(event, this.__mediaEventHandler)
        })
      }
    },
    __removeMediaEventListeners: function () {
      if (this.$media) {
        this.allEvents.forEach((event) => {
          this.$media.removeEventListener(event, this.__mediaEventHandler)
        })
      }
    },
    __addSourceEventListeners: function () {
      if (this.$media) {
        let sources = this.$media.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[index].addEventListener('error', this.__sourceEventHandler)
        }
      }
    },
    __removeSourceEventListeners: function () {
      if (this.$media) {
        let sources = this.$media.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[index].removeEventListener('error', this.__sourceEventHandler)
        }
      }
    },
    __sourceEventHandler: function (event) {
      const NETWORK_NO_SOURCE = 3
      if (this.$media && this.$media.networkState === NETWORK_NO_SOURCE) {
        this.state.errorText = 'Unable to load video'
      }
    },
    __mediaEventHandler: function (event) {
      if (event.type === 'abort') {

      }
      else if (event.type === 'canplay') {
        this.state.playReady = true
        this.__mouseEnterVideo()
        this.$emit('ready')
        // autoplay if set (we manage this)
        if (this.autoplay) {
          this.play()
        }
      }
      else if (event.type === 'canplaythrough') {
        this.state.playReady = true
      }
      else if (event.type === 'durationchange') {
        this.$emit('duration', this.$media.duration)
      }
      else if (event.type === 'emptied') {
      }
      else if (event.type === 'ended') {
        this.state.playing = false
        this.$emit('ended')
      }
      else if (event.type === 'error') {
        let error = this.$media.error
        this.$emit('error', error)
      }
      else if (event.type === 'interruptbegin') {
        console.log('interruptbegin')
      }
      else if (event.type === 'interruptend') {
        console.log('interruptend')
      }
      else if (event.type === 'loadeddata') {
        this.state.loading = false
        this.$emit('loaded')
      }
      else if (event.type === 'loadedmetadata') {
      }
      else if (event.type === 'loadedstart') {
      }
      else if (event.type === 'pause') {
        this.state.playing = false
        this.$emit('pause')
      }
      else if (event.type === 'play') {
      }
      else if (event.type === 'playing') {
        this.state.playing = true
        this.$emit('playing')
      }
      else if (event.type === 'progress') {
      }
      else if (event.type === 'ratechange') {
      }
      else if (event.type === 'seeked') {
      }
      else if (event.type === 'timeupdate') {
        const percent = this.$media.currentTime / this.$media.duration
        // console.log('percent', percent)
        this.state.videoPercent = Math.floor(percent * 100.0)
        this.state.durationTime = timeParse(this.$media.duration)
        this.state.remainingTime = timeParse(this.$media.duration - this.$media.currentTime)
        this.state.displayTime = timeParse(this.$media.currentTime)
        this.$emit('timeupdate', this.$media.currentTime, this.$media.duration)
      }
      else if (event.type === 'volumechange') {
      }
      else if (event.type === 'waiting') {
        this.emit('waiting')
      }
    },

    // for future functionality
    __cueChanged: function (data) {
    },

    __checkCursor () {
      if (this.state.inFullscreen && this.state.playing && !this.state.showControls) {
        this.$el.classList.remove('cursor-inherit')
        this.$el.classList.add('cursor-none')
      }
      else {
        this.$el.classList.remove('cursor-none')
        this.$el.classList.add('cursor-inherit')
      }
    },

    __adjustMenu () {
      const qmenu = this.$refs['menu']
      if (qmenu) {
        setTimeout(() => {
          qmenu.updatePosition()
        }, 350)
      }
    },

    __videoClick () {
      if (this.mobileMode) {
        this.toggleControls()
      }
      else {
        this.play()
      }
    },
    __bigButtonClick: function () {
      if (this.mobileMode) {
        this.hideControls()
      }
      this.play()
    },
    __mouseEnterVideo: function (e) {
      if (!this.mobileMode) {
        this.showControls()
      }
    },
    __mouseLeaveVideo: function (e) {
      if (!this.mobileMode) {
        this.hideControls()
      }
    },
    __mouseMoveAction: function (e) {
      if (!this.mobileMode) {
        this.__showControlsIfValid(e)
      }
    },
    __mouseUpAction: function (e) {
    },
    __showControlsIfValid: function (e) {
      if (this.__hasPopover()) {
        this.showControls()
        return true
      }
      const x = getMousePosition(e, 'x')
      const y = getMousePosition(e, 'y')
      const pos = this.$el.getBoundingClientRect()
      if (!pos) return false
      if (x > pos.left && x < pos.left + pos.width) {
        if (y > pos.top + pos.height * 0.6 && y < pos.top + pos.height) {
          this.showControls()
          return true
        }
      }
      return false
    },
    __videoPercentChanged: function (val) {
      if (this.$media && val && val > 0 && val <= 100) {
        let currentTime = parseFloat(this.$media.duration / (100.0 / val))
        if (isNaN(currentTime)) {
          // usually video not loaded
          return
        }
        if (currentTime > this.$media.duration) {
          currentTime = this.$media.duration
        }
        if (currentTime < 0) {
          currentTime = 0
        }
        this.$media.currentTime = currentTime
      }
    },
    __volumePercentChanged: function (val) {
      if (this.$media) {
        this.$media.volume = parseFloat(val / 100.0)
      }
    },
    __trackLanguageChanged: function (language) {
      this.state.trackLanguage = language
    },
    __playbackRateChanged: function (rate) {
      this.state.playbackRate = rate
    },
    __hasPopover: function () {
      return this.settingsPopover
    },
    __updateBigPlayButton: function () {
      this.state.showBigPlayButton = this.showBigPlayButton
    },
    __updateVolume: function () {
      this.state.volume = this.volume
    },
    __updateMuted: function () {
      this.state.muted = this.muted
    },
    __updateTrackLanguage: function () {
      this.state.trackLanguage = this.trackLanguage || this.$q.i18n.media.trackLanguageOff
    },
    __updatePlaybackRates: function () {
      if (this.playbackRates.length > 0) {
        this.state.playbackRates = [...this.playbackRates]
      }
    },
    __updatePlaybackRate: function () {
      this.state.playbackRate = this.playbackRate
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-media col-12',
      class: this.classes,
      style: this.style,
      on: {
        mousemove: this.__mouseEnterVideo,
        mouseenter: this.__mouseEnterVideo,
        mouseleave: this.__mouseLeaveVideo
      }
    }, [
      h('video', {
        ref: 'video',
        staticClass: 'row q-media__video',
        domProps: {
          poster: this.poster,
          preload: 'auto'
        }
      }, [
        this.sources.length && this.sources.map((source) => {
          return h('source', {
            domProps: {
              key: source.src + ':' + source.type,
              src: source.src,
              type: source.type
            }
          })
        }),
        this.tracks.length && this.tracks.map((track) => {
          return h('track', {
            domProps: {
              key: track.src + ':' + track.kind,
              src: track.src,
              kind: track.kind,
              label: track.label,
              srclang: track.srclang
            }
          })
        }),
        h('p', this.$q.i18n.media.oldBrowser, this.$slots.oldbrowser)
      ]),

      h('div', {
        staticClass: 'q-media__hidden-window',
        on: {
          click: this.__videoClick
        }
      }, [
        h('div', this.$slots.overlay)
      ]),

      this.state.errorText && h('div', {
        staticClass: 'q-media__error-window'
      }, [
        h('div', this.state.errorText, this.$slots.errorWindow)
      ]),

      h(QSlideTransition, {
      }, [
        this.state.showControls && h('div', {
          staticClass: 'q-media__controls__container'
        }, [
          h('div', {
            staticClass: 'q-media__controls__container--top row col items-center justify-between'
          }, [
            h('span', {
              staticClass: 'q-media__controls--video-time-text'
            }, this.state.displayTime),
            h(QSlider, {
              staticClass: 'col',
              style: {
                width: '100%',
                margin: '0 0.5rem'
              },
              props: {
                value: this.state.videoPercent,
                color: this.controlsColor,
                min: 0,
                max: 100,
                disable: !this.state.playReady
              },
              on: {
                input: this.__videoPercentChanged
              }
            }),
            h('span', {
              staticClass: 'q-media__controls--video-time-text'
            }, this.state.durationTime)
          ]),
          h('div', {
            staticClass: 'q-media__controls__container--bottom row col items-center justify-between'
          }, [
            h('div', {
              staticClass: 'row col'
            }, [
              h('div', [
                h(QBtn, {
                  staticClass: 'q-media__controls--button',
                  props: {
                    icon: this.state.playing ? 'pause' : 'play_arrow',
                    textColor: this.controlsColor,
                    disable: !this.state.playReady
                  },
                  on: {
                    click: this.play
                  }
                }, [
                  this.showTooltips && this.state.playing && h(QTooltip, this.$q.i18n.media.pause),
                  this.showTooltips && !this.state.playing && this.state.playReady && h(QTooltip, this.$q.i18n.media.play)
                ]),
                this.showTooltips && !this.state.playReady && h(QTooltip, this.$q.i18n.media.waitingVideo)
              ]),
              h(QBtn, {
                staticClass: 'q-media__controls--button',
                props: {
                  icon: this.volumeIcon,
                  textColor: this.controlsColor,
                  disable: !this.state.playReady
                },
                on: {
                  click: this.volumeMuted
                }
              }, [
                this.showTooltips && !this.state.muted && h(QTooltip, this.$q.i18n.media.mute),
                this.showTooltips && this.state.muted && h(QTooltip, this.$q.i18n.media.unmute)
              ]),
              h(QSlider, {
                staticClass: 'col',
                style: {
                  width: '25%',
                  margin: '0 0.5rem',
                  minWidth: '50px',
                  maxWidth: '200px'
                },
                props: {
                  value: this.state.volume,
                  color: this.controlsColor,
                  min: 0,
                  max: 100,
                  disable: !this.state.playReady || this.state.muted
                },
                on: {
                  input: this.__volumePercentChanged
                }
              })
            ]),
            h('div', [
              h(QBtn, {
                staticClass: 'q-media__controls--button',
                props: {
                  icon: 'settings',
                  textColor: this.controlsColor,
                  disable: !this.state.playReady
                },
                on: {
                  // TODO: Jeff
                  // need click.prevent
                  // click: this.settingsPopover = !this.settingsPopover
                }
              }, [
                this.showTooltips && h(QTooltip, this.$q.i18n.media.settings),
                h(QMenu, {
                  props: {
                    value: this.settingsPopover,
                    anchor: 'top right',
                    self: 'bottom right'
                  }
                }, [
                  h(QList, {
                    props: {
                      highlight: true,
                      dense: true,
                      bordered: true
                    }
                  })
                ], [
                  this.state.playbackRates.length && h(QExpansionItem, {
                    props: {
                      expandSeparator: true,
                      menuInset: true,
                      icon: 'directions_run',
                      label: this.$q.i18n.media.speed
                      // caption: 'something...'
                    }
                  }),
                  this.selectTracksLanguageList.length > 1 && h(QExpansionItem, {
                    props: {
                      expandSeparator: true,
                      menuInset: true,
                      icon: 'closed_caption',
                      label: this.$q.i18n.media.language
                      // caption: 'something...'
                    }
                  })
                ])
              ]),
              h(QBtn, {
                staticClass: 'q-media__controls--button',
                props: {
                  icon: 'fullscreen',
                  textColor: this.controlsColor,
                  disable: !this.state.playReady
                },
                on: {
                  // TODO: Jeff
                  // needs to be click.prevent
                  click: this.fullScreen
                }
              }, [
                this.showTooltips && h(QTooltip, this.$q.i18n.media.fullscreen)
              ])
            ])
          ])

        ])
      ], this.$slots.controls),

      this.showSpinner && this.state.loading && !this.state.playReady && !this.state.errorText && h('div', {
        staticClass: 'q-media__loading--container'
      }, [
        h(QSpinner, {
          props: {
            size: '3rem'
          }
        })
      ], this.$slots.spinner),

      this.showBigPlayButton && this.state.playReady && !this.state.playing && h('div', {
        staticClass: 'q-media__big-button--container'
      }, [
        h(QIcon, {
          props: {
            name: 'play_arrow',
            size: '3rem'
          },
          on: {
            // TODO: Jeff
            // need click.native.prevent
            click: this.__bigButtonClick
          }
        })
      ])
    ])
  }
})
