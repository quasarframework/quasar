import { fabFacebookSquare, fabGithub, fabTwitter } from '@quasar/extras/fontawesome-v5'
import { mdiDiscord, mdiForum } from '@quasar/extras/mdi-v6'

export const socialLinks = {
  name: 'Social',
  mq: 1310,
  children: [
    { name: 'Github', icon: fabGithub, path: 'https://github.quasar.dev', external: true },
    { name: 'Discord', icon: mdiDiscord, path: 'https://chat.quasar.dev', external: true },
    { name: 'Forum', icon: mdiForum, path: 'https://forum.quasar.dev', external: true },
    { name: 'Twitter', icon: fabTwitter, path: 'https://twitter.quasar.dev', external: true },
    { name: 'Facebook', icon: fabFacebookSquare, path: 'https://facebook.quasar.dev', external: true }
  ]
}
