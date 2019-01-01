export default {
  isoName: 'sr',
  nativeName: 'српски језик',
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
    refresh: 'Osveži'
  },
  date: {
    days: 'Nedelja_Ponedeljak_Utorak_Sreda_Četvrtak_Petak_Subota'.split('_'),
    daysShort: 'Ned_Pon_Uto_Sre_Čet_Pet_Sub'.split('_'),
    months: 'Januar_Februar_Mart_April_Maj_Jun_Jul_Avgust_Septembar_Oktobar_Novembar_Decembar'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Maj_Jun_Jul_Avg_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  table: {
    noData: 'Nema podataka',
    noResults: 'Nema odgovarajućih zapisa',
    loading: 'Učitavanje...',
    selectedRecords: function (rows) {
      return rows > 1
        ? rows + ' izabranih redova.'
        : (rows === 0 ? 'Nema' : '1') + ' izabranih redova.'
    },
    recordsPerPage: 'Redova po stranici:',
    allRows: 'Sve',
    pagination: function (start, end, total) {
      return start + '-' + end + ' od ' + total
    },
    columns: 'Kolone'
  },
  editor: {
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
    print: 'Ispis',
    outdent: 'Smanjiti uvlačenje',
    indent: 'Povećati uvlačenje',
    removeFormat: 'Ukloniti formatiranje',
    formatting: 'Formatirati',
    fontSize: 'Veličina slova',
    align: 'Poravnati',
    hr: 'Ubaciti vodoravni lenjir',
    undo: 'Poništiti',
    redo: 'Vratiti',
    header1: 'Naslov 1',
    header2: 'Naslov 2',
    header3: 'Naslov 3',
    header4: 'Naslov 4',
    header5: 'Naslov 5',
    header6: 'Naslov 6',
    paragraph: 'Odlomak',
    code: 'Kod',
    size1: 'Najmanje',
    size2: 'Manje',
    size3: 'Normalno',
    size4: 'Srednje Veliko',
    size5: 'Veliko',
    size6: 'Već',
    size7: 'Najveće',
    defaultFont: 'Zadani font'
  },
  tree: {
    noNodes: 'Nema nijednog čvora',
    noResults: 'Nema odgovarajućih čvorova'
  }
}
