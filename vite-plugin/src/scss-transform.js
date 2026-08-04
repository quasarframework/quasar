import { readFileSync } from 'node:fs'

import {
  loadPrecomputedQuasarVariables,
  resolveVariablesClosure
} from './sass-variables-graph.js'

/**
 * Matches sass constructs through which an injected file could supply
 * anything beyond plain variable definitions to the target style content:
 * mixins, functions, placeholder selectors or transitively loaded files.
 * Built-in "sass:*" modules only offer namespaced members, so they are fine.
 */
const nonVariableDefRegex =
  /@(?:mixin|function|import|forward)\b|@use\s+(?!['"]sass:)|%[a-zA-Z_]/

/**
 * When all injected files contain nothing but variable definitions,
 * a style content without any "$" character cannot possibly reference
 * them, so the injection (and its compilation cost — the variables are
 * re-evaluated for every single style block) can be safely skipped.
 * If a file cannot be read (e.g. the custom variables file path relies
 * on a Vite alias), stay safe and always inject.
 */
export function areVariablesDefinitionsOnly(sassVariables) {
  // the precomputed parse shipped by the Quasar UI build (guaranteed by
  // the peer dependency floor) is the proof that its own variables file
  // is definitions-only; without it (broken install), always inject
  if (loadPrecomputedQuasarVariables() === null) {
    return false
  }

  if (typeof sassVariables !== 'string') {
    return true
  }

  try {
    return (
      nonVariableDefRegex.test(readFileSync(sassVariables, 'utf8')) === false
    )
  } catch {
    return false
  }
}

/**
 * Content loading other stylesheets (except built-in "sass:*" modules)
 * can propagate the injected variables into them through @import
 * semantics, so the injection cannot be skipped for it.
 */
const contentLoadsFilesRegex = /@(?:import|use|forward)\s+(?!['"]sass:)/
const varRefRegex = /\$([\w-]+)/g

export function createScssTransform(
  fileExtension,
  sassVariables,
  canSkipInjection = false,
  variablesGraph = null
) {
  const importList = ["'quasar/src/css/variables.sass'"]

  if (typeof sassVariables === 'string') {
    importList.unshift(`'${sassVariables}'`)
  }

  const isIndented = fileExtension === 'sass'

  // A single statement so that the line offset it introduces is constant
  // and minimal: zero lines for scss, exactly one line for sass
  // (the indented syntax requires a statement to end with a newline)
  const fullPrefix = isIndented
    ? `@import ${importList.join(', ')}\n`
    : `@import ${importList.join(', ')};`

  /**
   * Injecting only the declarations the content actually references
   * (plus their transitive dependencies) instead of the full variables
   * files spares sass from re-evaluating hundreds of declarations for
   * every single style block.
   */
  const getTargetedPrefix = content => {
    const refNames = new Set()
    for (const match of content.matchAll(varRefRegex)) {
      refNames.add(match[1])
    }

    // content defines/uses only its own variables
    if (refNames.size === 0) return ''

    const { declarations, usesNamespace } = resolveVariablesClosure(
      variablesGraph,
      refNames
    )

    if (declarations.length === 0) return ''

    const statements = [...declarations]
    if (usesNamespace === true) {
      // the "@use sass:*" lines must come first; if the content has any
      // "@use" of its own, give up on targeting (a duplicate "@use" of
      // the same module would be a sass error) - full injection keeps
      // the namespaces inside the imported file instead
      if (content.includes('@use') === true) return null
      statements.unshift(
        ...variablesGraph.namespaces.map(ns => `@use 'sass:${ns}'`)
      )
    }

    return isIndented
      ? statements.join('\n') + '\n'
      : statements.join(';') + ';'
  }

  return content => {
    const loadsFiles = contentLoadsFilesRegex.test(content)

    if (
      canSkipInjection === true &&
      loadsFiles === false &&
      content.includes('$') === false
    ) {
      return content
    }

    let prefix = fullPrefix

    // content loading other files can propagate the injected variables
    // into them, so only self-contained content can get a targeted subset
    if (variablesGraph !== null && loadsFiles === false) {
      const targetedPrefix = getTargetedPrefix(content)

      if (targetedPrefix === '') return content
      if (targetedPrefix !== null) prefix = targetedPrefix
    }

    const useIndex = Math.max(
      content.lastIndexOf('@use '),
      content.lastIndexOf('@forward ')
    )

    if (useIndex === -1) {
      return prefix + content
    }

    const newLineIndex = content.indexOf('\n', useIndex)

    if (newLineIndex !== -1) {
      const index = newLineIndex + 1
      return content.slice(0, index) + prefix + content.slice(index)
    }

    return content + '\n' + prefix
  }
}
