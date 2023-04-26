import QUploader from '../QUploader'

describe('Uploader API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): auto-upload', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): hide-upload-btn', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: content', () => {
      describe('(prop): label', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): no-thumbnails', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: state', () => {
      describe('(prop): disable', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): readonly', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): color', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): text-color', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): dark', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): square', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): flat', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): bordered', () => {
        it.skip(' ', () => {
          //
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): header', () => {
      it('renders correctly using the scope', () => {
        // Taken from ui/dev/src/pages/form/uploader.vue
        const headerSlot = `
<template #header="scope">
  <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
    <q-btn v-if="scope.queuedFiles.length !== 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat />
    <q-btn v-if="scope.uploadedFiles.length !== 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat />
    <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
    <div class="col">
      <div class="q-uploader__title">
        Upload your files
      </div>
      <div class="q-uploader__subtitle">
        {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
      </div>
    </div>
    <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
      <q-uploader-add-trigger />
    </q-btn>
    <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat />
    <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat />
  </div>
</template>
`

        cy.mount(QUploader, {
          slots: {
            header: headerSlot
          }
        })
      })
    })

    describe('(slot): list', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  describe('Events', () => {
    describe('(event): added', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): removed', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): start', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): finish', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  describe('Methods', () => {
    describe('(method): upload', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): abort', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): reset', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): removeUploadedFiles', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): removeQueuedFiles', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): removeFile', () => {
      it.skip(' ', () => {
        //
      })
    })
  })
})
