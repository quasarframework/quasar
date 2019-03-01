export default {
  isoName: 'sl',
  nativeName: 'Slovenski Jezik',
  label: {
    clear: 'Počisti',
    ok: 'Vredu',
    cancel: 'Prekliči',
    close: 'Zapri',
    set: 'Postavi',
    select: 'Izberi',
    reset: 'Obnovi',
    remove: 'Odstrani',
    update: 'Posodobi',
    create: 'Ustvari',
    search: 'Išči',
    filter: 'Filtriraj',
    refresh: 'Ponovno naloži'
  },
  date: {
    days: 'Nedelja_Ponedeljek_Torek_Sreda_Četrtek_Petek_Sobota'.split('_'),
    daysShort: 'Ned_Pon_Tor_Sre_Čet_Pet_Sob'.split('_'),
    months: 'Januar_Februar_Marec_April_Maj_Junij_Julij_Avgust_September_Oktober_November_December'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Maj_Jun_Jul_Avg_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Nedelja, 1 Ponedeljek, ...
    format24h: true
  },
  table: {
    noData: 'Ni dosegljivih podatkov',
    noResults: 'Ne najdem ustreznic',
    loading: 'Nalagam...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 izbrana vrstica.'
        : (rows === 2 ? '2 izbrani vrstici.' : (rows === 0 ? 'Ni' : rows) + ' izbranih vrstic.')
    },
    recordsPerPage: 'Vrstic na stran:',
    allRows: 'Vse',
    pagination: function (start, end, total) {
      return start + '-' + end + ' od ' + total
    },
    columns: 'Stolpci'
  },
  editor: {
    url: 'URL',
    bold: 'Krepko',
    italic: 'Ležeče',
    strikethrough: 'Prečrtano',
    underline: 'Podčrtaj',
    unorderedList: 'Neoštevilčen seznam',
    orderedList: 'Oštevilčen seznam',
    subscript: 'Podpisano',
    superscript: 'Nadpisano',
    hyperlink: 'Hiper povezava',
    toggleFullscreen: 'Preklopi celoten zaslon',
    quote: 'Citat',
    left: 'Poravnaj levo',
    center: 'Poravnaj na sredino',
    right: 'Poravnaj desno',
    justify: 'Obojestranska poravnava',
    print: 'Natisni',
    outdent: 'Zmanjšaj zamik',
    indent: 'Povečaj zamik',
    removeFormat: 'Odstrani formatiranje',
    formatting: 'Formatiranje',
    fontSize: 'Velikost pisave',
    align: 'Poravnava',
    hr: 'Vstavi horizontalno pravilo',
    undo: 'Razveljavi',
    redo: 'Uveljavi',
    header1: 'Naslov 1',
    header2: 'Naslov 2',
    header3: 'Naslov 3',
    header4: 'Naslov 4',
    header5: 'Naslov 5',
    header6: 'Naslov 6',
    paragraph: 'Odstavek',
    code: 'Koda',
    size1: 'Najmanjše',
    size2: 'Manjše',
    size3: 'Običajna velikost',
    size4: 'Srednje veliko',
    size5: 'Veliko',
    size6: 'Večje',
    size7: 'Največje',
    defaultFont: 'Privzeta pisava'
  },
  tree: {
    noNodes: 'Ni dosegljivih vozlišč',
    noResults: 'Ne najdem ustreznih vozljišč'
  }
}
