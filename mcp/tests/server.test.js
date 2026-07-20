import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import process from 'node:process'
import test from 'node:test'

import { createServer } from '../src/server.js'

test('serves tools and resources through the MCP protocol', async t => {
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair()
  const { server } = createServer()
  const client = new Client({ name: 'quasar-mcp-test', version: '1.0.0' })

  t.after(async () => {
    await client.close()
    await server.close()
  })

  await server.connect(serverTransport)
  await client.connect(clientTransport)

  const { tools } = await client.listTools()
  assert.deepEqual(tools.map(tool => tool.name).sort(), [
    'getQuasarApi',
    'getQuasarComposable',
    'getQuasarDoc',
    'getQuasarExamples',
    'getQuasarMcpInfo',
    'searchQuasarDocs'
  ])
  assert.ok(tools.every(tool => tool.annotations?.readOnlyHint === true))

  const apiResult = await client.callTool({
    name: 'getQuasarApi',
    arguments: { name: 'QInput', member: 'rules' }
  })
  assert.equal(apiResult.isError, void 0)
  assert.match(apiResult.content[0].text, /"member": "rules"/)

  const { resources } = await client.listResources()
  assert.ok(resources.some(item => item.uri === 'quasar://manifest'))
  assert.ok(resources.some(item => item.uri === 'quasar://api/QInput'))

  const manifest = await client.readResource({ uri: 'quasar://manifest' })
  assert.match(manifest.contents[0].text, /"APIs": 152/)

  const api = await client.readResource({ uri: 'quasar://api/QInput' })
  assert.match(api.contents[0].text, /"model-value"/)
})

test('starts and stops cleanly over the packaged stdio entry point', async t => {
  const client = new Client({ name: 'quasar-mcp-stdio-test', version: '1.0.0' })
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [resolve(import.meta.dirname, '../bin/quasar-mcp.js')],
    stderr: 'pipe'
  })

  t.after(() => client.close())
  await client.connect(transport)

  const result = await client.callTool({
    name: 'getQuasarMcpInfo',
    arguments: {}
  })

  assert.equal(result.isError, void 0)
  assert.match(result.content[0].text, /"readOnly": true/)
})
