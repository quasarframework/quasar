import {
  isCapacitorFile,
  mountCapacitor,
  verifyCapacitor
} from './mount-capacitor.js'
import { isCordovaFile, mountCordova, verifyCordova } from './mount-cordova.js'
import { mountTag } from './mount-tag.js'

export async function mount(files) {
  await mountCapacitor(files)
  await mountCordova(files)
  mountTag(files)
}

export function verifyMount(file) {
  if (isCordovaFile(file)) return verifyCordova(file)
  if (isCapacitorFile(file)) return verifyCapacitor(file)
  return ''
}
