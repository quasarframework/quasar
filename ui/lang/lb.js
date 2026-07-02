export default {
  isoName: 'lb',
  nativeName: 'Lëtzebuergesch',
  label: {
    clear: 'Eidel',
    ok: 'OK',
    cancel: 'Ofbriechen',
    close: 'Schléissen',
    set: 'Setzen',
    select: 'Auswielen',
    reset: 'Zerécksetzen',
    remove: 'Läschen',
    update: 'Aktualiséieren',
    create: 'Erstellen',
    search: 'Sichen',
    filter: 'Filter',
    refresh: 'Aktualiséieren',
    expand: label => (label ? `"${label}" erweideren` : 'Erweideren'),
    collapse: label => (label ? `"${label}" zesummeklappen` : 'Zesummeklappen')
  },
  date: {
    days: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split(
      '_'
    ),
    daysShort: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
    months:
      'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split(
        '_'
      ),
    monthsShort: 'Jan_Feb_Mäe_Abr_Mee_Jun_Jul_Aug_Sep_Okt_Nov_Dez'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'Deeg',
    prevMonth: 'Virege Mount',
    nextMonth: 'Nächste Mount',
    prevYear: 'Viregt Joer',
    nextYear: 'Nächst Joer',
    today: 'Haut',
    prevRangeYears: range => `Vireg ${range} Joer`,
    nextRangeYears: range => `Nächst ${range} Joer`
  },
  table: {
    noData: 'Keng Donnéeë verfügbar',
    noResults: 'Keng passend Resultater fonnt',
    loading: 'Lued...',
    selectedRecords: rows =>
      rows === 1
        ? '1 ausgewielt Zeil.'
        : (rows === 0 ? 'Keng' : rows) + ' Zeilen ausgewielt.',
    recordsPerPage: 'Zeilen pro Säit:',
    allRows: 'All',
    pagination: (start, end, total) => start + ' - ' + end + ' vun ' + total,
    columns: 'Kolonnen'
  },
  pagination: {
    first: 'Éischt Säit',
    prev: 'Vireg Säit',
    next: 'Nächst Säit',
    last: 'Lescht Säit'
  },
  editor: {
    url: 'URL',
    bold: 'Fett',
    italic: 'Kursiv',
    strikethrough: 'Duerchgestrach',
    underline: 'Ënnerstrach',
    unorderedList: 'Ongeuerdnet Lëscht',
    orderedList: 'Geuerdnet Lëscht',
    subscript: 'Déifgestallt',
    superscript: 'Héichgestallt',
    hyperlink: 'Link',
    toggleFullscreen: 'Vollbild ëmschalten',
    quote: 'Zitat',
    left: 'Lénks ausriichten',
    center: 'Zentréieren',
    right: 'Riets ausriichten',
    justify: 'Justéieren',
    print: 'Drécken',
    outdent: 'Ausrécken',
    indent: 'Arécken',
    removeFormat: 'Formatéierung läschen',
    formatting: 'Formatéieren',
    fontSize: 'Schrëftgréisst',
    align: 'Ausriichten',
    hr: 'Horizontal Linn asetzen',
    undo: 'Réckgängeg',
    redo: 'Restauréieren',
    heading1: 'Iwwerschrëft 1',
    heading2: 'Iwwerschrëft 2',
    heading3: 'Iwwerschrëft 3',
    heading4: 'Iwwerschrëft 4',
    heading5: 'Iwwerschrëft 5',
    heading6: 'Iwwerschrëft 6',
    paragraph: 'Paragraf',
    code: 'Code',
    size1: 'Ganz kleng',
    size2: 'E bësse kleng',
    size3: 'Normal',
    size4: 'Grouss',
    size5: 'Méi grouss',
    size6: 'Ganz grouss',
    size7: 'Maximum',
    defaultFont: 'Standard Schrëft',
    viewSource: 'Quelltext ukucken'
  },
  tree: {
    noNodes: 'Keng Kniet verfügbar',
    noResults: 'Keng passend Kniet fonnt'
  }
}
