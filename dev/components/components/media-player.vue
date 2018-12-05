<template>
  <div>
    <div class="q-layout-padding">
      <p>This page is intended to test multiple scenarios of QMediaPlayer.</p>
      <p>Music courtesy of <a href="http://freemusicarchive.org/music/Dee_Yan-Key/years_and_years_ago/01--Dee_Yan-Key-Driving_Home" target="blank">Free Music Archive</a></p>
      <p style="text-align: center;">Videos and subtitles courtesy of <a href="https://mango.blender.org/download/" target="blank">Blender Organization</a>.<br>Let video play to end to see next one.</p>
    </div>

      <p class="caption">Invalid CORS (controls disabled); Shows error; Extra-Small fixed window (230px is smallest); No tooltips; Controls Time = 2s</p>
      <div class="container--flex container--extra-small">
        <q-media-player
          class="row"
          type="video"
          :sources="video.sources"
          :poster="video.poster"
          :tracks="video.tracks"
          cross-origin="use-credentials"
          :autoplay="false"
          :volume="60"
          :muted="false"
          track-language="Off"
          :show-tooltips="false"
          :options="video.options1">
          <template slot="error">
            <p class="q-video--no-video">To view this video please enable JavaScript and/or consider upgrading to a browser that supports HTML5 video.</p>
          </template>
        </q-media-player>
      </div>
      <p class="caption">Small fixed window; Default language French; No Big Play Button; No tooltips; Controls Time = 2s</p>
      <div class="container--flex container--small">
        <q-media-player
          type="video"
          :sources="video.sources"
          :poster="video.poster"
          :tracks="video.tracks"
          :autoplay="false"
          :volume="60"
          :muted="false"
          track-language="French"
          :show-tooltips="false"
          :show-big-play-button="false"
        >
          <template slot="error">
            <p class="q-video--no-video">To view this video please enable JavaScript and/or consider upgrading to a browser that supports HTML5 video.</p>
          </template>
        </q-media-player>
      </div>
      <p class="caption">Medium fixed window; Default language Spanish; No tooltips; Mobile Mode (window clicks toggle controls)</p>
      <div class="container--block container--medium">
        <q-media-player
          type="video"
          :sources="video.sources"
          :poster="video.poster"
          :tracks="video.tracks"
          :mobile-mode="true"
          :autoplay="false"
          :volume="60"
          :muted="false"
          track-language="French"
          :show-tooltips="false"
        >
          <template slot="error">
            <p class="q-video--no-video">To view this video please enable JavaScript and/or consider upgrading to a browser that supports HTML5 video.</p>
          </template>
        </q-media-player>
      </div>
      <p class="caption">Flex window (try adjusting browser window size); Default language English; Has tooltips; Controls Time = 4s; Overlay Slot</p>
      <div class="container--flex container--large">
        <q-media-player
          type="video"
          :sources="video.sources"
          :poster="video.poster"
          :tracks="video.tracks"
          :autoplay="false"
          :volume="60"
          :muted="false"
          track-language="English"
          :show-tooltips="true"
          :controls-display-time="4000"
        >
          <template slot="error">
            <p class="q-video--no-video">To view this video please enable JavaScript and/or consider upgrading to a browser that supports HTML5 video.</p>
          </template>
          <template slot="overlay">
            <div>
              <img
                src="statics/quasar-logo.png"
                style="width:30vw;max-width:50px; opacity: 0.25;"
              >
            </div>
          </template>
        </q-media-player>
      </div>

    </div>

    <div class="row" style="min-height: 4rem; max-width: 90vw;">
      <q-media-player
        :type="videoType ? 'video' : 'audio'"
        :dense="dense"
        :dark="dark"
        :background-color="darkbg ? 'black' : 'white'"
        :mobile-mode="mobileMode"
        :muted="muted"
        :radius="radius ? '1rem' : 0"
        :autoplay="autoPlay"
        :show-big-play-button="bigPlay"
        :sources="videoType ? video[videoIndex].sources : audio.sources"
        :poster="videoType ? video[videoIndex].poster : ''"
        :tracks="videoType ? video[videoIndex].tracks : []"
        track-language="English"
        @ended="onEnded"
      >
        <template v-if="overlay" slot="overlay">
          <div>
            <img
              src="statics/quasar-logo.png"
              style="width: 30vw; max-width: 50px; opacity: 0.25;"
            >
          </div>
        </template>
      </q-media-player>
    </div>

  </div>
</template>

<script>
export default {
  name: 'MediaPlayer',

  data () {
    return {
      darkbg: true,
      dark: false,
      dense: false,
      videoType: false,
      mobileMode: false,
      muted: false,
      bigPlay: true,
      radius: false,
      overlay: false,

      videoIndex: 0,
      autoPlay: false,
      sources: [],

      audio: {
        sources: [
          {
            src: 'http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/ToS-4k-1920.mov',
            type: 'video/mp4'
          }
          // {
          //   src: 'statics/TearsOfSteel/ToS-4k-1920.mov',
          //   type: 'video/mp4'
          // }
        ],
        tracks: [
          {
            src: 'statics/media/TearsOfSteel/TOS-en.vtt',
            kind: 'subtitles',
            srclang: 'en',
            label: 'English'
          },
          {
            src: 'statics/media/TearsOfSteel/TOS-de.vtt',
            kind: 'subtitles',
            srclang: 'de',
            label: 'German'
          },
          {
            src: 'statics/media/TearsOfSteel/TOS-es.vtt',
            kind: 'subtitles',
            srclang: 'es',
            label: 'Spanish'
          },
          {
            src: 'statics/media/TearsOfSteel/TOS-fr-Goofy.vtt',
            kind: 'subtitles',
            srclang: 'fr',
            label: 'French'
          },
          {
            src: 'statics/media/TearsOfSteel/TOS-it.vtt',
            kind: 'subtitles',
            srclang: 'it',
            label: 'Italian'
          },
          {
            src: 'statics/media/TearsOfSteel/TOS-nl.vtt',
            kind: 'subtitles',
            srclang: 'nl',
            label: 'Dutch'
          }
        ]
      },

      video: [
        {
          label: 'Tears of Steel',
          poster: 'statics/media/TearsOfSteel/TearsOfSteel.jpeg',
          sources: [
            {
              src: 'http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/ToS-4k-1920.mov',
              type: 'video/mp4'
            }
          ],
          tracks: [
            {
              src: 'statics/media/TearsOfSteel/TOS-en.vtt',
              kind: 'subtitles',
              srclang: 'en',
              label: 'English'
            },
            {
              src: 'statics/media/TearsOfSteel/TOS-de.vtt',
              kind: 'subtitles',
              srclang: 'de',
              label: 'German'
            },
            {
              src: 'statics/media/TearsOfSteel/TOS-es.vtt',
              kind: 'subtitles',
              srclang: 'es',
              label: 'Spanish'
            },
            {
              src: 'statics/media/TearsOfSteel/TOS-fr-Goofy.vtt',
              kind: 'subtitles',
              srclang: 'fr',
              label: 'French'
            },
            {
              src: 'statics/media/TearsOfSteel/TOS-it.vtt',
              kind: 'subtitles',
              srclang: 'it',
              label: 'Italian'
            },
            {
              src: 'statics/media/TearsOfSteel/TOS-nl.vtt',
              kind: 'subtitles',
              srclang: 'nl',
              label: 'Dutch'
            }
          ]
        },
        {
          label: 'Sintel',
          poster: 'statics/media/sintel/sintel-poster2.jpeg',
          sources: [
            {
              src: 'https://peach.themazzone.com/durian/movies/sintel-2048-surround.mp4',
              type: 'video/mp4'
            }
          ],
          tracks: [
            {
              src: 'statics/media/sintel/sintel-en.vtt',
              kind: 'subtitles',
              srclang: 'en',
              label: 'English'
            },
            {
              src: 'statics/media/sintel/sintel-de.vtt',
              kind: 'subtitles',
              srclang: 'de',
              label: 'Deutsch'
            },
            {
              src: 'statics/media/sintel/sintel-es.vtt',
              kind: 'subtitles',
              srclang: 'es',
              label: 'Español'
            },
            {
              src: 'statics/media/sintel/sintel-fr.vtt',
              kind: 'subtitles',
              srclang: 'fr',
              label: 'Français'
            },
            {
              src: 'statics/media/sintel/sintel-it.vtt',
              kind: 'subtitles',
              srclang: 'it',
              label: 'Italiano'
            },
            {
              src: 'statics/media/sintel/sintel-nl.vtt',
              kind: 'subtitles',
              srclang: 'nl',
              label: 'Nederlands'
            },
            {
              src: 'statics/media/sintel/sintel-pt.vtt',
              kind: 'subtitles',
              srclang: 'pt',
              label: 'Português'
            },
            {
              src: 'statics/media/sintel/sintel-pl.vtt',
              kind: 'subtitles',
              srclang: 'pl',
              label: 'Polski'
            },
            {
              src: 'statics/media/sintel/sintel-ru.vtt',
              kind: 'subtitles',
              srclang: 'ru',
              label: 'Russian'
            }
          ]
        }
      ]
    }
  },

  created () {
    this.setSource()
  },

  mounted () {
  },

  watch: {
    videoType (val) {
      this.setSource()
    }
  },

  methods: {
    setSource () {
      if (this.videoType) {
        this.sources = [...this.video[this.videoIndex].sources]
      }
      else {
        this.sources = [...this.audio.sources]
      }
    },
    onEnded () {
      if (this.videoIndex === 0) {
        this.videoIndex = 1
      }
      else {
        this.videoIndex = 0
      }
      this.setSource()
      this.autoPlay = true
    }
  }
}
</script>

<style>
.container--block {
  display: block;
  background: #FFF;
}
.container--flex {
  display: flex;
  background: #FFF;
}
/* This is the smallest width for the video window */
.container--extra-small {
  width: 230px;
  height: auto;
  margin: 5px;
}
.container--small {
  width: 350px;
  height: auto;
  margin: 5px;
}
.container--medium {
  width: 550px;
  height: auto;
  margin: 8px;
}
.container--large {
  width: 90vw;
  height: auto;
  margin: 10px;
}
</style>
