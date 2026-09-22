// The files agents read instead of the app: the .md page siblings, llms.txt
// and mcp.json from the docs generator (build/mcp) and public/context7.json.
// Read by quasar.config.js (kept out of the precache) and by the service
// worker (src-pwa/sw/custom-sw.js: no app shell, never cached).
export const agentFiles = ['context7.json', 'llms.txt', 'mcp.json']

export const agentFilesRE = new RegExp(
  String.raw`\.md$|/(${agentFiles.map(file => file.replace('.', String.raw`\.`)).join('|')})$`
)
