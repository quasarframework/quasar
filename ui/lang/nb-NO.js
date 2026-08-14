export default {
  isoName: 'nb-NO',
  nativeName: 'Norsk',
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
    refresh: 'Oppdater',
    minimum: 'Minimum',
    maximum: 'Maksimum',
    range: 'Område',
    noValue: 'Ingen verdi',
    resize: 'Endre størrelse',
    expand: label => (label ? `Utvid "${label}"` : 'Utvide'),
    collapse: label => (label ? `Skjul "${label}"` : 'Kollapse')
  },
  date: {
    days: 'Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag'.split('_'),
    daysShort: 'Søn_Man_Tir_Ons_Tor_Fre_Lør'.split('_'),
    months:
      'Januar_Februar_Mars_April_Mai_Juni_Juli_August_September_Oktober_November_Desember'.split(
        '_'
      ),
    monthsShort: 'Jan_Feb_Mar_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dager',
    prevMonth: 'Forrige måned',
    nextMonth: 'Neste måned',
    prevYear: 'Forrige år',
    nextYear: 'Neste år',
    today: 'I dag',
    prevRangeYears: range => `Forrige ${range} år`,
    nextRangeYears: range => `Neste ${range} år`,
    hour: 'Time',
    minute: 'Minutt',
    second: 'Sekund',
    now: 'Nåværende tid'
  },
  table: {
    noData: 'Ingen data tilgjengelig',
    noResults: 'Ingen treff i data funnet',
    loading: 'Laster...',
    selectedRecords: rows =>
      rows === 1
        ? '1 rad valgt.'
        : (rows === 0 ? 'Ingen' : rows) + ' rader valgt.',
    recordsPerPage: 'Rader pr side:',
    allRows: 'Alle',
    pagination: (start, end, total) => start + '-' + end + ' av ' + total,
    columns: 'Kolonner',
    selectAllRows: 'Velg alle rader',
    selectRow: 'Velg rad'
  },
  pagination: {
    label: 'Paginering',
    first: 'Første side',
    prev: 'Forrige side',
    next: 'Neste side',
    last: 'Siste side'
  },
  carousel: {
    prevSlide: 'Forrige lysbilde',
    nextSlide: 'Neste lysbilde'
  },
  colorPicker: {
    spectrum: 'Spektrum',
    tune: 'Finjuster',
    palette: 'Palett',
    value: 'Fargeverdi',
    hue: 'Fargetone',
    alpha: 'Dekkevne'
  },
  uploader: {
    addFiles: 'Velg filer',
    upload: 'Last opp filer',
    abort: 'Avbryt opplasting',
    removeQueued: 'Fjern filer i kø',
    removeUploaded: 'Fjern opplastede filer',
    removeFile: 'Fjern fil'
  },
  editor: {
    toolbar: 'Editorens verktøylinje',
    url: 'URL',
    bold: 'Fet',
    italic: 'Kursiv',
    strikethrough: 'Gjennomstreking',
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
    outdent: 'Mindre innrykk',
    indent: 'Større innrykk',
    removeFormat: 'Fjern formatering',
    formatting: 'Formatering',
    fontSize: 'Fontstørrelse',
    align: 'Stilling',
    hr: 'Sett inn horisontal linje',
    undo: 'Angre',
    redo: 'Gjenta',
    heading1: 'Overskrift 1',
    heading2: 'Overskrift 2',
    heading3: 'Overskrift 3',
    heading4: 'Overskrift 4',
    heading5: 'Overskrift 5',
    heading6: 'Overskrift 6',
    paragraph: 'Avsnitt',
    code: 'Kode',
    size1: 'Veldig liten',
    size2: 'Liten',
    size3: 'Normal',
    size4: 'Medium-stor',
    size5: 'Stor',
    size6: 'Veldig stor',
    size7: 'Maksimal',
    defaultFont: 'Normal font',
    viewSource: 'Se kilde'
  },
  tree: {
    noNodes: 'Ingen noder tilgjengelig',
    noResults: 'Ingen treff i noder funnet'
  }
}
