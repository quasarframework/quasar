export default {
  isoName: 'bs-BA',
  nativeName: 'Bosanski jezik',
  label: {
    clear: 'Očisti',
    ok: 'OK',
    cancel: 'Odustani',
    close: 'Zatvori',
    set: 'Postavi',
    select: 'Odaberi',
    reset: 'Poništi',
    remove: 'Skloni',
    update: 'Ažuriraj',
    create: 'Dodaj',
    search: 'Traži',
    filter: 'Filter',
    refresh: 'Osvježi',
    expand: label => (label ? `Proširi "${ label }"` : 'Proširiti'),
    collapse: label => (label ? `Sažmi "${ label }"` : 'Kolaps')
  },
  date: {
    days: 'Nedjelja_Ponedjeljak_Utorak_Srijeda_Četvrtak_Petak_Subota'.split('_'),
    daysShort: 'Ned_Pon_Uto_Sri_Čet_Pet_Sub'.split('_'),
    months: 'Januar_Februar_Mart_April_Maj_Juni_Juli_August_Septembar_Oktobar_Novembar_Decembar'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dana'
  },
  table: {
    noData: 'Nema podataka',
    noResults: 'Nema odgovarajućih rezultata',
    loading: 'Učitavanje...',
    selectedRecords: rows => (
      rows > 1
        ? rows + ' odabranih redova.'
        : (rows === 0 ? 'Nema' : '1') + ' odabranih redova.'
    ),
    recordsPerPage: 'Redova po stranici:',
    allRows: 'Sve',
    pagination: (start, end, total) => start + '-' + end + ' od ' + total,
    columns: 'Kolone'
  },
  editor: {
    url: 'URL',
    bold: 'Podebljano',
    italic: 'Kurziv',
    strikethrough: 'Precrtano',
    underline: 'Podcrtano',
    unorderedList: 'Označena lista',
    orderedList: 'Numerirana lista',
    subscript: 'Potpisano',
    superscript: 'Natpisano',
    hyperlink: 'Hiperlink',
    toggleFullscreen: 'Puni ekran',
    quote: 'Citat',
    left: 'Poravnati ulijevo',
    center: 'Centrirati',
    right: 'Poravnati udesno',
    justify: 'Poravnati obostrano',
    print: 'Print',
    outdent: 'Smanjiti uvlačenje',
    indent: 'Povećati uvlačenje',
    removeFormat: 'Skloniti formatiranje',
    formatting: 'Formatirati',
    fontSize: 'Veličina slova',
    align: 'Poravnati',
    hr: 'Ubaciti vodoravno ravnalo',
    undo: 'Poništiti',
    redo: 'Vratiti',
    heading1: 'Naslov 1',
    heading2: 'Naslov 2',
    heading3: 'Naslov 3',
    heading4: 'Naslov 4',
    heading5: 'Naslov 5',
    heading6: 'Naslov 6',
    paragraph: 'Odlomak',
    code: 'Kod',
    size1: 'Vrlo malo',
    size2: 'Malo manje',
    size3: 'Normalno',
    size4: 'Srednje',
    size5: 'Veliko',
    size6: 'Vrlo veliko',
    size7: 'Najveće',
    defaultFont: 'Zadani font',
    viewSource: 'Pogledaj izvor'
  },
  tree: {
    noNodes: 'Nema nijednog čvora',
    noResults: 'Nema odgovarajućih čvorova'
  }
}
