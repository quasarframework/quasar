import { expect, test } from 'vitest'

import { listApi, readApi, resolveApiName, similarApiNames } from './api.js'
import { loadProject } from './project.js'
import { createProject } from './test/fixture.js'

function apiDir() {
  return loadProject(createProject()).packages[0].apiDir
}

test('lists the descriptors', () => {
  expect(listApi(apiDir())).toEqual(['Notify', 'QBtn'])
})

test('resolves names case-insensitively and without the Q prefix', () => {
  const dir = apiDir()
  for (const input of ['QBtn', 'qbtn', 'btn', 'Btn ']) {
    expect(resolveApiName(dir, input), input).toBe('QBtn')
  }
  expect(resolveApiName(dir, 'notify')).toBe('Notify')
  expect(resolveApiName(dir, 'QTable')).toBeNull()
})

test('reads a descriptor once', () => {
  const dir = apiDir()
  const api = readApi(dir, 'QBtn')
  expect(api.type).toBe('component')
  expect(Object.keys(api.props)).toEqual(['label', 'loading'])
  expect(readApi(dir, 'QBtn')).toBe(api)
  expect(readApi(dir, 'Missing')).toBeNull()
})

test('suggests names containing the input', () => {
  const dir = apiDir()
  expect(similarApiNames(dir, 'bt')).toEqual(['QBtn'])
  expect(similarApiNames(dir, 'qnot')).toEqual(['Notify'])
  expect(similarApiNames(dir, 'table')).toEqual([])
})
