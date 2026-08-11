import { describe, expect, test } from 'vitest'

import { quasarViteStripFilenameHashesPlugin } from './vite.strip-filename-hashes.js'

describe('[vite.strip-filename-hashes.js]', () => {
  test('declares a post-enforced config hook', () => {
    const plugin = quasarViteStripFilenameHashesPlugin()

    expect(plugin.name).toBe('quasar:strip-filename-hashes')
    expect(plugin.enforce).toBe('post')
    expect(plugin.config).toBeTypeOf('function')
  })

  test('fills in hash-less filenames with the default assets dir', () => {
    const plugin = quasarViteStripFilenameHashesPlugin()
    const viteConf = { build: {} }

    plugin.config(viteConf)

    expect(viteConf.build.rolldownOptions.output).toEqual({
      entryFileNames: 'assets/[name].js',
      chunkFileNames: 'assets/[name].js',
      assetFileNames: 'assets/[name].[ext]'
    })
  })

  test('respects a custom assetsDir', () => {
    const plugin = quasarViteStripFilenameHashesPlugin()
    const viteConf = { build: { assetsDir: 'static' } }

    plugin.config(viteConf)

    expect(viteConf.build.rolldownOptions.output).toEqual({
      entryFileNames: 'static/[name].js',
      chunkFileNames: 'static/[name].js',
      assetFileNames: 'static/[name].[ext]'
    })
  })

  test('leaves already configured filenames untouched', () => {
    const plugin = quasarViteStripFilenameHashesPlugin()
    const viteConf = {
      build: {
        rolldownOptions: {
          output: { entryFileNames: 'entry-[hash].js' }
        }
      }
    }

    plugin.config(viteConf)

    expect(viteConf.build.rolldownOptions.output).toEqual({
      entryFileNames: 'entry-[hash].js',
      chunkFileNames: 'assets/[name].js',
      assetFileNames: 'assets/[name].[ext]'
    })
  })
})
