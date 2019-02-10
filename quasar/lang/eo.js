export default {
  isoName: 'eo',
  nativeName: 'Esperanto',
  label: {
    clear: 'Vakigi',
    ok: 'Okej',
    cancel: 'Rezigni',
    close: 'Fermi',
    set: 'Agordi',
    select: 'Elekti',
    reset: 'Restartigi',
    remove: 'Forigi',
    update: 'Ĝisdatigi',
    create: 'Krei',
    search: 'Serĉi',
    filter: 'Filtri',
    refresh: 'Reŝargi'
  },
  date: {
    days: 'Dimanĉo_Lundo_Mardo_Merkredo_Jaŭdo_Vendredo_Sabato'.split('_'),
    daysShort: 'Dim_Lun_Mar_Mer_Jaŭ_Ven_Sab'.split('_'),
    months: 'Januaro_Februaro_Marto_Aprilo_Majo_Junio_Julio_Aŭgusto_Septembro_Oktobro_Novembro_Decembro'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aŭg_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  table: {
    noData: 'Neniu datumo afiŝenda',
    noResults: 'Neniu datumo trovita',
    loading: 'Ŝarĝado...',
    selectedRecords: function (rows) {
      return rows > 0
        ? rows + ' ' + (rows === 1 ? 'elektita linio' : 'elektitaj linioj') + '.'
        : 'Neniu elektita linio.'
    },
    recordsPerPage: 'Linioj po paĝoj:',
    allRows: 'Ĉiuj',
    pagination: function (start, end, total) {
      return start + '-' + end + ' el ' + total
    },
    columns: 'Kolumnoj'
  },
  editor: {
    url: 'URL',
    bold: 'Grasa',
    italic: 'Kursiva',
    strikethrough: 'Trastreka',
    underline: 'Substreka',
    unorderedList: 'Neordigita listo',
    orderedList: 'Ordigita listo',
    subscript: 'Indico',
    superscript: 'Supra indico',
    hyperlink: 'Ligilo',
    toggleFullscreen: 'Ŝalti plenekranon',
    quote: 'Citaĵo',
    left: 'Ĝisrandigi maldekstren',
    center: 'Centrigi',
    right: 'Ĝisrandigi dekstren',
    justify: 'Ĝisrandigi ambaŭflanke',
    print: 'Printi',
    outdent: 'Malkrommarĝenigi',
    indent: 'Krommarĝenigi',
    removeFormat: 'Forigi prezenton',
    formatting: 'Prezento',
    fontSize: 'Tipara grando',
    align: 'Ĝisrandigi',
    hr: 'Enmeti horizontalan strekon',
    undo: 'Malfari',
    redo: 'Refari',
    header1: 'Titolo 1',
    header2: 'Titolo 2',
    header3: 'Titolo 3',
    header4: 'Titolo 4',
    header5: 'Titolo 5',
    header6: 'Titolo 6',
    paragraph: 'Paragrafo',
    code: 'Kodo',
    size1: 'Tre malgranda',
    size2: 'Malgranda',
    size3: 'Normala',
    size4: 'Meza',
    size5: 'Granda',
    size6: 'Tre granda',
    size7: 'Maksimuma',
    defaultFont: 'Implicita tiparo'
  },
  tree: {
    noData: 'Neniu nodo afiŝenda',
    noResults: 'Neniu nodo trovita'
  }
}
