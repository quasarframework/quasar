import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import {
  QSpinner,
  QSpinnerAudio,
  QSpinnerBall,
  QSpinnerBars,
  QSpinnerBox,
  QSpinnerClock,
  QSpinnerComment,
  QSpinnerCube,
  QSpinnerDots,
  QSpinnerFacebook,
  QSpinnerGears,
  QSpinnerGrid,
  QSpinnerHearts,
  QSpinnerHourglass,
  QSpinnerInfinity,
  QSpinnerIos,
  QSpinnerOrbit,
  QSpinnerOval,
  QSpinnerPie,
  QSpinnerPuff,
  QSpinnerRadio,
  QSpinnerRings,
  QSpinnerTail
} from './QSpinner.hydration.fixtures.js'

const fixturesPath = import.meta.url

const fixtures = {
  QSpinner,
  QSpinnerAudio,
  QSpinnerBall,
  QSpinnerBars,
  QSpinnerBox,
  QSpinnerClock,
  QSpinnerComment,
  QSpinnerCube,
  QSpinnerDots,
  QSpinnerFacebook,
  QSpinnerGears,
  QSpinnerGrid,
  QSpinnerHearts,
  QSpinnerHourglass,
  QSpinnerInfinity,
  QSpinnerIos,
  QSpinnerOrbit,
  QSpinnerOval,
  QSpinnerPie,
  QSpinnerPuff,
  QSpinnerRadio,
  QSpinnerRings,
  QSpinnerTail
}

describe('QSpinner* SSR hydration', () => {
  for (const [name, fixture] of Object.entries(fixtures)) {
    test(`${name} hydrates cleanly`, async () => {
      const result = await hydrate(fixturesPath, name, fixture)

      expect(result.consoleOutput).toEqual([])
    })
  }
})
