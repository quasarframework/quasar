// inspired by https://github.com/blattmann/mdtablesparser
export default str => {
  let blocks = []
  let md = ''
  let beforeTable = ''
  let pushed
  for (const row of str.split('\n')) {
    if (row.match(/(\|)/gi)) {
      md += row + '\n'
      pushed = false
    }
    else {
      if (md && !pushed) {
        pushed = true
        blocks.push({
          md: md.trim(),
          beforeTable
        })
        md = ''
      }
      beforeTable += row + '\n'
    }
  }

  let finalContent = ''

  for (const block of blocks) {
    let content = ''
    md = block.md
    const rows = md.split('\n')

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]

      // header.
      if (row.length >= 1 && i === 0) {
        const columns = row.split('|')
        if (columns.length > 1) {
          let inner = ''
          for (let k = 1; k < columns.length; k++) {
            const column = columns[k].trim()
            inner += `<th>${column}</th>`
          }
          content += `<tr>${inner}</tr>`
        }
        row = rows[i + 1]
      }

      // Table content.
      if (row) {
        const columns = row.split('|')
        if (columns.length > 1) {
          let inner = ''
          for (let k = 1; k < columns.length; k++) {
            const column = columns[k].trim()
            if (!inner && column.match(/^(.)\1{1,}$/)) {
              break
            }
            inner += `<td>${column}</td>`
          }
          if (inner) {
            content += `<tr>${inner}</tr>`
          }
        }
      }
    }

    const table = content
      ? `<div class="q-markup-table q-table__container q-table__card q-table--no-wrap q-table--dense">
          <table class="q-table"><tbody>${content}</tbody></table>
        </div>`
      : ''
    finalContent += block.beforeTable + table
  }

  return blocks.length ? finalContent : str
}
