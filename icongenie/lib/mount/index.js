
import { mountCordova, isCordovaFile, verifyCordova } from './mount-cordova.js'
import { mountTag } from './mount-tag.js'

export function mount (files) {
  mountCordova(files)
  mountTag(files)
}

export function verifyMount (file) {
  return isCordovaFile(file)
    ? verifyCordova(file)
    : ''
}
