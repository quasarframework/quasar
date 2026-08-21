export default {
  isoName: 'sr',
  nativeName: 'srpski jezik',
  label: {
    clear: 'Obriši',
    ok: 'OK',
    cancel: 'Odustani',
    close: 'Zatvori',
    set: 'Postavi',
    select: 'Izaberi',
    reset: 'Poništi',
    remove: 'Ukloni',
    update: 'Ažuriraj',
    create: 'Dodaj',
    search: 'Traži',
    filter: 'Filter',
    refresh: 'Osveži',
    minimum: 'Minimum',
    maximum: 'Maksimum',
    range: 'Opseg',
    noValue: 'Bez vrednosti',
    resize: 'Promeni veličinu',
    expand: label => (label ? `Proširi "${label}"` : 'Proširiti'),
    collapse: label => (label ? `Skupi "${label}"` : 'Skupiti')
  },
  date: {
    days: 'Nedelja_Ponedeljak_Utorak_Sreda_Četvrtak_Petak_Subota'.split('_'),
    daysShort: 'Ned_Pon_Uto_Sre_Čet_Pet_Sub'.split('_'),
    months:
      'Januar_Februar_Mart_April_Maj_Jun_Jul_Avgust_Septembar_Oktobar_Novembar_Decembar'.split(
        '_'
      ),
    monthsShort: 'Jan_Feb_Mar_Apr_Maj_Jun_Jul_Avg_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dana',
    prevMonth: 'Prethodni mesec',
    nextMonth: 'Sledeći mesec',
    prevYear: 'Prethodna godina',
    nextYear: 'Sledeća godina',
    today: 'Danas',
    prevRangeYears: range => `Prethodnih ${range} godina`,
    nextRangeYears: range => `Sledećih ${range} godina`,
    hour: 'Sat',
    minute: 'Minut',
    second: 'Sekunda',
    now: 'Trenutno vreme'
  },
  table: {
    noData: 'Nema podataka',
    noResults: 'Nema odgovarajućih zapisa',
    loading: 'Učitavanje...',
    selectedRecords: rows =>
      rows > 1
        ? rows + ' izabranih redova.'
        : (rows === 0 ? 'Nema' : '1') + ' izabranih redova.',
    recordsPerPage: 'Redova po stranici:',
    allRows: 'Sve',
    pagination: (start, end, total) => start + '-' + end + ' od ' + total,
    columns: 'Kolone',
    selectAllRows: 'Izaberi sve redove',
    selectRow: 'Izaberi red'
  },
  pagination: {
    label: 'Paginacija',
    first: 'Prva stranica',
    prev: 'Prethodna stranica',
    next: 'Sledeća stranica',
    last: 'Poslednja stranica'
  },
  carousel: {
    prevSlide: 'Prethodni slajd',
    nextSlide: 'Sledeći slajd'
  },
  colorPicker: {
    spectrum: 'Spektar',
    tune: 'Podešavanje',
    palette: 'Paleta',
    value: 'Vrednost boje',
    hue: 'Nijansa',
    alpha: 'Neprozirnost'
  },
  uploader: {
    addFiles: 'Izaberi datoteke',
    upload: 'Otpremi datoteke',
    abort: 'Prekini otpremanje',
    removeQueued: 'Ukloni datoteke na čekanju',
    removeUploaded: 'Ukloni otpremljene datoteke',
    removeFile: 'Ukloni datoteku'
  },
  editor: {
    toolbar: 'Traka sa alatkama uređivača',
    url: 'URL',
    bold: 'Podebljano',
    italic: 'Nakošeno',
    strikethrough: 'Precrtano',
    underline: 'Podcrtano',
    unorderedList: 'Označena lista',
    orderedList: 'Numerisana lista',
    subscript: 'Potpisano',
    superscript: 'Natpisano',
    hyperlink: 'Hiperlink',
    toggleFullscreen: 'Ceo ekran',
    quote: 'Citat',
    left: 'Poravnati ulevo',
    center: 'Centrirati',
    right: 'Poravnati udesno',
    justify: 'Poravnati obostrano',
    print: 'Štampa',
    outdent: 'Smanjiti uvlačenje',
    indent: 'Povećati uvlačenje',
    removeFormat: 'Ukloniti formatiranje',
    formatting: 'Formatirati',
    fontSize: 'Veličina slova',
    align: 'Poravnati',
    hr: 'Ubaciti horizontalnu liniju',
    undo: 'Poništiti',
    redo: 'Vratiti',
    heading1: 'Naslov 1',
    heading2: 'Naslov 2',
    heading3: 'Naslov 3',
    heading4: 'Naslov 4',
    heading5: 'Naslov 5',
    heading6: 'Naslov 6',
    paragraph: 'Paragraf',
    code: 'Kod',
    size1: 'Najmanje',
    size2: 'Manje',
    size3: 'Normalno',
    size4: 'Srednje Veliko',
    size5: 'Veliko',
    size6: 'Veće',
    size7: 'Najveće',
    defaultFont: 'Podrazumevani font',
    viewSource: 'Pogledaj izvor'
  },
  tree: {
    noNodes: 'Nema nijednog čvora',
    noResults: 'Nema odgovarajućih čvorova'
  }
}
