export default {
  isoName: 'is',
  nativeName: 'Íslenska',
  label: {
    clear: 'Hreinsa',
    ok: 'Ókei',
    cancel: 'Hætta við',
    close: 'Loka',
    set: 'Setja',
    select: 'Velja',
    reset: 'Endurstilla',
    remove: 'Fjarlægja',
    update: 'Uppfæra',
    create: 'Búa til',
    search: 'Leita',
    filter: 'Sía',
    refresh: 'Endurhlaða',
    expand: label => (label ? `Stækka "${ label }"` : 'Stækkaðu'),
    collapse: label => (label ? `Draga saman "${ label }"` : 'Hrun')
  },
  date: {
    days: 'Sunnudagur_Mánudagur_Þriðjudagur_Miðvikudagur_Fimmtudagur_Föstudagur_Laugardagur'.split('_'),
    daysShort: 'Sun_Mán_Þri_Mið_Fim_Fös_Lau'.split('_'),
    months: 'Janúar_Febrúar_Mars_Apríl_Maí_Júní_Júlí_Ágúst_September_Október_Nóvember_Desember'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Maí_Jún_Júl_Ágú_Sep_Okt_Nóv_Des'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dagar'
  },
  table: {
    noData: 'Engin gögn tiltæk',
    noResults: 'Engar samsvarandi skrár fundust',
    loading: 'Augnablik...',
    selectedRecords: rows => (
      rows === 1
        ? '1 færsla valin.'
        : (rows === 0 ? 'Engar' : rows) + ' færslur valdar.'
    ),
    recordsPerPage: 'Færslur á hverri síðu:',
    allRows: 'Allar',
    pagination: (start, end, total) => start + '-' + end + ' af ' + total,
    columns: 'Dálkar'
  },
  editor: {
    url: 'Slóð',
    bold: 'Feitletra',
    italic: 'Skáletra',
    strikethrough: 'Strika í gegnum',
    underline: 'Undirstrika',
    unorderedList: 'Óraðaður listi',
    orderedList: 'Raðaður listi',
    subscript: 'Hnéletur',
    superscript: 'Brjóstletur',
    hyperlink: 'Hlekkur',
    toggleFullscreen: 'Fullskjár af/á',
    quote: 'Tilvitnun',
    left: 'Vinstrijafna',
    center: 'Miðjujafna',
    right: 'Hægrijafna',
    justify: 'Jafna',
    print: 'Prenta',
    outdent: 'Minnka inndrátt',
    indent: 'Auka inndrátt',
    removeFormat: 'Hreinsa snið',
    formatting: 'Snið',
    fontSize: 'Leturstærð',
    align: 'Jafna',
    hr: 'Lárétt lína',
    undo: 'Afturkalla',
    redo: 'Endurgera',
    heading1: 'Fyrirsögn 1',
    heading2: 'Fyrirsögn 2',
    heading3: 'Fyrirsögn 3',
    heading4: 'Fyrirsögn 4',
    heading5: 'Fyrirsögn 5',
    heading6: 'Fyrirsögn 6',
    paragraph: 'Efnisgrein',
    code: 'Kóði',
    size1: 'Mjög lítill',
    size2: 'Dálítið lítill',
    size3: 'Venjulegur',
    size4: 'Miðlungsstór',
    size5: 'Stór',
    size6: 'Mjög stór',
    size7: 'Risastór',
    defaultFont: 'Sjálfgefið letur',
    viewSource: 'Sjá kóða'
  },
  tree: {
    noNodes: 'Engar nóður í boði',
    noResults: 'Engar samsvarandi nóður fundust'
  }
}
