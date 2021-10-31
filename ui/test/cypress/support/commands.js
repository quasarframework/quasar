import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

addMatchImageSnapshotCommand({
  customSnapshotsDir: '../test/cypress/snapshots',
  // Cypress clips the screenshots taken a bit weird, add a bit of padding to center the image
  padding: [ 0, 2, 0, 0 ]
})
