import {
  fabDiscord,
  fabFacebook,
  fabGithub,
  fabXTwitter
} from '@quasar/extras/fontawesome-v7'
import { mdiForum } from '@quasar/extras/mdi-v7'

export const socialLinks = {
  name: 'Social',
  mq: 1310,
  children: [
    {
      name: 'GitHub',
      icon: fabGithub,
      path: 'https://github.quasar.dev',
      external: true
    },
    {
      name: 'Discord',
      icon: fabDiscord,
      path: 'https://chat.quasar.dev',
      external: true
    },
    {
      name: 'Forum',
      icon: mdiForum,
      path: 'https://forum.quasar.dev',
      external: true
    },
    {
      name: 'X (Twitter)',
      icon: fabXTwitter,
      path: 'https://twitter.quasar.dev',
      external: true
    },
    {
      name: 'Facebook',
      icon: fabFacebook,
      path: 'https://facebook.quasar.dev',
      external: true
    }
  ]
}
