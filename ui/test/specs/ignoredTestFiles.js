import fse from 'fs-extra'

class IgnoredFilesList {
  #file = new URL('ignoredTestFiles.conf', import.meta.url)
  #list
  #shouldSave = false

  constructor() {
    const content = fse.readFileSync(this.#file, 'utf8')

    this.#list = new Set(content.split('\n').filter(Boolean))

    process.on('exit', () => {
      this.#save()
    })
  }

  add(item) {
    this.#list.add(item)
    this.#shouldSave = true
  }

  has(item) {
    return this.#list.has(item)
  }

  #save() {
    if (this.#shouldSave) {
      const content = [...this.#list].sort().join('\n')
      fse.writeFileSync(this.#file, content + '\n', 'utf8')
    }
  }
}

export const ignoredTestFiles = new IgnoredFilesList()
