export default {
  isoName: 'lv',
  nativeName: 'Latviešu valoda',
  label: {
    clear: 'Attīrīt',
    ok: 'OK',
    cancel: 'Atcelt',
    close: 'Aizvērt',
    set: 'Iestatīt',
    select: 'Izvēlēties',
    reset: 'Atiestatīt',
    remove: 'Noņemt',
    update: 'Atjaunināt',
    create: 'Izveidot',
    search: 'Meklēt',
    filter: 'Filtēt',
    refresh: 'Atjaunot'
  },
  date: {
    days: 'Svētdiena_Pirmdiena_Otrdiena_Trešdiena_Ceturtdiena_Piektdiena_Sestdiena'.split('_'),
    daysShort: 'Sv_Pi_Ot_Tr_Ce_Pi_Se'.split('_'),
    months: 'Janvāris_Februāris_Marts_Aprīlis_Maijs_Jūnijs_Jūlijs_Augusts_Septembris_Okrobris_Novembris_Decembris'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Mai_Jūn_Jūl_Aug_Sep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dienas'
  },
  table: {
    noData: 'Nav datu',
    noResults: 'Ieraksti nav atrasti',
    loading: 'Atjaunojas...',
    selectedRecords: rows => (
      rows === 1
        ? '1 izvēlēta rinda.'
        : (rows === 0 ? 'Nav' : rows) + ' izvēlētas rindas.'
    ),
    recordsPerPage: 'Rindas lapā:',
    allRows: 'Visas',
    pagination: (start, end, total) => start + '-' + end + ' no ' + total,
    columns: 'Kolonnas'
  },
  editor: {
    url: 'URL',
    bold: 'Trekns',
    italic: 'Kursīvs',
    strikethrough: 'Nosvītrots',
    underline: 'Apakšsvītra',
    unorderedList: 'Marķētais saraksts',
    orderedList: 'Numurētais saraksts',
    subscript: 'Apakšraksts',
    superscript: 'Augšraksts',
    hyperlink: 'Saite',
    toggleFullscreen: 'Pilnekrāna režīms',
    quote: 'Citāts',
    left: 'Izlīdzināt gar kreiso malu',
    center: 'Centrēt',
    right: 'Izlīdzināt gar labo malu',
    justify: 'Izlīdzināt gar abām malām',
    print: 'Drukāt',
    outdent: 'Samazināt atkāpi',
    indent: 'Palielināt atkāpi',
    removeFormat: 'Noņemt formatējumu',
    formatting: 'Formatēt',
    fontSize: 'Fonta izmērs',
    align: 'Izlīdzināt',
    hr: 'Ievietot horizontālo līniju',
    undo: 'Atsaukt',
    redo: 'Atkārtot',
    heading1: 'Virsraksts 1',
    heading2: 'Virsraksts 2',
    heading3: 'Virsraksts 3',
    heading4: 'Virsraksts 4',
    heading5: 'Virsraksts 5',
    heading6: 'Virsraksts 6',
    paragraph: 'Rindkopa',
    code: 'Kods',
    size1: 'Ļoti mazs',
    size2: 'Mazs',
    size3: 'Normāls',
    size4: 'Vidējs',
    size5: 'Liels',
    size6: 'Ļoti liels',
    size7: 'Maksimāls',
    defaultFont: 'Fonts pēc noklusējuma',
    viewSource: 'Skatīt avotu'
  },
  tree: {
    noNodes: 'Nav pieejami mezgli',
    noResults: 'Nav atrasti atbilstošie mezgli'
  }
}
