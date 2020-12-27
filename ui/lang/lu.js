export default {
  isoName: 'lu',
  nativeName: 'Kiluba',
  label: {
    clear: 'Eidel',
    ok: 'OK',
    cancel: 'Oofbriechen',
    close: 'Schléissen',
    set: 'Setzen',
    select: 'Auswielen',
    reset: 'Zerécksetzen',
    remove: 'Läschen',
    update: 'Aktualiséieren',
    create: 'Erstellen',
    search: 'Sichen',
    filter: 'Filter',
    refresh: 'Aktualiséieren'
  },
  date: {
    days: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
    daysShort: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
    months: 'Januar_Februar_März_Abrëll_Mäi_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort: 'Jan_Feb_Mär_Abr_Mäi_Jun_Jul_Aug_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'deeg'
  },
  table: {
    noData: 'Keng Donnéen do',
    noResults: 'Keng Anträg fonnt',
    loading: 'Luedt...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 ausgewielten Zeil.'
        : (rows === 0 ? 'Keng' : rows) + ' Zeilen ausgewielt.'
    },
    recordsPerPage: 'Zeilen pro Säit:',
    allRows: 'All',
    pagination: function (start, end, total) {
      return start + '-' + end + ' vun ' + total
    },
    columns: 'Kolonnen'
  },
  editor: {
    url: 'URL',
    bold: 'Fett',
    italic: 'Kursiv',
    strikethrough: 'Duerchgestrach',
    underline: 'Ënnerstrach',
    unorderedList: 'Ongeuerdnet Lëscht',
    orderedList: 'Geuerdnet Lëscht',
    subscript: 'déifgestallt',
    superscript: 'héichgestallt',
    hyperlink: 'Link',
    toggleFullscreen: 'Vollbild ëmschalten',
    quote: 'Zitat',
    left: 'lenksbündeg',
    center: 'zentréiert',
    right: 'riedsbündeg',
    justify: 'Ausriichten',
    print: 'Drucken',
    outdent: 'ausrëcken',
    indent: 'anrëcken',
    removeFormat: 'Formatéierung löschen',
    formatting: 'Formatéiere',
    fontSize: 'Schrëftgréisst',
    align: 'Ausriichten',
    hr: 'Horizontal Linn ansëtzen',
    undo: 'Réckgängeg',
    redo: 'Restauréieren',
    heading1: 'Iwwerschrëft 1',
    heading2: 'Iwwerschrëft 2',
    heading3: 'Iwwerschrëft 3',
    heading4: 'Iwwerschrëft 4',
    heading5: 'Iwwerschrëft 5',
    heading6: 'Iwwerschrëft 6',
    paragraph: 'Paragraphe',
    code: 'Code',
    size1: 'Ganz kleng',
    size2: 'E bëssi kleng',
    size3: 'Normal',
    size4: 'Grouss',
    size5: 'Gréisser',
    size6: 'Ganz grouss',
    size7: 'Maximum',
    defaultFont: 'Standard Schrëft',
    viewSource: 'Umthombo wokubuka'
  },
  tree: {
    noNodes: 'Keng Kniet verfügbar',
    noResults: 'Keng passend Kniet fonnt'
  }
}
