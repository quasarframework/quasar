import fse from 'fs-extra'
import { Parser } from 'acorn'
// import { inspect } from 'node:util'

import { getGenerator } from './generators/map.js'

const ignoreCommentLineMaxLen = 100
const ignoreCommentRE = /^(\/\*.*\n\s*\*\s*Ignored specs:\s*\n.+\n\s*\*\/\s*\n?\n?)/s
const ignoreCommentEntryRE = /(\[[^\]]+\])/g

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

  // console.log(
  //   inspect(tree, {
  //     showHidden: true,
  //     depth: null,
  //     colors: true,
  //     compact: false
  //   })
  // )
  // process.exit(0)
  return tree
}

function getTestFileMisconfiguration (ctx, categoryList) {
  const errors = []
  const warnings = []

  const { testTreeRootId } = ctx
  const { testTree, ignoreCommentIds, content } = ctx.testFile

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
      `Should contain: import ${ ctx.pascalName } ${ targetImport }`
    )
  }

  Object.keys(tree.children).forEach(categoryId => {
    const { type } = tree.children[ categoryId ]

    if (categoryId[ 0 ] === '[' && categoryList.includes(categoryId) === false) {
      errors.push(
        `Invalid type('${ categoryId }')`
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
    })
  })

  return { errors, warnings }
}

function getInitialState (file) {
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
  const generator = getGenerator(ctx.targetRelative)
  const generateSection = jsonPath => generator.generateSection(ctx, jsonPath)

  if (fse.existsSync(file) === false) {
    return {
      content: null,
      generateSection,
      createContent () {
        return generator.createTestFileContent(ctx)
      }
    }
  }

  const save = content => {
    testFile.testTree = getTestTree(content)
    fse.writeFileSync(file, content, 'utf-8')
  }

  const testFile = {
    ...getInitialState(file),
    generateSection,

    getMissingTests () {
      if (this.content === null) return []
      return generator.getMissingTests(ctx)
    },

    getMisconfiguration () {
      if (this.content === null) return []
      return getTestFileMisconfiguration(ctx, generator.categoryList)
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
        if (categoryContent[ test.categoryId ] === void 0) {
          categoryContent[ test.categoryId ] = [ test.content ]
        }
        else {
          categoryContent[ test.categoryId ].push(test.content)
        }
      })

      const categoryList = Object.keys(categoryContent).sort()

      categoryList.forEach(categoryId => {
        let treeCategory = this.testTree[ ctx.testTreeRootId ].children[ categoryId ]
        let prefix = ''
        let suffix = ''

        if (treeCategory === void 0) {
          prefix = `\n  describe('${ categoryId }', () => {`
          suffix = '  })\n'
          treeCategory = this.testTree[ ctx.testTreeRootId ]
        }

        const { insertIndex } = treeCategory

        this.content = (
          this.content.slice(0, insertIndex)
          + prefix
          + categoryContent[ categoryId ].join('')
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
