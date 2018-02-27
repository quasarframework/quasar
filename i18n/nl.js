export default {
  lang: 'nl',
  label: {
    clear: 'Wis',
    ok: 'OK',
    cancel: 'Annuleer',
    close: 'Sluit',
    set: 'Toepassen',
    select: 'Selecteer',
    reset: 'Herinitialiseren',
    remove: 'Verwijder',
    update: 'Update',
    create: 'Maak aan',
    search: 'Zoek',
    filter: 'Filter',
    refresh: 'Vernieuw'
  },
  date: {
    days: 'Zondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrijdag_Zaterdag'.split('_'),
    daysShort: 'Zo_Ma_Di_Woe_Do_Vrij_Zat'.split('_'),
    months: 'Januari_Februari_Maart_April_Mei_Juni_Juli_Augustus_September_Oktober_November_December'.split('_'),
    monthsShort: 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  pullToRefresh: {
    pull: 'Pull-down om te vernieuwen',
    release: 'Laat los om te vernieuwen',
    refresh: 'Vernieuwen...'
  },
  table: {
    noData: 'Geen data bechikbaar',
    noResults: 'Geen records gevonden',
    loading: 'Laden...',
    selectedRows: function (rows) {
      return rows === 1
        ? '1 rij geselecteerd.'
        : (rows === 0 ? 'Geen' : rows) + ' geselecteerde rijen.'
    },
    rowsPerPage: 'Rijen per pagina:',
    allRows: 'Alle',
    pagination: function (start, end, total) {
      return start + '-' + end + ' op ' + total
    },
    columns: 'Kolommen'
  },
  editor: {
    url: 'URL',
    bold: 'Vet',
    italic: 'Cursief',
    strikethrough: 'Doorhalen',
    underline: 'Onderlijnen',
    unorderedList: 'Ongeordende lijst',
    orderedList: 'Geordende lijst ',
    subscript: 'Bovenschrift',
    superscript: 'Onderschrift',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'Volledig scherm activeren',
    quote: 'Citaat',
    left: 'Links uitlijnen',
    center: 'Tekst centreren',
    right: 'Rechts uitlijnen',
    justify: 'Tekst uitvullen',
    print: 'Afdrukken',
    outdent: 'Inspringen verkleinen',
    indent: 'Inspringen vergroten',
    removeFormat: 'Opmaak verwijderen',
    formatting: 'Opmaak',
    fontSize: 'Tekengrootte',
    align: 'Uitlijnen',
    hr: 'Horizontale lijn invoegen',
    undo: 'Ongedaan maken',
    redo: 'Opnieuw',
    header1: 'Kop 1',
    header2: 'Kop 2',
    header3: 'Kop 3',
    header4: 'Kop 4',
    header5: 'Kop 5',
    header6: 'Kop 6',
    paragraph: 'Paragraaf',
    code: 'Code',
    size1: 'Heel klein',
    size2: 'Klein',
    size3: 'Normaal',
    size4: 'Medium-groot',
    size5: 'Groot',
    size6: 'Heel groot',
    size7: 'Maximum',
    defaultFont: 'Standaard lettertype'
  },
  tree: {
    noNodes: 'Geen nodes beschikbaar',
    noResults: 'Geen overeenkomende nodes gevonden'
  }
}
