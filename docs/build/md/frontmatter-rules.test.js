import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import { globSync } from 'tinyglobby'

import { frontMatterIssues } from './frontmatter-rules.js'
import { parseFrontMatter } from './md-parse-utils.js'

const docsDir = join(import.meta.dirname, '../..')
const pagesDir = join(docsDir, 'src/pages')
const ctx = { examplesDir: join(docsDir, 'src/examples') }

const valid = { title: 'Button', desc: 'The QBtn component.' }
const issues = extra => frontMatterIssues({ ...valid, ...extra }, ctx)

test('every page holds known keys with values of the right shape', () => {
  const wrong = globSync('**/*.md', { cwd: pagesDir }).flatMap(rel => {
    const { data } = parseFrontMatter(readFileSync(join(pagesDir, rel), 'utf8'))
    return frontMatterIssues(data, ctx).map(issue => `${rel}: ${issue}`)
  })
  expect(wrong).toEqual([])
})

test('accepts every key at its documented shape', () => {
  expect(
    issues({
      keys: 'QBtn, QBtnGroup',
      examples: 'QBtn',
      related: ['/vue-components/button-group', '/style/spacing'],
      overline: 'Above the title',
      badge: 'v2.32+',
      heading: false,
      editLink: false,
      scope: { tree: { l: '.' } }
    })
  ).toEqual([])
})

test('title and desc are required', () => {
  expect(frontMatterIssues({}, ctx)).toEqual([
    'title: is required',
    'desc: is required'
  ])
})

test('a key the pages do not take is named, with the ones they do', () => {
  const [issue, ...rest] = issues({ description: 'misspelt desc' })
  expect(rest).toEqual([])
  expect(issue).toMatch(
    /^description: is not a frontmatter key, expected one of: title, desc, /
  )
  // keys are case-sensitive
  expect(issues({ editlink: false })).toHaveLength(1)
})

test('a value of the wrong shape is named by its key', () => {
  for (const [extra, message] of [
    [{ title: '' }, 'title: must be a non-empty string'],
    [{ desc: 42 }, 'desc: must be a non-empty string'],
    [{ title: 'The "best" button' }, 'title: cannot hold a double quote'],
    [{ badge: true }, 'badge: must be a non-empty string'],
    [{ overline: ['a'] }, 'overline: must be a non-empty string'],
    [{ keys: ['QBtn'] }, 'keys: must be a comma-separated string'],
    [{ keys: 'QBtn,,QBtnGroup' }, 'keys: has an empty name'],
    [{ keys: 'QBtn,QBtn' }, 'keys: names the same thing twice'],
    [{ examples: 'NoSuchFolder' }, 'examples: names src/examples/NoSuchFolder'],
    [{ examples: true }, 'examples: must be the name of a folder'],
    [{ related: '/style/spacing' }, 'related: must be a non-empty list'],
    [{ related: [] }, 'related: must be a non-empty list'],
    [{ related: ['style/spacing'] }, 'related: holds "style/spacing"'],
    [{ related: ['/style/spacing#x'] }, 'related: holds "/style/spacing#x"'],
    [
      { related: ['/style/spacing', '/style/spacing'] },
      'related: lists the same route twice'
    ],
    [{ heading: true }, 'heading: can only be false'],
    [{ editLink: 'no' }, 'editLink: can only be false'],
    [{ mdLink: false }, 'mdLink: is not a frontmatter key'],
    [{ scope: ['a'] }, 'scope: must be an object'],
    [{ scope: null }, 'scope: must be an object']
  ]) {
    const found = issues(extra)
    expect(found, JSON.stringify(extra)).toHaveLength(1)
    expect(found[0]).toContain(message)
  }
})
