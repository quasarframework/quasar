/**
 * markdown-it options shared by the HTML site config (md.js) and the AI
 * extractor (mcp/markdown/md.js, which overrides `typographer` to false).
 *
 * @type {{ html: boolean, linkify: boolean, typographer: boolean }}
 */
export const sharedMdOptions = {
  html: true,
  linkify: false,
  typographer: true
}
