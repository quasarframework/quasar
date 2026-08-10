import { h } from 'vue'

import { QTable, QTd, QTh, QTr } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(
      QTable,
      {
        rowKey: 'name',
        columns: [
          { name: 'name', label: 'Name', field: 'name', align: 'left' }
        ],
        rows: [{ name: 'Alpha' }, { name: 'Beta' }],
        flat: true
      },
      {
        header: scope =>
          h(QTr, { props: scope }, () =>
            scope.cols.map(col =>
              h(
                QTh,
                { key: col.name, props: { ...scope, col } },
                () => col.label
              )
            )
          ),
        body: scope =>
          h(QTr, { props: scope }, () =>
            scope.cols.map(col =>
              h(
                QTd,
                { key: col.name, props: { ...scope, col } },
                () => col.value
              )
            )
          )
      }
    )
}
