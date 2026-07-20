function inline(value) {
  return Array.isArray(value) ? value.join(' | ') : (value ?? '—')
}

function renderEntry(name, entry) {
  const lines = [`### \`${name}\``]

  if (entry.type !== void 0) {
    lines.push('', `Type: \`${inline(entry.type)}\``)
  }
  if (entry.default !== void 0) {
    lines.push('', `Default: \`${entry.default}\``)
  }
  if (entry.required === true) {
    lines.push('', 'Required: yes')
  }
  if (entry.addedIn !== void 0) {
    lines.push('', `Added in: ${entry.addedIn}`)
  }
  if (entry.desc !== void 0) {
    lines.push('', entry.desc)
  }
  if (entry.values !== void 0) {
    lines.push(
      '',
      `Accepted values: ${entry.values.map(value => `\`${value}\``).join(', ')}`
    )
  }
  if (entry.examples !== void 0) {
    lines.push(
      '',
      'Examples:',
      '',
      ...entry.examples.map(example => `- \`${example}\``)
    )
  }

  return lines.join('\n')
}

export function renderApiMarkdown(name, api, canonicalUrl) {
  const sections = [
    ['Props', api.props],
    ['Slots', api.slots],
    ['Events', api.events],
    ['Methods', api.methods],
    ['Computed properties', api.computedProps]
  ]
  const lines = [
    `# ${name} API`,
    '',
    `Type: ${api.type}`,
    '',
    `Canonical documentation: ${canonicalUrl}`
  ]

  for (const [title, entries] of sections) {
    if (entries === void 0 || Object.keys(entries).length === 0) continue

    lines.push(
      '',
      `## ${title}`,
      '',
      Object.entries(entries)
        .map(([entryName, entry]) => renderEntry(entryName, entry))
        .join('\n\n')
    )
  }

  return `${lines.join('\n')}\n`
}
