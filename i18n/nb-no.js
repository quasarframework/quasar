export default {
  lang: 'nb-no',
  label: {
    clear: 'Tøm',
    ok: 'OK',
    cancel: 'Avbryt',
    close: 'Lukk',
    set: 'Bruk',
    select: 'Velg',
    reset: 'Nullstill',
    remove: 'Slett',
    update: 'Oppdater',
    create: 'Lag',
    search: 'Søk',
    filter: 'Filter',
    refresh: 'Oppdater'
  },
  date: {
    days: 'Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag'.split('_'),
    daysShort: 'Søn_Man_Tir_Ons_Tor_Fre_Lør'.split('_'),
    months: 'Januar_Februar_Mars_April_Mai_Juni_Juli_August_September_Oktober_November_Desember'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  pullToRefresh: {
    pull: 'Dra ned for å oppdatere',
    release: 'Slipp for å oppdatere',
    refresh: 'Oppdaterer...'
  },
  table: {
    noData: 'Ingen data tilgjenelig',
    noResults: 'Ingen treff i data funnet',
    loading: 'Laster...',
    row: 'rad',
    selectedRows: function (rows) {
      return rows > 0
        ? rows + ' row' + (rows === 1 ? '' : 's') + ' valgt.'
        : 'Ingen valgte rader.'
    },
    rowsPerPage: 'Rader pr side:',
    allRows: 'Alle',
    pagination: function (start, end, total) {
      return start + '-' + end + ' av ' + total
    },
    columns: 'Kolonner'
  },
  editor: {
    url: 'URL',
    bold: 'Fet',
    italic: 'Kursiv',
    strikethrough: 'Strikethrough',
    underline: 'Understrek',
    unorderedList: 'Uordnet liste',
    orderedList: 'Ordnet liste',
    subscript: 'Senket skrift',
    superscript: 'Hevet skrift',
    hyperlink: 'Lenke',
    toggleFullscreen: 'Av/på fullskjerm',
    quote: 'Sitat',
    left: 'Venstrestill',
    center: 'Sentrer',
    right: 'Høyrestill',
    justify: 'Tilpasset bredde',
    print: 'Skriv ut',
    outdent: 'Midre innrykk',
    indent: 'Større innrykk',
    removeFormat: 'Fjern formatering',
    formatting: 'Formatering',
    fontSize: 'Fontstørrelse',
    align: 'Stilling',
    hr: 'Sett inn horisontal linje',
    undo: 'Angre',
    redo: 'Gjenta',
    header1: 'Overskrift 1',
    header2: 'Overskrift 2',
    header3: 'Overskrift 3',
    header4: 'Overskrift 4',
    header5: 'Overskrift 5',
    header6: 'Overskrift 6',
    paragraph: 'Avsnitt',
    code: 'Kode',
    size1: 'Veldig liten',
    size2: 'Liten',
    size3: 'Normal',
    size4: 'Medium-stor',
    size5: 'Stor',
    size6: 'Veldig stor',
    size7: 'Maximum',
    defaultFont: 'Normal font'
  },
  tree: {
    noNodes: 'Ingen noder tilgjenelig',
    noResults: 'Ingen treff i noder funnet'
  }
}
