import { mount } from '@cypress/vue'
import QTable from '../QTable.js'

const columns = [
  {
    name: "name",
    required: true,
    label: "Dessert (100g serving)",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "calories",
    align: "center",
    label: "Calories",
    field: "calories",
    sortable: true,
  },
  { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
  { name: "carbs", label: "Carbs (g)", field: "carbs" },
  { name: "protein", label: "Protein (g)", field: "protein" },
  { name: "sodium", label: "Sodium (mg)", field: "sodium" },
  {
    name: "calcium",
    label: "Calcium (%)",
    field: "calcium",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "iron",
    label: "Iron (%)",
    field: "iron",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];

const rows = [
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: "14%",
    iron: "1%",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: "8%",
    iron: "1%",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: "6%",
    iron: "7%",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: "3%",
    iron: "8%",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: "7%",
    iron: "16%",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: "0%",
    iron: "0%",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: "0%",
    iron: "2%",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: "0%",
    iron: "45%",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: "2%",
    iron: "22%",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: "12%",
    iron: "6%",
  },
];


describe('Table API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): grid', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: behavior|content', () => {
      describe('(prop): grid-header', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): loading', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: column', () => {
      describe('(prop): columns', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): visible-columns', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: content', () => {
      describe('(prop): icon-first-page', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): icon-prev-page', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): icon-next-page', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): icon-last-page', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): title', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): hide-header', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): hide-bottom', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): hide-selected-banner', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): hide-no-data', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): hide-pagination', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): separator', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): wrap-cells', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): no-data-label', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): no-results-label', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): loading-label', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: expansion', () => {
      describe('(prop): expanded', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: filter', () => {
      describe('(prop): filter', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): filter-method', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: general', () => {
      describe('(prop): rows', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): row-key', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: pagination', () => {
      describe('(prop): rows-per-page-label', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): pagination-label', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): pagination', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): rows-per-page-options', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: selection', () => {
      describe('(prop): selected-rows-label', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): selection', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): selected', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: sorting', () => {
      describe('(prop): binary-state-sort', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): column-sort-order', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): sort-method', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: style', () => {
      describe('(prop): color', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): dense', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): dark', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): flat', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): bordered', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): square', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): table-style', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): table-class', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): table-header-style', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): table-header-class', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): table-row-style', () => {
        it('should add row style (String)', () => {
          const style = 'font-size: 20px;'

          mount(QTable, {
            props: {
              rows,
              columns,
              tableRowStyle: style
            }
          })

          cy.get('.q-table tbody tr').each((tr) =>
            cy.wrap(tr).should('have.attr', "style", style)
          );
        })

        it('should add row style (Array)', () => {
          const style = 'font-size: 20px;'

          mount(QTable, {
            props: {
              rows,
              columns,
              tableRowStyle: [style]
            }
          })

          cy.get('.q-table tbody tr').each((tr) =>
            cy.wrap(tr).should('have.attr', "style", style)
          );
        })

        it('should add row style (Object)', () => {
          const style = 'font-size: 20px;'

          mount(QTable, {
            props: {
              rows,
              columns,
              tableRowStyle: { fontSize: '20px' }
            }
          })

          cy.get('.q-table tbody tr').each((tr) =>
            cy.wrap(tr).should('have.attr', "style", style)
          );
        })

        it('should add row style (Function)', () => {
          const style = 'font-size: 20px;'

          mount(QTable, {
            props: {
              rows,
              columns,
              tableRowStyle: () => style
            }
          })

          cy.get('.q-table tbody tr').each((tr) =>
            cy.wrap(tr).should('have.attr', "style", style)
          );
        })
      })

      describe('(prop): table-row-class', () => {
        it('should add row class (String)', () => {
          const rowClass = 'row-class'

          mount(QTable, {
            props: {
              rows,
              columns,
              tableRowClass: rowClass
            }
          })

          cy.get(".q-table tbody tr").each((tr) =>
            cy.wrap(tr).should("have.class", rowClass)
          )
        })

        it('should add row class (Array)', () => {
          const rowClass = 'row-class'

          mount(QTable, {
            props: {
              rows,
              columns,
              tableRowClass: [rowClass]
            }
          })

          cy.get(".q-table tbody tr").each((tr) =>
            cy.wrap(tr).should("have.class", rowClass)
          )
        })

        it('should add row class (Object)', () => {
          const rowClass = 'row-class'

          mount(QTable, {
            props: {
              rows,
              columns,
              tableRowClass: { [rowClass]: true }
            }
          })

          cy.get(".q-table tbody tr").each((tr) =>
            cy.wrap(tr).should("have.class", rowClass)
          )
        })

        it('should add row class (Function)', () => {
          const rowClass = 'row-class'

          mount(QTable, {
            props: {
              rows,
              columns,
              tableRowClass: () => rowClass
            }
          })

          cy.get(".q-table tbody tr").each((tr) =>
            cy.wrap(tr).should("have.class", rowClass)
          )
        })
      })

      describe('(prop): card-container-style', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): card-container-class', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): card-style', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): card-class', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): title-class', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: virtual-scroll', () => {
      describe('(prop): virtual-scroll', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): virtual-scroll-slice-size', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): virtual-scroll-slice-ratio-before', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): virtual-scroll-slice-ratio-after', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): virtual-scroll-item-size', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): virtual-scroll-sticky-size-start', () => {
        it.skip(' ', () => {
          //
        })
      })

      describe('(prop): virtual-scroll-sticky-size-end', () => {
        it.skip(' ', () => {
          //
        })
      })
    })

    describe('Category: virtual-scroll|content', () => {
      describe('(prop): table-colspan', () => {
        it.skip(' ', () => {
          //
        })
      })
    })
  })

  describe('Slots', () => {
    describe('(slot): loading', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): item', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): body', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): body-cell', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): body-cell-[name]', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): header', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): header-cell', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): header-cell-[name]', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): body-selection', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): header-selection', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): top-row', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): bottom-row', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): top', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): bottom', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): pagination', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): top-left', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): top-right', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): top-selection', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(slot): no-data', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  describe('Events', () => {
    describe('(event): row-click', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): row-dblclick', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): row-contextmenu', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): request', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): selection', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): update:pagination', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): update:selected', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): update:expanded', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(event): virtual-scroll', () => {
      it.skip(' ', () => {
        //
      })
    })
  })

  describe('Methods', () => {
    describe('(method): requestServerInteraction', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): setPagination', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): firstPage', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): prevPage', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): nextPage', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): lastPage', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): isRowSelected', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): clearSelection', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): isRowExpanded', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): setExpanded', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): sort', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): toggleFullscreen', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): resetVirtualScroll', () => {
      it.skip(' ', () => {
        //
      })
    })

    describe('(method): scrollTo', () => {
      it.skip(' ', () => {
        //
      })
    })
  })
})
