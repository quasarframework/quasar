export default {
  lang: 'fi-fi',
  label: {
    clear: 'Tyhjennä',
    ok: 'OK',
    cancel: 'Peruuta',
    close: 'Sulje',
    set: 'Aseta',
    select: 'Valitse',
    reset: 'Nollaa',
    remove: 'Poista',
    update: 'Päivitä',
    create: 'Luo',
    search: 'Etsi',
    filter: 'Suodata',
    refresh: 'Päivitä'
  },
  date: {
    days: 'Sunnuntai_Maanantai_Tiistai_Keskiviikko_Torstai_Perjantai_Lauantai'.split('_'),
    daysShort: 'Su_Ma_Ti_Ke_To_Pe_La'.split('_'),
    months: 'Tammikuu_Helmikuu_Maaliskuu_Huhtikuu_Toukokuu_Kesäkuu_Heinäkuu_Elokuu_Syyskuu_Lokakuu_Marraskuu_Joulukuu'.split('_'),
    monthsShort: 'Tam_Hel_Maa_Huh_Tou_Kes_Hei_Elo_Syy_Lok_Mar_Jou'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  pullToRefresh: {
    pull: 'Vedä alas päivittääksesi',
    release: 'Vapauta päivittääksesi',
    refresh: 'Päivitetään...'
  },
  table: {
    noData: 'Tieto ei saatavilla',
    noResults: 'Osumia ei löytynyt',
    loading: 'Ladataan...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 record selected.'
        : (rows === 0 ? 'No' : rows) + ' records selected.'
    },
    recordsPerPage: 'Tuloksia sivua kohti:',
    allRows: 'Kaikki',
    pagination: function (start, end, total) {
      return start + '-' + end + ' of ' + total
    },
    columns: 'Sarakkeet'
  },
  editor: {
    url: 'Verkko-osoite',
    bold: 'Lihavointi',
    italic: 'Kursivointi',
    strikethrough: 'Yliviivaus',
    underline: 'Alleviivaus',
    unorderedList: 'Järjestelemätön lista',
    orderedList: 'Järjestetty lista',
    subscript: 'Alaindeksi',
    superscript: 'Yläindeksi',
    hyperlink: 'Hyperlinkki',
    toggleFullscreen: 'Vaihda koko ruudun tilaan ja takaisin',
    quote: 'Lainaus',
    left: 'Tasaa vasemmalle',
    center: 'Tasaa keskelle',
    right: 'Tasaa oikealle',
    justify: 'Sovita riville',
    print: 'Tulosta',
    outdent: 'Vähennä sisennystä',
    indent: 'Lisää sisennystä',
    removeFormat: 'Poista muotoilu',
    formatting: 'Muotoilu',
    fontSize: 'Kirjasinkoko',
    align: 'Tasaus',
    hr: 'Lisää vaakaviiva',
    undo: 'Peruuta',
    redo: 'Tee uudelleen',
    header1: 'Otsikko taso 1',
    header2: 'Otsikko taso 2',
    header3: 'Otsikko taso 3',
    header4: 'Otsikko taso 4',
    header5: 'Otsikko taso 5',
    header6: 'Otsikko taso 6',
    paragraph: 'Kappale',
    code: 'Koodi',
    size1: 'Erittäin pieni',
    size2: 'Melko pieni',
    size3: 'Normaali',
    size4: 'Suurehko',
    size5: 'Suuri',
    size6: 'Erittäin suuri',
    size7: 'Maksimi',
    defaultFont: 'Oletuskirjasin'
  },
  tree: {
    noNodes: 'Ei solmuja saatavilla',
    noResults: 'Sopivia solmuja ei löytynyt'
  }
}
