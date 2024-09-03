import fse from 'fs-extra'
import { Parser } from 'acorn'

import { camelCase } from './specs.utils.js'
import { getGenerator, generic as genericGenerator } from './generators/map.js'

const ignoreCommentLineMaxLen = 100
const ignoreCommentRE = /^(\/\*.*\n\s*\*\s*Ignored specs:\s*\n.+\n\s*\*\/\s*\n?\n?)/
const ignoreCommentEntryRE = /(\[[^\]]+\])/g

const testIdRE = /\[\((?<token>[^)]+)\)(?<name>.+)\]/

function getIgnoreCommentIds (ignoreComment) {
  if (ignoreComment === void 0) return []

  const matches = ignoreComment.match(ignoreCommentEntryRE)
  return matches === null
    ? []
    : Array.from(new Set(matches))
}

function createIgnoreComment (ignoreCommentIds) {
  let acc = ''
  let index = 0

  while (index < ignoreCommentIds.length) {
    let line = ' *'
    while (line.length <= ignoreCommentLineMaxLen && index < ignoreCommentIds.length) {
      line += ` ${ ignoreCommentIds[ index ] }`
      index++
    }
    acc += `${ line }\n`
  }

  return `/**\n * Ignored specs:\n${ acc } */\n\n`
}

const treeNodeTypes = [ 'describe', 'test' ]
const treeNodeCalleeTypes = [ 'Identifier', 'MemberExpression', 'CallExpression' ]

function extractTree (astNode, tree, indent) {
  if (
    astNode.type !== 'ExpressionStatement'
    || astNode.expression.type !== 'CallExpression'
    || treeNodeCalleeTypes.includes(astNode.expression.callee.type) === false
  ) return true

  const { callee, arguments: [ id, fn ] } = astNode.expression
  const type = (
    callee.callee?.object?.name // CallExpression
    || callee.object?.name // MemberExpression
    || callee.name // Identifier
  )

  if (treeNodeTypes.includes(type) === false) return

  const entry = {
    insertIndex: fn.body.end - indent,
    type,
    modifier: callee.property?.name || null
  }

  const subTree = {}
  const subIndent = indent + 2
  fn.body.body.forEach(child => {
    extractTree(child, subTree, subIndent)
  })

  entry.children = Object.keys(subTree).length !== 0
    ? subTree
    : null

  tree[ id.value ] = entry
}

function getTestTree (testFileContent) {
  const { body } = Parser.parse(testFileContent, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  })

  const tree = {}
  body.forEach(astNode => extractTree(astNode, tree, 1))

  return tree
}

function addWorkInProgress (bag, tree, name, path) {
  if (tree.modifier === 'todo' || tree.modifier === 'skip') {
    bag.push(
      `Remove ".${ tree.modifier }" from: ${ path }${ tree.type }.${ tree.modifier }("${ name }")`
    )
  }

  if (tree.children !== null) {
    for (const childName in tree.children) {
      addWorkInProgress(
        bag,
        tree.children[ childName ],
        childName,
        `${ path }${ tree.type }("${ name }") > `
      )
    }
  }
}

function getTestFileMisconfiguration ({
  ctx,
  generator,
  json,
  testFile,
  opts
}) {
  const errors = []
  const warnings = []

  const { testTreeRootId } = ctx
  const { testTree, ignoreCommentIds, content } = testFile

  if (content === null) return { errors, warnings }

  if (Object.keys(testTree).length === 0) {
    errors.push(
      'Should have one root describe(),'
      + ` which should be: describe('${ testTreeRootId }')`
    )

    // early exit... this is fatal
    return { errors, warnings }
  }

  if (Object.keys(testTree).length !== 1) {
    errors.push(
      'Should only have one (and only one) root describe(),'
      + ` which should be: describe('${ testTreeRootId }')`
    )

    // early exit... this is fatal
    return { errors, warnings }
  }

  if (Object.keys(testTree)[ 0 ] !== testTreeRootId) {
    errors.push(
      `Should contain a root describe('${ testTreeRootId }')`
    )

    // early exit... this is fatal
    return { errors, warnings }
  }

  const tree = testTree[ testTreeRootId ]

  if (tree.type !== 'describe') {
    errors.push(
      `Found a root ${ tree.type }('${ testTreeRootId }') but it should be a describe()`
    )
  }

  const targetImport = `from './${ ctx.localName }'`
  if (content.indexOf(targetImport) === -1) {
    errors.push(
      `Should contain: import ${ ctx.camelCaseName } ${ targetImport }`
    )
  }

  if (tree.children === null) {
    errors.push(
      `Found empty describe('${ testTreeRootId }'). Delete the file and generate it again.`
    )
    return { errors, warnings }
  }

  const { identifiers } = generator
  const identifiersKeys = Object.keys(identifiers)

  const categoryList = identifiersKeys
    .map(key => identifiers[ key ].categoryId)
    .concat('[Generic]')

  const categoryTestIdMap = identifiersKeys.reduce(
    (acc, key) => {
      const entry = identifiers[ key ]
      if (entry.getTestId !== void 0) {
        acc[ entry.categoryId ] = {
          jsonKey: key,
          token: entry.testIdToken
        }
      }
      return acc
    },
    {}
  )

  Object.keys(tree.children).forEach(categoryId => {
    const { type } = tree.children[ categoryId ]

    if (categoryId[ 0 ] === '[' && categoryList.includes(categoryId) === false) {
      errors.push(
        `Invalid category "${ categoryId }" found at ${ type }('${ categoryId }').`
      )
      return
    }

    if (type !== 'describe') {
      errors.push(
        `Found a ${ type }('${ categoryId }') but it should be a describe()`
      )
      return
    }

    const categoryTree = tree.children[ categoryId ].children
    if (categoryTree === null) {
      errors.push(
        `Found empty describe('${ categoryId }'). Delete it.`
      )
      return
    }

    const idMap = categoryTestIdMap[ categoryId ]
    if (idMap === void 0) return

    Object.keys(categoryTree).forEach(testId => {
      const { type } = categoryTree[ testId ]

      if (type !== 'describe') {
        errors.push(
          `Found a ${ type }('${ testId }') but it should be a describe()`
        )
        return
      }

      if (ignoreCommentIds.includes(testId) === true) {
        errors.push(
          `Found describe('${ testId }') but it's marked as ignored. Delete the ignore comment.`
        )
        return
      }

      if (categoryTree[ testId ].children === null) {
        errors.push(
          `Found empty describe('${ testId }')`
        )
      }

      const matcher = testId.match(testIdRE)

      if (matcher) {
        const { groups: { token, name } } = matcher
        if (token !== idMap.token) {
          errors.push(
            `Found describe('${ testId }') but it should probably be describe('[${ idMap.token }]${ name }')`
          )
        }
        else if (json[ idMap.jsonKey ]?.[ name ] === void 0) {
          errors.push(
            `Found describe('${ testId }') but there's no associated JSON entry`
          )
        }
      }
    })
  })

  if (opts?.disallowWorkInProgress === true) {
    addWorkInProgress(warnings, tree, testTreeRootId, '')
  }

  return { errors, warnings }
}

function getTestFileMissingTests ({ ctx, generator, json, testFile }) {
  if (
    testFile.content === null
    || json === void 0
  ) {
    return null
  }

  const { identifiers } = generator
  const acc = []

  Object.keys(identifiers).forEach(jsonKey => {
    const categoryJson = json[ jsonKey ]
    if (categoryJson === void 0) return

    const { categoryId, getTestId, createTestFn, shouldIgnoreEntry } = identifiers[ jsonKey ]

    if (getTestId === void 0) {
      if (testFile.ignoreCommentIds.includes(categoryId)) return
      if (testFile.testTree[ ctx.testTreeRootId ].children[ categoryId ] !== void 0) return

      acc.push({
        categoryId,
        content: createTestFn({ categoryId, jsonEntry: categoryJson, json, ctx })
      })
      return
    }

    Object.keys(categoryJson).forEach(entryName => {
      const testId = getTestId(entryName)

      if (testFile.ignoreCommentIds.includes(testId)) return
      if (testFile.testTree[ ctx.testTreeRootId ].children[ categoryId ]?.children[ testId ] !== void 0) return

      const jsonEntry = categoryJson[ entryName ]

      if (jsonEntry.internal === true) return

      const scope = {
        name: entryName,
        camelCaseName: camelCase(entryName),
        testId,
        jsonEntry,
        json,
        ctx
      }

      if (shouldIgnoreEntry?.(scope) !== true) {
        acc.push({
          testId,
          categoryId,
          content: createTestFn(scope)
        })
      }
    })
  })

  return acc.length !== 0
    ? acc
    : null
}

function generateTestFileSection ({ ctx, generator, json, jsonPath }) {
  if (json === void 0) return null

  const { identifiers } = generator

  const [ jsonKey, entryName ] = jsonPath.split('.')
  if (jsonKey === void 0) return null

  const categoryJson = json[ jsonKey ]
  if (categoryJson === void 0) return null

  const { categoryId, getTestId, createTestFn } = identifiers[ jsonKey ]

  if (getTestId === void 0) {
    return createTestFn({ categoryId, jsonEntry: categoryJson, json, ctx })
  }

  if (entryName === void 0) return null

  const jsonEntry = categoryJson[ entryName ]
  if (jsonEntry === void 0) return null

  const testId = getTestId(entryName)

  return createTestFn({
    name: entryName,
    camelCaseName: camelCase(entryName),
    testId,
    jsonEntry,
    json,
    ctx
  })
}

function createTestFileContent ({ ctx, json, generator }) {
  const { identifiers, getFileHeader } = generator

  let hasContent = false
  let acc = getFileHeader({ ctx, json })
    + `\n\ndescribe('${ ctx.testTreeRootId }', () => {`

  Object.keys(identifiers).forEach(jsonKey => {
    const categoryJson = json[ jsonKey ]
    if (categoryJson === void 0) return

    hasContent = true
    const { categoryId, getTestId, createTestFn, shouldIgnoreEntry } = identifiers[ jsonKey ]

    if (getTestId === void 0) {
      acc += createTestFn({ categoryId, jsonEntry: categoryJson, json, ctx })
    }
    else {
      acc += `\n  describe('${ categoryId }', () => {`

      Object.keys(categoryJson).forEach(entryName => {
        const testId = getTestId(entryName)
        const jsonEntry = categoryJson[ entryName ]

        if (jsonEntry.internal === true) return

        const scope = {
          name: entryName,
          camelCaseName: camelCase(entryName),
          testId,
          jsonEntry,
          json,
          ctx
        }

        if (shouldIgnoreEntry?.(scope) !== true) {
          acc += createTestFn(scope)
        }
      })

      acc += '  })\n'
    }
  })

  if (hasContent === false) {
    acc += generator.getGenericTest?.({ ctx }) || `\n  describe('[Generic]', () => {
    test('generic', () => {
      // TODO: write a generic test
      expect(true).toBe(true)
    })
  })\n`
  }

  return acc + '})\n'
}

function getInitialState (file) {
  if (fse.existsSync(file) === false) {
    return {
      content: null,
      ignoreCommentIds: [],
      testTree: {}
    }
  }

  const content = fse.readFileSync(file, 'utf-8')
  const match = content.match(ignoreCommentRE)
  const ignoreComment = match?.[ 1 ]

  return {
    content,
    ignoreCommentIds: getIgnoreCommentIds(ignoreComment),
    testTree: getTestTree(content)
  }
}

export function getTestFile (ctx) {
  const file = ctx.testFileAbsolute

  let generator = null
  let json = null

  const init = () => {
    generator = getGenerator(ctx.targetRelative)
    json = generator.getJson(ctx)

    if (json === void 0) {
      generator = genericGenerator
      json = generator.getJson(ctx)
    }
  }

  const save = content => {
    testFile.testTree = getTestTree(content)
    fse.writeFileSync(file, content, 'utf-8')
  }

  const testFile = {
    ...getInitialState(file),

    createContent () {
      generator === null && init()
      return createTestFileContent({ ctx, json, generator })
    },

    generateSection (jsonPath) {
      generator === null && init()
      return generateTestFileSection({ ctx, generator, json, jsonPath })
    },

    getMissingTests () {
      generator === null && init()
      return getTestFileMissingTests({ ctx, generator, json, testFile: this })
    },

    getMisconfiguration (opts) {
      generator === null && init()
      return getTestFileMisconfiguration({ ctx, generator, json, testFile: this, opts })
    },

    addIgnoreComments (ignoreCommentIds) {
      const hasIgnoreComment = this.ignoreCommentIds.length !== 0
      const newIds = Array.from(
        new Set([
          ...this.ignoreCommentIds,
          ...ignoreCommentIds
        ])
      ).sort()

      const ignoreComment = createIgnoreComment(newIds)

      if (hasIgnoreComment === false) {
        this.content = ignoreComment + this.content
      }
      else {
        this.content = this.content.replace(ignoreCommentRE, ignoreComment)
      }

      this.ignoreCommentIds = newIds
      save(this.content)
    },

    addTestCases (missingTests) {
      const categoryContent = {}

      missingTests.forEach(test => {
        if (categoryContent[ test.categoryId ] !== void 0) {
          categoryContent[ test.categoryId ].content += test.content
          return
        }

        const acc = {
          content: test.content,
          suffix: '',
          prefix: ''
        }

        if (
          test.testId !== void 0
          && this.testTree[ ctx.testTreeRootId ].children[ test.categoryId ] === void 0
        ) {
          acc.prefix = `\n  describe('${ test.categoryId }', () => {`
          acc.suffix = '  })\n'
        }

        categoryContent[ test.categoryId ] = acc
      })

      const categoryList = Object.keys(categoryContent).sort()

      categoryList.forEach(categoryId => {
        const { content, prefix, suffix } = categoryContent[ categoryId ]
        const { insertIndex } = (
          this.testTree[ ctx.testTreeRootId ].children[ categoryId ]
          || this.testTree[ ctx.testTreeRootId ]
        )

        this.content = (
          this.content.slice(0, insertIndex)
          + prefix
          + content
          + suffix
          + this.content.slice(insertIndex)
        )

        // if it crashes, then we didn't inject correctly
        this.testTree = getTestTree(this.content)
      })

      save(this.content)
    }
  }

  return testFile
}
