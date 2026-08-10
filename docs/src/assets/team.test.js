import { expect, test } from 'vitest'

import { coreTeam } from './team.js'

// the avatar files live on cdn.quasar.dev (per TeamMember.vue), so
// only the entry shape is verifiable here
test('team entries carry a name, and image-file avatars when present', () => {
  expect(coreTeam.length).toBeGreaterThan(0)

  for (const member of coreTeam) {
    expect(member.name).toBeTruthy()
    if (member.avatar !== void 0) {
      expect(member.avatar, member.name).toMatch(/\.(jpe?g|png|webp)$/)
    }
  }
})
