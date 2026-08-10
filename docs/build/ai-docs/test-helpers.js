/**
 * Shared render helpers for emitter tests. Each call re-registers emitters
 * from a clean slate so registrations never leak across test files.
 */

import { createAiMd } from './md-ai.js'
import { clearEmitters, createCtx, emitTokens } from './emit/walker.js'
import { registerProseEmitters } from './emit/prose.js'
import { registerContainerEmitters } from './emit/containers.js'

function renderTokens(src) {
  const md = createAiMd()
  const tokens = md.parse(src, {})
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {} })
  return emitTokens(tokens, ctx)
}

export function renderProse(src) {
  clearEmitters()
  registerProseEmitters()
  return renderTokens(src)
}

export function renderProseWithContainers(src) {
  clearEmitters()
  registerProseEmitters()
  registerContainerEmitters()
  return renderTokens(src)
}
