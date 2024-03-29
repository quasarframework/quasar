import fse from 'fs-extra'

class IgnoredFilesList {
  #file = new URL('./ignoredTestFiles.conf', import.meta.url)
  #list
  #shouldSave = false

  constructor () {
    const content = fse.readFileSync(this.#file, 'utf-8')

    this.#list = new Set(
      content.split('\n').filter(v => v)
    )

    process.on('exit', () => {
      this.#save()
    })
  }

  add (item) {
    this.#list.add(item)
    this.#shouldSave = true
  }

  has (item) {
    return this.#list.has(item)
  }

  #save () {
    if (this.#shouldSave === true) {
      const content = Array.from(this.#list).sort().join('\n')
      fse.writeFileSync(this.#file, content + '\n', 'utf-8')
    }
  }
}

export const ignoredTestFiles = new IgnoredFilesList()
