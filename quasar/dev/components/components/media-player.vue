<template>
  <div>
    <div class="q-layout-padding">
      <p>This page is intended to test multiple scenarios of QMediaPlayer.</p>

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
  </div>
</template>

<script>
export default {
  name: 'MediaPlayer',

  data () {
    return {
      video: {
        poster: 'statics/media/TearsOfSteel/TearsOfSteel.jpeg',
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
      }
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
