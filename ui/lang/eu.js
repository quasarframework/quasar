export default {
  isoName: 'eu',
  nativeName: 'Euskara',
  label: {
    clear: 'Ezabatu',
    ok: 'OK',
    cancel: 'Ezeztatu',
    close: 'Itxi',
    set: 'Ezarri',
    select: 'Hautatu',
    reset: 'Berrezarri',
    remove: 'Ezabatu',
    update: 'Eguneratu',
    create: 'Sortu',
    search: 'Bilatu',
    filter: 'Iragazi',
    refresh: 'Eguneratu'
  },
  date: {
    days: 'Igandea_Astelehena_Astearte_Asteazkena_Osteguna_Ostirala_Larunbata'.split('_'),
    daysShort: 'Iga_Ast_Asr_Asz_Ost_Osr_Lar'.split('_'),
    months: 'Urtarrila_Otsaila_Martxoa_Apirila_Maiatza_Ekaina_Uztailea_Abuztua_Iraila_Urria_Azaroa_Abendua'.split('_'),
    monthsShort: 'Urt_Ots_Mar_Api_Mai_Eka_Uzt_Abu_Ira_Urr_Aza_Abe'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'egun'
  },
  table: {
    noData: 'Daturik ez',
    noResults: 'Ez da emaitzarik aurkitu',
    loading: 'Kargatzen...',
    selectedRecords: function (rows) {
      return rows > 0
        ? rows + ' errenkada hautatuta.'
        : 'hautatutako errenkada gabe.'
    },
    recordsPerPage: 'Errenkadak orrialde bakoitzeko:',
    allRows: 'Denak',
    pagination: function (start, end, total) {
      return start + 'tik -' + end + 'ra, guztira ' + total
    },
    columns: 'Zutabeak'
  },
  editor: {
    url: 'URL',
    bold: 'Lodia',
    italic: 'Italikoa',
    strikethrough: 'Ezabaketa',
    underline: 'Azpimarratua',
    unorderedList: 'Zerrenda desordenatua',
    orderedList: 'Zerrenda ordenatua',
    subscript: 'Azpiindizea',
    superscript: 'Superindizea',
    hyperlink: 'Hiperesteka',
    toggleFullscreen: 'Aldatu pantaila osoa',
    quote: 'Hitzordua',
    left: 'Ezkerreko lerrokadura',
    center: 'Erdiko lerrokadura',
    right: 'Eskubiko lerrokadura',
    justify: 'Lerrokadura justifikatzea',
    print: 'Inprimatu',
    outdent: 'Murriztu indentazioa',
    indent: 'Indentazioa areagotzea',
    removeFormat: 'Ezabatu formatua',
    formatting: 'Formatua',
    fontSize: 'Letra-tamaina',
    align: 'Lerrokatu',
    hr: 'Txertatu lerro horizontala',
    undo: 'Desegin',
    redo: 'Berregin',
    heading1: 'Goiburua 1',
    heading2: 'Goiburua 2',
    heading3: 'Goiburua 3',
    heading4: 'Goiburua 4',
    heading5: 'Goiburua 5',
    heading6: 'Goiburua 6',
    paragraph: 'Paragrafoa',
    code: 'Kodea',
    size1: 'Oso txikia',
    size2: 'Txikia',
    size3: 'Normala',
    size4: 'Ertaina',
    size5: 'Handia',
    size6: 'Oso handia',
    size7: 'Gehienezkoa',
    defaultFont: 'Iturri lehenetsia',
    viewSource: 'Ikusi iturburu-kodea'
  },
  tree: {
    noNodes: 'Nodo erabilgarririk gabe',
    noResults: 'Ez da aurkitu dagozkion nodorik'
  }
}
