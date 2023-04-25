import { describe, expect, it, vi } from 'vitest'
import { Plugin } from 'vite'
import { quasar } from '../../src/index'

describe('quasar plugin', () => {
  it('should return default plugins', () => {
    const plugins = quasar()
    expect(plugins.length).toBe(3)

    expect(plugins[0].name).toBe('vite:quasar:vite-conf')
    expect(plugins[1].name).toBe('vite:quasar:scss')
    expect(plugins[2].name).toBe('vite:quasar:script')
  })

  describe('vite:quasar:vite-conf', () => {
    it('should throw an error if it is not added after Vite Vue plugin', () => {
      const [viteConfPlugin] = quasar() as Plugin[]
      
      const configResolved = viteConfPlugin.configResolved
      if (typeof configResolved !== 'function') {
        throw new Error('configResolved hook is not a function. Adjust the test code accordingly')
      }

      const consoleError = vi.spyOn(console, 'error').mockImplementationOnce(() => undefined)
      const processExit = vi.spyOn(process, 'exit').mockImplementationOnce(() => undefined as never)
      configResolved.call(viteConfPlugin, { plugins: [] })

      expect(consoleError).toHaveBeenCalledOnce()
      expect(processExit).toHaveBeenCalledWith(1)
    })

    it('should not throw an error if it is added after Vite Vue plugin', () => {
      const [viteConfPlugin] = quasar() as Plugin[]

      const configResolved = viteConfPlugin.configResolved
      if (typeof configResolved !== 'function') {
        throw new Error('configResolved hook is not a function. Adjust the test code accordingly')
      }

      const consoleError = vi.spyOn(console, 'error').mockImplementationOnce(() => undefined)
      const processExit = vi.spyOn(process, 'exit').mockImplementationOnce(() => undefined as never)
      configResolved.call(viteConfPlugin, { plugins: [{ name: 'vite:vue' }] })

      expect(consoleError).not.toHaveBeenCalled()
      expect(processExit).not.toHaveBeenCalled()
    })
  })

  describe('vite:quasar:scss', () => {
    it('should be enabled if sassVariables is true', () => {
      const plugins = quasar({ sassVariables: true })
      const scssPlugin = plugins.find(({ name }) => name === 'vite:quasar:scss')
      expect(scssPlugin).toBeDefined()
    })

    it('should be enabled if sassVariables is a path', () => {
      const plugins = quasar({ sassVariables: 'some/path.scss' })
      const scssPlugin = plugins.find(({ name }) => name === 'vite:quasar:scss')
      expect(scssPlugin).toBeDefined()
    })

    it('should be disabled if sassVariables is false ', () => {
      const plugins = quasar({ sassVariables: false })
      const scssPlugin = plugins.find(({ name }) => name === 'vite:quasar:scss')
      expect(scssPlugin).toBeUndefined()
    })
  })

  describe('vite:quasar:script', () => {
    it.each(['web-client', 'ssr-client'])('should be enabled if runMode is %s', (runMode) => {
      const plugins = quasar({ runMode })
      const scriptPlugin = plugins.find(({ name }) => name === 'vite:quasar:script')
      expect(scriptPlugin).toBeDefined()
    })

    it('should be disabled if runMode is ssr-server', () => {
      const plugins = quasar({ runMode: 'ssr-server' })
      const scriptPlugin = plugins.find(({ name }) => name === 'vite:quasar:script')
      expect(scriptPlugin).toBeUndefined()
    })
  })
})
