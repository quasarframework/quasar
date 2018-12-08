import Vue from 'vue'

import QSlider from '../slider/QSlider'
import QBtn from '../btn/QBtn'
import QTooltip from '../tooltip/QTooltip'
import QMenu from '../menu/QMenu.js'
import QExpansionItem from '../list/QExpansionItem'
import QList from '../list/QList.js'
import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection'
import QIcon from '../icon/QIcon'
import QSpinner from '../spinner/QSpinner'

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
    mobileMode: Boolean,
    sources: {
      type: Array,
      default: () => []
    },
    poster: {
      type: String,
      default: ''
    },
    tracks: {
      type: Array,
      default: () => []
    },
    dense: Boolean,
    autoplay: Boolean,
    crossOrigin: {
      type: [String, null],
      default: null,
      validator: v => [null, 'anonymous', 'use-credentials'].includes(v)
    },
    volume: {
      type: Number,
      default: 60,
      validator: v => v >= 0 && v <= 100
    },
    preload: {
      type: String,
      default: 'metadata',
      validator: v => ['none', 'metadata', 'auto'].includes(v)
    },
    muted: Boolean,
    trackLanguage: {
      type: String,
      default: 'off' // value for 'Off'
    },
    // when i18n is done
    // showTooltips: {
    //   type: Boolean,
    //   required: false,
    //   default: false
    // },
    showBigPlayButton: {
      type: Boolean,
      default: true
    },
    showSpinner: {
      type: Boolean,
      default: true
    },
    controlsDisplayTime: {
      type: Number,
      default: 2000
    },
    playbackRates: Array,
    // initial playback rate
    playbackRate: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: 'white'
    },
    backgroundColor: {
      type: String,
      default: 'black'
    },
    dark: Boolean,
    radius: {
      type: [Number, String],
      default: 0
    }
  },

  data () {
    return {
      showTooltips: false, // remove when i18n is done
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
        currentTime: 0.01,
        duration: 1,
        durationTime: '00:00',
        remainingTime: '00:00',
        displayTime: '00:00',
        inFullscreen: false,
        loading: true,
        playReady: false,
        playing: false,
        playbackRates: [
          { label: this.$q.i18n.media.ratePoint5, value: 0.5 },
          { label: this.$q.i18n.media.rateNormal, value: 1 },
          { label: this.$q.i18n.media.rate1Point5, value: 1.5 },
          { label: this.$q.i18n.media.rate2, value: 2 }
        ],
        playbackRate: 1,
        trackLanguage: this.$q.i18n.media.trackLanguageOff,
        showBigPlayButton: true,
        metadataLoaded: false
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
      settingsMenuVisible: false
    }
  },

  created () {
    document.body.addEventListener('mousemove', this.__mouseMoveAction, false)
  },

  mounted () {
    this.__init()
  },

  beforeDestroy () {
    document.body.removeEventListener('mousemove', this.__mouseMoveAction)

    this.__removeSourceEventListeners()
    this.__removeMediaEventListeners()

    // no memory leaks
    this.__removeTracks()
    this.__removeSources()
    this.$media = null
  },

  computed: {
    classes () {
      return {
        'q-media--fullscreen': this.state.inFullscreen
      }
    },
    videoControlsClasses () {
      return {
        'q-media__controls__container--dense': (this.state.showControls || this.mobileMode) && this.dense,
        'q-media__controls__container--standard': (this.state.showControls || this.mobileMode) && !this.dense,
        'q-media__controls__container--hidden': !this.state.showControls
      }
    },
    audioControlsClasses () {
      return {
        'q-media__controls__container--dense': this.dense,
        'q-media__controls__container--standard': !this.dense
      }
    },
    videoWidth () {
      if (this.$el) {
        return this.$el.getBoundingClientRect().width
      }
      return 0
    },
    volumeIcon () {
      if (this.state.volume > 1 && this.state.volume < 70 && !this.state.muted) {
        return this.$q.icon.mediaPlayer.volumeDown
      }
      else if (this.state.volume > 70 && !this.state.muted) {
        return this.$q.icon.mediaPlayer.volumeUp
      }
      else {
        return this.$q.icon.mediaPlayer.volumeOff
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
    },
    isAudio () {
      return this.type === 'audio'
    },
    isVideo () {
      return this.type === 'video'
    }
  },

  watch: {
    poster () {
      this.__updatePoster()
    },
    sources: {
      handler () {
        this.__updateSources()
      },
      deep: true
    },
    tracks: {
      handler () {
        this.__updateTracks()
      },
      deep: true
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
    showBigPlayButton () {
      this.__updateBigPlayButton()
    },
    playbackRates () {
      this.__updatePlaybackRates()
    },
    playbackRate () {
      this.__updatePlaybackRate()
    },
    '$q.fullscreen.isActive' (val) {
      // user presses F11 to exit fullscreen
      if (!val && this.isVideo && this.state.inFullscreen) {
        this.state.inFullscreen = false
        this.$q.fullscreen.exit()
        document.body.classList.remove('q-body--fullscreen-mixin')
      }
    },
    'state.playbackRate' (val) {
      if (val && this.$media) {
        this.$media.playbackRate = parseFloat(val)
        this.$emit('playbackRate', val)
      }
    },
    'state.trackLanguage' (val) {
      this.__toggleCaptions()
      this.$emit('trackLanguage', val)
    },
    'state.showControls' (val) {
      if (this.isVideo) {
        this.$emit('showControls', val)
      }
    },
    'state.volume' (val) {
      if (this.$media) {
        let volume = parseFloat(val / 100.0)
        if (this.$media.volume !== volume) {
          this.$media.volume = volume
          this.$emit('volume', val)
        }
      }
    },
    'state.muted' (val) {
      this.$emit('muted', val)
    },
    'state.currentTime' (val) {
      if (this.$media && this.state.playReady) {
        this.state.remainingTime = timeParse(this.$media.duration - this.$media.currentTime)
        this.state.displayTime = timeParse(this.$media.currentTime)
      }
    }
  },

  methods: {
    showControls () {
      if (this.timer.hideControlsTimer) {
        clearTimeout(this.timer.hideControlsTimer)
        this.timer.hideControlsTimer = null
      }
      this.state.showControls = true
      this.__checkCursor()
      if (this.controlsDisplayTime !== -1 && !this.mobileMode && this.isVideo) {
        this.timer.hideControlsTimer = setTimeout(() => {
          if (!this.__showingMenu()) {
            this.state.showControls = false
            this.timer.hideControlsTimer = null
            this.__checkCursor()
          }
          else {
            this.showControls()
          }
        }, this.controlsDisplayTime)
      }
    },
    hideControls () {
      if (this.timer.hideControlsTimer) {
        clearTimeout(this.timer.hideControlsTimer)
      }
      if (this.controlsDisplayTime !== -1) {
        this.state.showControls = false
        this.__checkCursor()
      }
      this.timer.hideControlsTimer = null
    },
    toggleControls () {
      if (this.state.showControls) {
        this.hideControls()
      }
      else {
        this.showControls()
      }
    },
    __reset () {
      if (this.timer.hideControlsTimer) {
        clearTimeout(this.timer.hideControlsTimer)
      }
      this.timer.hideControlsTimer = null
      this.state.errorText = null
      this.state.currentTime = 0.01
      this.state.durationTime = '00:00'
      this.state.remainingTime = '00:00'
      this.state.displayTime = '00:00'
      this.state.duration = 1
      this.state.playReady = false
      this.state.playing = false
      this.state.loading = true
      this.state.metadataLoaded = false
      this.__updateTrackLanguage()
      this.showControls()
    },
    __toggleCaptions () {
      this.__showCaptions(this.state.trackLanguage)
    },
    __showCaptions (lang) {
      if (this.$media && this.isVideo) {
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
    togglePlay () {
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
    toggleMuted () {
      this.state.muted = !this.state.muted
      if (this.$media) {
        this.$media.muted = this.state.muted
      }
    },
    toggleFullscreen () {
      if (this.isVideo) {
        this.state.inFullscreen = !this.state.inFullscreen
        if (this.state.inFullscreen) {
          this.$q.fullscreen.request()
          document.body.classList.add('q-body--fullscreen-mixin')
        }
        else {
          this.$q.fullscreen.exit()
          document.body.classList.remove('q-body--fullscreen-mixin')
        }
        this.$emit('fullscreen', this.state.inFullscreen)
      }
    },
    setCurrentTime (seconds) {
      if (this.state.playReady) {
        if (seconds >= 0 && seconds <= this.$media.duration) {
          this.state.currentTime = Math.floor(seconds)
          this.$media.currentTime = Math.floor(seconds)
        }
      }
    },
    setVolume (volume) {
      if (volume >= 100 && volume <= 100) {
        this.state.volume = volume
      }
    },

    __init () {
      this.$media = this.$refs['media']
      // set default track language
      this.__updateTrackLanguage()
      this.__updateSources()
      this.__updateTracks()
      // set big play button
      this.__updateBigPlayButton()
      // set the volume
      this.__updateVolume()
      // set muted
      this.__updateMuted()
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
      // set up event listeners on video
      this.__addMediaEventListeners()
      this.__addSourceEventListeners()
      this.__toggleCaptions()
      // send player to parent, if they are interested
    },

    __addMediaEventListeners () {
      if (this.$media) {
        this.allEvents.forEach((event) => {
          this.$media.addEventListener(event, this.__mediaEventHandler)
        })
      }
    },
    __removeMediaEventListeners () {
      if (this.$media) {
        this.allEvents.forEach((event) => {
          this.$media.removeEventListener(event, this.__mediaEventHandler)
        })
      }
    },
    __addSourceEventListeners () {
      if (this.$media) {
        let sources = this.$media.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[index].addEventListener('error', this.__sourceEventHandler)
        }
      }
    },
    __removeSourceEventListeners () {
      if (this.$media) {
        let sources = this.$media.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[index].removeEventListener('error', this.__sourceEventHandler)
        }
      }
    },
    __sourceEventHandler (event) {
      const NETWORK_NO_SOURCE = 3
      if (this.$media && this.$media.networkState === NETWORK_NO_SOURCE) {
        this.state.errorText = this.isVideo ? this.$q.i18n.media.noLoadVideo : this.$q.i18n.media.noLoadAudio
      }
    },
    __mediaEventHandler (event) {
      if (event.type === 'abort') {

      }
      else if (event.type === 'canplay') {
        this.state.playReady = true
        this.__mouseEnterVideo()
        this.$emit('ready')
        // autoplay if set (we manage this)
        if (this.autoplay) {
          this.togglePlay()
        }
      }
      else if (event.type === 'canplaythrough') {
        // console.log('canplaythrough')
      }
      else if (event.type === 'durationchange') {
        this.state.duration = Math.floor(this.$media.duration)
        this.state.durationTime = timeParse(this.$media.duration)
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
        // tracks can only be programatically added after 'loadedmetadata' event
        this.state.metadataLoaded = true
        this.__updateTracks()
        // set default track language
        this.__updateTrackLanguage()
        this.__toggleCaptions()
      }
      else if (event.type === 'loadedstart') {
      }
      else if (event.type === 'pause') {
        this.state.playing = false
        this.$emit('paused')
      }
      else if (event.type === 'play') {
        // console.log('play')
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
        this.state.currentTime = Math.floor(this.$media.currentTime)
        this.$emit('timeupdate', this.$media.currentTime, this.state.remainingTime)
      }
      else if (event.type === 'volumechange') {
      }
      else if (event.type === 'waiting') {
        this.$emit('waiting')
      }
    },

    // for future functionality
    __cueChanged (data) {
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
        this.togglePlay()
      }
    },
    __bigButtonClick () {
      if (this.mobileMode) {
        this.hideControls()
      }
      this.togglePlay()
    },
    __settingsMenuShowing (val) {
      this.settingsMenuVisible = val
    },
    __mouseEnterVideo (e) {
      if (!this.mobileMode && !this.isAudio) {
        this.showControls()
      }
    },
    __mouseLeaveVideo (e) {
      if (!this.mobileMode && !this.isAudio) {
        this.hideControls()
      }
    },
    __mouseMoveAction (e) {
      if (!this.mobileMode && !this.isAudio) {
        this.__showControlsIfValid(e)
      }
    },
    __showControlsIfValid (e) {
      if (this.__showingMenu()) {
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
    __videoCurrentTimeChanged (val) {
      if (this.$media && this.$media.duration && val && val > 0 && val <= this.state.duration) {
        if (this.$media.currentTime !== val) {
          this.state.currentTime = val
          this.$media.currentTime = val
        }
      }
    },
    __volumePercentChanged (val) {
      this.state.volume = val
    },
    __trackLanguageChanged (language) {
      if (this.state.trackLanguage !== language) {
        this.state.trackLanguage = language
      }
    },
    __playbackRateChanged (rate) {
      if (this.state.playbackRate !== rate) {
        this.state.playbackRate = rate
      }
    },
    __showingMenu () {
      return this.settingsMenuVisible
    },
    __updateBigPlayButton () {
      if (this.state.showBigPlayButton !== this.showBigPlayButton) {
        this.state.showBigPlayButton = this.showBigPlayButton
      }
    },
    __updateVolume () {
      if (this.state.volume !== this.volume) {
        this.state.volume = this.volume
      }
    },
    __updateMuted () {
      if (this.state.muted !== this.muted) {
        this.state.muted = this.muted
        if (this.$media) {
          this.$media.muted = this.state.muted
        }
      }
    },
    __updateTrackLanguage () {
      if (this.state.trackLanguage !== this.trackLanguage || this.$q.i18n.media.trackLanguageOff) {
        this.state.trackLanguage = this.trackLanguage || this.$q.i18n.media.trackLanguageOff
      }
    },
    __updatePlaybackRates () {
      if (this.playbackRates && this.playbackRates.length > 0) {
        this.state.playbackRates = [...this.playbackRates]
      }
    },
    __updatePlaybackRate () {
      if (this.state.playbackRate !== this.playbackRate) {
        this.state.playbackRate = this.playbackRate
      }
    },

    __updateSources () {
      this.__removeSources()
      this.__addSources()
    },

    __removeSources () {
      if (this.$media) {
        this.__removeSourceEventListeners()
        // player must not be running
        this.$media.pause()
        this.$media.src = ''
        this.$media.currentTime = 0
        let childNodes = this.$media.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[index].tagName === 'SOURCE') {
            this.$media.removeChild(childNodes[index])
          }
        }
        this.$media.load()
      }
    },

    __addSources () {
      if (this.$media) {
        let loaded = false
        this.sources.forEach((source) => {
          let s = document.createElement('SOURCE')
          s.src = source.src ? source.src : ''
          s.type = source.type ? source.type : ''
          this.$media.appendChild(s)
          if (!loaded && source.src) {
            this.$media.src = source.src
            loaded = true
          }
        })
        this.__reset()
        this.__addSourceEventListeners()
        this.$media.load()
      }
    },

    __updateTracks () {
      this.__removeTracks()
      this.__addTracks()
    },

    __removeTracks () {
      if (this.$media) {
        let childNodes = this.$media.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[index].tagName === 'TRACK') {
            this.$media.removeChild(childNodes[index])
          }
        }
      }
    },

    __addTracks () {
      // only add tracks to video
      if (this.isVideo && this.$media) {
        this.tracks.forEach((track) => {
          let t = document.createElement('TRACK')
          t.kind = track.kind ? track.kind : ''
          t.label = track.label ? track.label : ''
          t.src = track.src ? track.src : ''
          t.srclang = track.srclang ? track.srclang : ''
          this.$media.appendChild(t)
        })
        this.$nextTick(() => {
          this.__toggleCaptions()
        })
      }
    },

    __updatePoster () {
      if (this.$media) {
        this.$media.poster = this.poster
      }
    },

    __renderVideo (h) {
      return h('video', {
        ref: 'media',
        staticClass: 'q-media--player',
        attrs: {
          poster: this.poster,
          preload: this.preload
        }
      }, [
        // this.sources.length && this.__renderSources(h),
        // this.tracks.length && this.__renderTracks(h),
        this.isVideo && h('p', this.$q.i18n.media.oldBrowserVideo, this.$slots.oldbrowser)
      ])
    },
    __renderAudio (h) {
      // This is on purpose (not using audio tag).
      // The video tag can also play audio and works if dynamically
      // switching between video and audo on the same component.
      return h('video', {
        ref: 'media',
        staticClass: 'q-media--player',
        attrs: {
          preload: this.preload
        }
      }, [
        // this.sources.length && this.__renderSources(h),
        this.isAudio && h('p', this.$q.i18n.media.oldBrowserAudio, this.$slots.oldbrowser)
      ])
    },
    __renderSources (h) {
      return this.sources.map((source) => {
        return h('source', {
          attrs: {
            key: source.src + ':' + source.type,
            src: source.src,
            type: source.type
          }
        })
      })
    },
    __renderTracks (h) {
      return this.tracks.map((track) => {
        return h('track', {
          attrs: {
            key: track.src + ':' + track.kind,
            src: track.src,
            kind: track.kind,
            label: track.label,
            srclang: track.srclang
          }
        })
      })
    },
    __renderOverlayWindow (h) {
      return h('div', {
        staticClass: 'q-media__overlay-window',
        on: {
          click: this.__videoClick
        }
      }, [
        h('div', this.$slots.overlay)
      ])
    },
    __renderErrorWindow (h) {
      return h('div', {
        staticClass: 'q-media__error-window'
      }, [
        h('div', this.state.errorText)
      ], this.$slots.errorWindow)
    },
    __renderPlayButton (h) {
      return h(QBtn, {
        staticClass: 'q-media__controls--button',
        props: {
          icon: this.state.playing ? this.$q.icon.mediaPlayer.pause : this.$q.icon.mediaPlayer.play,
          textColor: this.color,
          size: '1rem',
          disable: !this.state.playReady,
          flat: true
        },
        on: {
          click: this.togglePlay
        }
      }, [
        this.showTooltips && this.state.playing && h(QTooltip, this.$q.i18n.media.pause),
        this.showTooltips && !this.state.playing && this.state.playReady && h(QTooltip, this.$q.i18n.media.play)
      ], this.$slots.play)
    },
    __renderVideoControls (h) {
      return h('div', {
        ref: 'controls',
        staticClass: 'q-media__controls__container',
        class: this.videoControlsClasses
      }, [
        // dense
        this.dense && h('div', {
          staticClass: 'q-media__controls__container--row row col content-start items-center'
        }, [
          h('div', [
            this.__renderPlayButton(h),
            this.showTooltips && !this.state.playReady && h(QTooltip, this.$q.i18n.media.waitingVideo)
          ]),
          this.__renderVolumeButton(h),
          this.__renderVolumeSlider(h),
          this.__renderDisplayTime(h),
          this.__renderCurrentTimeSlider(h),
          this.__renderDurationTime(h),
          this.__renderSettingsButton(h),
          this.__renderFullscreenButton(h)
        ]),
        // sparse
        !this.dense && h('div', {
          staticClass: 'q-media__controls__container--row row col items-center justify-between'
        }, [
          this.__renderDisplayTime(h),
          this.__renderCurrentTimeSlider(h),
          this.__renderDurationTime(h)
        ]),
        !this.dense && h('div', {
          staticClass: 'q-media__controls__container--row row col content-start items-center'
        }, [
          h('div', {
            staticClass: 'row col'
          }, [
            h('div', [
              this.__renderPlayButton(h),
              this.showTooltips && !this.state.playReady && h(QTooltip, this.$q.i18n.media.waitingVideo)
            ]),
            this.__renderVolumeButton(h),
            this.__renderVolumeSlider(h)
          ]),
          h('div', [
            this.__renderSettingsButton(h),
            this.__renderFullscreenButton(h)
          ])
        ])
      ], this.$slots.controls)
    },
    __renderAudioControls (h) {
      return h('div', {
        ref: 'controls',
        staticClass: 'q-media__controls__container',
        class: this.audioControlsClasses
      }, [
        this.dense && h('div', {
          staticClass: 'q-media__controls__container--row row col content-start items-center'
        }, [
          // dense
          h('div', [
            this.__renderPlayButton(h),
            this.showTooltips && !this.state.playReady && h(QTooltip, this.$q.i18n.media.waitingAudio)
          ]),
          this.__renderVolumeButton(h),
          this.__renderVolumeSlider(h),
          this.__renderDisplayTime(h),
          this.__renderCurrentTimeSlider(h),
          this.__renderDurationTime(h)
        ]),
        // sparse
        !this.dense && h('div', {
          staticClass: 'q-media__controls__container--row row col items-center justify-between'
        }, [
          this.__renderDisplayTime(h),
          this.__renderCurrentTimeSlider(h),
          this.__renderDurationTime(h)
        ]),
        !this.dense && h('div', {
          staticClass: 'q-media__controls__container--row row col content-start items-center'
        }, [
          h('div', [
            this.__renderPlayButton(h),
            this.showTooltips && !this.state.playReady && h(QTooltip, this.$q.i18n.media.waitingAudio)
          ]),
          this.__renderVolumeButton(h),
          this.__renderVolumeSlider(h)
        ])
      ], this.$slots.controls)
    },
    __renderVolumeButton (h) {
      return h(QBtn, {
        staticClass: 'q-media__controls--button',
        props: {
          icon: this.volumeIcon,
          textColor: this.color,
          size: '1rem',
          disable: !this.state.playReady,
          flat: true
        },
        on: {
          click: this.toggleMuted
        }
      }, [
        this.showTooltips && !this.state.muted && h(QTooltip, this.$q.i18n.media.mute),
        this.showTooltips && this.state.muted && h(QTooltip, this.$q.i18n.media.unmute)
      ], this.$slots.volume)
    },
    __renderVolumeSlider (h) {
      return h(QSlider, {
        staticClass: 'col',
        style: {
          width: '20%',
          margin: '0 0.5rem',
          minWidth: this.dense ? '20px' : '50px',
          maxWidth: this.dense ? '50px' : '200px'
        },
        props: {
          value: this.state.volume,
          color: this.color,
          dark: this.dark,
          min: 0,
          max: 100,
          disable: !this.state.playReady || this.state.muted
        },
        on: {
          input: this.__volumePercentChanged
        }
      }, this.$slots.volumeSlider)
    },
    __renderSettingsButton (h) {
      return h(QBtn, {
        staticClass: 'q-media__controls--button',
        props: {
          icon: this.$q.icon.mediaPlayer.settings,
          textColor: this.color,
          size: '1rem',
          disable: !this.state.playReady,
          flat: true
        }
      }, [
        this.showTooltips && !this.settingsMenuVisible && h(QTooltip, this.$q.i18n.media.settings),
        this.__renderSettingsMenu(h)
      ], this.$slots.settings)
    },
    __renderFullscreenButton (h) {
      return h(QBtn, {
        staticClass: 'q-media__controls--button',
        props: {
          icon: this.state.inFullscreen ? this.$q.icon.mediaPlayer.fullscreenExit : this.$q.icon.mediaPlayer.fullscreen,
          textColor: this.color,
          size: '1rem',
          disable: !this.state.playReady,
          flat: true
        },
        on: {
          click: this.toggleFullscreen
        }
      }, [
        this.showTooltips && h(QTooltip, this.$q.i18n.media.toggleFullscreen)
      ], this.$slots.fullscreen)
    },
    __renderLoader (h) {
      return h('div', {
        staticClass: this.isVideo ? 'q-media__loading--video' : 'q-media__loading--audio'
      }, [
        h(QSpinner, {
          props: {
            size: this.isVideo ? '3rem' : '1rem'
          }
        })
      ], this.$slots.spinner)
    },
    __renderBigPlayButton (h) {
      return h('div', {
        staticClass: 'q-media__big-button--container'
      }, [
        h(QIcon, {
          props: {
            name: this.$q.icon.mediaPlayer.bigPlayButton,
            size: '3rem'
          },
          on: {
            click: this.__bigButtonClick
          }
        })
      ], this.$slots.bigPlayButton)
    },
    __renderCurrentTimeSlider (h) {
      return h(QSlider, {
        staticClass: 'col',
        style: {
          width: '100%',
          margin: '0 0.5rem'
        },
        props: {
          value: this.state.currentTime,
          color: this.color,
          dark: this.dark,
          min: 0.01,
          max: this.state.duration ? this.state.duration : 1,
          disable: !this.state.playReady
        },
        on: {
          input: this.__videoCurrentTimeChanged
        }
      }, this.$slots.positionSlider)
    },
    __renderDisplayTime (h) {
      return h('span', {
        staticClass: 'q-media__controls--video-time-text' + ' text-' + this.color
      }, this.state.displayTime, this.$slots.displayTime)
    },
    __renderDurationTime (h) {
      return h('span', {
        staticClass: 'q-media__controls--video-time-text' + ' text-' + this.color
      }, this.state.durationTime, this.$slots.durationTime)
    },
    __renderSettingsMenu (h) {
      return h(QMenu, {
        ref: 'menu',
        props: {
          anchor: 'top right',
          self: 'bottom right'
        },
        on: {
          show: () => {
            this.__settingsMenuShowing(true)
          },
          hide: () => {
            this.__settingsMenuShowing(false)
          }
        }
      }, [
        this.state.playbackRates.length && h(QExpansionItem, {
          props: {
            group: 'settings-menu',
            expandSeparator: true,
            icon: this.$q.icon.mediaPlayer.speed,
            label: this.$q.i18n.media.speed,
            caption: this.$q.i18n.media.playbackRate
          },
          on: {
            show: this.__adjustMenu,
            hide: this.__adjustMenu
          }
        }, [
          h(QList, {
            props: {
              highlight: true
            }
          }, [
            this.state.playbackRates.map((rate) => {
              return h(QItem, {
                attrs: {
                  key: rate.value
                },
                props: {
                  clickable: true
                },
                on: {
                  click: () => {
                    this.__playbackRateChanged(rate.value)
                  }
                },
                directives: [
                  {
                    name: 'ripple',
                    value: true
                  },
                  {
                    name: 'close-menu',
                    value: true
                  }
                ]
              }, [
                h(QItemSection, {
                  props: {
                    avatar: true
                  }
                }, [
                  rate.value === this.state.playbackRate && h(QIcon, {
                    props: {
                      name: this.$q.icon.mediaPlayer.selected
                    }
                  })
                ]),
                h(QItemSection, rate.label)
              ])
            })
          ])
        ]),
        // first item is 'Off' and doesn't count unless more are added
        this.selectTracksLanguageList.length > 1 && h(QExpansionItem, {
          props: {
            group: 'settings-menu',
            expandSeparator: true,
            icon: this.$q.icon.mediaPlayer.language,
            label: this.$q.i18n.media.language
          },
          on: {
            show: this.__adjustMenu,
            hide: this.__adjustMenu
          }
        }, [
          h(QList, {
            props: {
              highlight: true
            }
          }, [
            this.selectTracksLanguageList.map((language) => {
              return h(QItem, {
                attrs: {
                  key: language.value
                },
                props: {
                  clickable: true
                },
                on: {
                  click: (event) => {
                    this.__trackLanguageChanged(language.value)
                  }
                },
                directives: [
                  {
                    name: 'ripple',
                    value: true
                  },
                  {
                    name: 'close-menu',
                    value: true
                  }
                ]
              }, [
                h(QItemSection, {
                  props: {
                    avatar: true
                  }
                }, [
                  language.value === this.state.trackLanguage && h(QIcon, {
                    props: {
                      name: this.$q.icon.mediaPlayer.selected
                    }
                  })
                ]),
                h(QItemSection, language.label)
              ])
            })
          ])
        ])
      ], this.$slots.settingsMenu)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-media col-12 bg-' + this.backgroundColor,
      class: this.classes,
      style: {
        borderRadius: !this.state.inFullscreen ? this.radius : 0,
        height: this.isVideo ? 'auto' : this.dense ? '2rem' : '4rem'
      },
      on: {
        mousemove: this.__mouseEnterVideo,
        mouseenter: this.__mouseEnterVideo,
        mouseleave: this.__mouseLeaveVideo
      }
    }, [
      this.isVideo && this.__renderVideo(h),
      this.isAudio && this.__renderAudio(h),
      this.__renderOverlayWindow(h),
      this.state.errorText && this.__renderErrorWindow(h),
      this.isVideo && !this.state.errorText && this.__renderVideoControls(h),
      this.isAudio && !this.state.errorText && this.__renderAudioControls(h),
      this.showSpinner && this.state.loading && !this.state.playReady && !this.state.errorText && this.__renderLoader(h),
      this.isVideo && this.showBigPlayButton && this.state.playReady && !this.state.playing && this.__renderBigPlayButton(h)
    ])
  }
})
