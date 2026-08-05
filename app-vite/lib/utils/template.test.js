import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterAll, describe, expect, test } from 'vitest'

import {
  compileTemplateToFile,
  compileTemplateToFn,
  renderTemplate,
  templateRenderError
} from './template.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-template-')))

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

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

    test('renders nullish interpolations as empty strings', () => {
      expect(renderTemplate('a<%= null %>b<%= undefined %>c', {})).toBe('abc')
    })

    test('renders falsy non-nullish interpolations verbatim', () => {
      expect(renderTemplate('<%= 0 %>|<%= false %>|<%= "" %>', {})).toBe(
        '0|false|'
      )
    })

    test('renders throwing interpolations as empty strings', () => {
      expect(renderTemplate('a<%= scope.missing.deep %>b', {})).toBe('ab')
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

    test('exec blocks share state across tags', () => {
      expect(
        renderTemplate('<% const x = scope.a + scope.b %>sum:<%= x %>', {
          a: 1,
          b: 2
        })
      ).toBe('sum:3')
    })

    test('outputs raw content with <%~ ~%> without evaluating it', () => {
      expect(renderTemplate('<%~ <%= not evaluated %> ~%>', {})).toBe(
        '<%= not evaluated %>'
      )
    })

    test('outputs raw special characters literally', () => {
      expect(renderTemplate('<%~ a `tick` "dq" $dollar \\slash ~%>', {})).toBe(
        'a `tick` "dq" $dollar \\slash'
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

    test('supports custom tag delimiters', () => {
      expect(
        renderTemplate(
          '{{= scope.a }} and {{ if (scope.b) { }}yes{{ } }}',
          { a: 1, b: true },
          { tagStart: '{{', tagEnd: '}}' }
        )
      ).toBe('1 and yes')
    })

    test('supports a custom scope variable name', () => {
      expect(
        renderTemplate('Hi <%= it.who %>', { who: 'you' }, { varName: 'it' })
      ).toBe('Hi you')
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

    test('prepends the header option to the compiled body', () => {
      expect(
        renderTemplate('<%= x + y %>', {}, { header: 'const x = 40, y = 2' })
      ).toBe('42')
    })

    test('returns templateRenderError when the template cannot compile', () => {
      expect(renderTemplate('<% ]not js %>ok', {})).toBe(templateRenderError)
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

    test('returns templateRenderError when the body is not valid JS', () => {
      expect(templateRenderError).toBeTypeOf('symbol')
      expect(compileTemplateToFn('<% ]not js %>')).toBe(templateRenderError)
    })
  })

  describe('compileTemplateToFile()', () => {
    test('emits an ESM module exporting the render function', () => {
      const code = compileTemplateToFile('Hi <%= scope.x %>')
      expect(code).toMatch(/^export default scope => \{/)
      expect(code).toContain('scope.x')
    })

    test('names the export param after the custom varName', () => {
      const code = compileTemplateToFile('Hi <%= it.x %>', { varName: 'it' })
      expect(code).toMatch(/^export default it => \{/)
    })

    test('the emitted module renders like the compiled fn', async () => {
      const file = join(rootDir, 'emitted-template.mjs')
      writeFileSync(
        file,
        compileTemplateToFile(
          '<% for (const n of scope.list) { %><%= n %>,<% } %>'
        )
      )

      const mod = await import(pathToFileURL(file).href)
      expect(mod.default({ list: [1, 2, 3] })).toBe('1,2,3,')
    })
  })
})
