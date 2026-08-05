import { describe, expect, test } from 'vitest'

import {
  compileTemplateToFile,
  compileTemplateToFn,
  renderTemplate
} from '../../lib/template.js'

describe('[template.js]', () => {
  describe('renderTemplate()', () => {
    test('returns plain strings untouched', () => {
      expect(renderTemplate('no tags here', {})).toBe('no tags here')
    })

    test('interpolates values with <%= %>', () => {
      expect(
        renderTemplate('Hello <%= scope.name %>!', { name: 'World' })
      ).toBe('Hello World!')
    })

    test('interpolates expressions', () => {
      expect(
        renderTemplate('<%= JSON.stringify(scope.author) %>', {
          author: 'Some "Author"'
        })
      ).toBe(String.raw`"Some \"Author\""`)
    })

    test('executes code blocks with <% %>', () => {
      const tpl = '<% if (scope.on) { %>ON<% } else { %>OFF<% } %>'
      expect(renderTemplate(tpl, { on: true })).toBe('ON')
      expect(renderTemplate(tpl, { on: false })).toBe('OFF')
    })

    test('supports loops in exec blocks', () => {
      expect(
        renderTemplate(
          '<% for (const item of scope.list) { %><%= item %>;<% } %>',
          { list: ['a', 'b', 'c'] }
        )
      ).toBe('a;b;c;')
    })

    test('outputs raw content with <%~ ~%> without evaluating it', () => {
      expect(renderTemplate('<%~ <%= not evaluated %> ~%>', {})).toBe(
        '<%= not evaluated %>'
      )
    })

    test('trims the newline that follows a tag by default', () => {
      expect(
        renderTemplate('line1\n<% if (true) { %>\nkeep\n<% } %>\nline2', {})
      ).toBe('line1\nkeep\nline2')
    })

    test('fully slurps whitespace with <%_ and _%>', () => {
      expect(renderTemplate('x <%_ _%> y', {})).toBe('xy')
    })

    test('normalizes CRLF line endings to LF', () => {
      expect(renderTemplate('a\r\nb <%= scope.v %>', { v: 1 })).toBe('a\nb 1')
    })

    test('ignores tag delimiters inside JS comments', () => {
      expect(renderTemplate('a\n<% /* comment %> */ %>b', {})).toBe('a\nb')
    })

    test('ignores tag delimiters inside strings', () => {
      expect(renderTemplate('A <% const x = "%>" %><%= x %>', {})).toBe('A %>')
      expect(renderTemplate("A <% const x = '%>' %><%= x %>", {})).toBe('A %>')
      expect(renderTemplate('A <% const x = `%>` %><%= x %>', {})).toBe('A %>')
    })

    test('exec blocks share state across tags', () => {
      expect(
        renderTemplate('<% const x = scope.a + scope.b %>sum:<%= x %>', {
          a: 1,
          b: 2
        })
      ).toBe('sum:3')
    })

    test('destructures scope keys when varName is false', () => {
      expect(
        renderTemplate(
          '<%= name %>-<%= version %>',
          {
            name: 'pkg',
            version: '1.0.0'
          },
          { varName: false }
        )
      ).toBe('pkg-1.0.0')
    })

    test('throws on an unclosed tag', () => {
      expect(() => renderTemplate('<% broken', {})).toThrow(/unclosed tag/)
    })

    test('throws on an unclosed string inside a tag', () => {
      expect(() => renderTemplate('<% "broken %>', {})).toThrow(
        /unclosed string/
      )
    })

    test('throws on an unclosed comment inside a tag', () => {
      expect(() => renderTemplate('<% /* broken %>', {})).toThrow(
        /unclosed comment/
      )
    })

    test('parse errors point to the offending line and column', () => {
      expect(() => renderTemplate('ok\n<% broken', {})).toThrow(
        /at line 2 col 1/
      )
    })
  })

  describe('compileTemplateToFn()', () => {
    test('returns a reusable render function', () => {
      const fn = compileTemplateToFn('Hi <%= scope.who %>')
      expect(fn).toBeTypeOf('function')
      expect(fn({ who: 'you' })).toBe('Hi you')
      expect(fn({ who: 'me' })).toBe('Hi me')
    })
  })

  describe('compileTemplateToFile()', () => {
    test('emits an ESM module exporting the render function', () => {
      const code = compileTemplateToFile('Hi <%= scope.x %>')
      expect(code).toMatch(/^export default scope => \{/)
      expect(code).toContain('scope.x')
    })
  })
})
