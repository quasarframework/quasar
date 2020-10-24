export default {
  isoName: 'fi',
  nativeName: 'Suomi',
  label: {
    clear: 'Tyhjennä',
    ok: 'OK',
    cancel: 'Peruuta',
    close: 'Sulje',
    set: 'Aseta',
    select: 'Valitse',
    reset: 'Resetoi',
    remove: 'Poista',
    update: 'Päivitä',
    create: 'Luo',
    search: 'Etsi',
    filter: 'Suodata',
    refresh: 'Päivitä'
  },
  date: {
    days: 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
    daysShort: 'su_ma_ti_ke_to_pe_la'.split('_'),
    months: 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
    monthsShort: 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'päivää'
  },
  pullToRefresh: {
    pull: 'Vedä alas päivittääksesi',
    release: 'Vapauta päivittääksesi',
    refresh: 'Päivitetään...'
  },
  table: {
    noData: 'Ei tietoja',
    noResults: 'Ei tuloksia',
    loading: 'Ladataan...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 rivi valittu.'
        : rows + ' riviä valittu.'
    },
    recordsPerPage: 'Rivejä sivulla:',
    allRows: 'Kaikki',
    pagination: function (start, end, total) {
      return start + '-' + end + ' / ' + total
    },
    columns: 'Sarakkeet'
  },
  editor: {
    url: 'URL',
    bold: 'Lihavoitu',
    italic: 'Kursivoitu',
    strikethrough: 'Yliviivattu',
    underline: 'Alleviivattu',
    unorderedList: 'Järjestämätön Lista',
    orderedList: 'Järjestetty Lista',
    subscript: 'Alaindeksi',
    superscript: 'Yläindeksi',
    hyperlink: 'Hyperlinkki',
    toggleFullscreen: 'Vaihda näyttötilaa',
    quote: 'Lainaus',
    left: 'Asettele vasemmalle',
    center: 'Asettele keskelle',
    right: 'Asettele oikealle',
    justify: 'Asettele tasaten',
    print: 'Tulosta',
    outdent: 'Vähennä sisennystä',
    indent: 'Kasvata sisennystä',
    removeFormat: 'Poista muotoilu',
    formatting: 'Muotoilu',
    fontSize: 'Fonttikoko',
    align: 'Asettelu',
    hr: 'Lisää erotin',
    undo: 'Kumoa',
    redo: 'Toista',
    heading1: 'Otsikko 1',
    heading2: 'Otsikko 2',
    heading3: 'Otsikko 3',
    heading4: 'Otsikko 4',
    heading5: 'Otsikko 5',
    heading6: 'Otsikko 6',
    paragraph: 'Kappale',
    code: 'Koodi',
    size1: 'Erittäin pieni',
    size2: 'Pieni',
    size3: 'Normaali',
    size4: 'Isompi',
    size5: 'Iso',
    size6: 'Erittäin iso',
    size7: 'Maksimi',
    defaultFont: 'Oletusfontti',
    viewSource: 'Katso lähde'
  },
  tree: {
    noNodes: 'Ei solmuja saatavilla',
    noResults: 'Ei vastaavia solmuja'
  }
}
