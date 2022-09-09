export default {
  isoName: 'sv',
  nativeName: 'Svenska',
  label: {
    clear: 'Rensa',
    ok: 'OK',
    cancel: 'Avbryt',
    close: 'Stäng',
    set: 'Sätt',
    select: 'Välj',
    reset: 'Nollställ',
    remove: 'Ta bort',
    update: 'Uppdatera',
    create: 'Skapa',
    search: 'Sök',
    filter: 'Filtrera',
    refresh: 'Uppdatera'
  },
  date: {
    days: 'Söndag_Måndag_Tisdag_Onsdag_Torsdag_Fredag_Lördag'.split('_'),
    daysShort: 'Sön_Mån_Tis_Ons_Tor_Fre_Lör'.split('_'),
    months: 'Januari_Februari_Mars_April_Maj_Juni_Juli_Augusti_September_Oktober_November_December'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dagar'
  },
  table: {
    noData: 'Ingen data tillgänglig',
    noResults: 'Inget resultat matchar',
    loading: 'Laddar...',
    selectedRecords: rows => (
      rows === 1
        ? '1 vald rad.'
        : (rows === 0 ? 'Inga' : rows) + ' valda rader.'
    ),
    recordsPerPage: 'Rader per sida:',
    allRows: 'Alla',
    pagination: (start, end, total) => start + '-' + end + ' av ' + total,
    columns: 'Kolumner'
  },
  editor: {
    url: 'URL',
    bold: 'Fet',
    italic: 'Kursiv',
    strikethrough: 'Genomstruken',
    underline: 'Understruken',
    unorderedList: 'Punktlista',
    orderedList: 'Numrerad lista',
    subscript: 'Nedsänkt',
    superscript: 'Upphöjt',
    hyperlink: 'Länk',
    toggleFullscreen: 'Växla helskärm',
    quote: 'Citat',
    left: 'Vänsterjustera',
    center: 'Centrera',
    right: 'Högerjustera',
    justify: 'Justera',
    print: 'Skriv ut',
    outdent: 'Minska indrag',
    indent: 'Öka indrag',
    removeFormat: 'Ta bort formatering',
    formatting: 'Formatering',
    fontSize: 'Teckenstorlek',
    align: 'Justera',
    hr: 'Infoga vågrät linje',
    undo: 'Ångra',
    redo: 'Gör om',
    heading1: 'Rubrik 1',
    heading2: 'Rubrik 2',
    heading3: 'Rubrik 3',
    heading4: 'Rubrik 4',
    heading5: 'Rubrik 5',
    heading6: 'Rubrik 6',
    paragraph: 'Stycke',
    code: 'Kod',
    size1: 'Väldigt liten',
    size2: 'Liten',
    size3: 'Normal',
    size4: 'Större än normal',
    size5: 'Stor',
    size6: 'Väldigt stor',
    size7: 'Maximalt stor',
    defaultFont: 'Standardteckensnitt',
    viewSource: 'Visa källa'
  },
  tree: {
    noNodes: 'Inga noder tillgängliga',
    noResults: 'Inga noder matchar'
  }
}
