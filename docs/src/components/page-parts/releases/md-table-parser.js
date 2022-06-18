function getTable (rows) {
  const header = rows[ 0 ].split('|')
    .filter(col => col)
    .map(col => `<th class="text-left">${col.trim()}</th>`)
    .join('')

  const body = rows.slice(2).map(row => '<tr>' +
    row.split('|')
      .filter(col => col)
      .map(col => `<td>${col.trim()}</td>`)
      .join('') +
    '</tr>'
  ).join('')

  return '<div class="q-markup-table q-table__container q-table__card ' +
    'q-table--horizontal-separator q-table--flat q-table--bordered ' +
    'q-table--no-wrap q-table--dense">' +
    `<table class="q-table"><thead>${header}</thead>` +
    `<tbody>${body}</tbody></table></div>`
}

export default raw => {
  let content = ''
  let tableRows = []

  for (const row of raw.split('\n')) {
    if (row.indexOf('|') > -1) {
      tableRows.push(row.trim())
    }
    else {
      if (tableRows.length > 0) {
        content += getTable(tableRows) + '\n'
        tableRows = []
      }
      content += row + '\n'
    }
  }

  if (tableRows.length > 0) {
    content += getTable(tableRows) + '\n'
  }

  return content
}
