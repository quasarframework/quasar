import { expect, test } from 'vitest'

import { renderComponent } from '../../test/render.js'

import SurveyCountdown from './SurveyCountdown.vue'

test('server-renders the banner shell with placeholder counters', async () => {
  const html = await renderComponent(SurveyCountdown, {})

  // the countdown only computes on the client (onMounted) — the
  // server ships the shell with the "*" placeholders, and a client
  // past the conference date removes the banner after mounting
  expect(html).toContain('survey-countdown')
  expect(html).toContain('* Minutes')
})
