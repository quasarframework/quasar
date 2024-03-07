export default {
  isoName: 'tl',
  nativeName: 'Tagalog',
  label: {
    clear: 'Maaliwalas',
    ok: 'Tiyakin',
    cancel: 'Kanselahin',
    close: 'Isara',
    set: 'Itakda',
    select: 'Pumili',
    reset: 'I-reset',
    remove: 'Alisin',
    update: 'Update',
    create: 'Lumikha',
    search: 'Maghanap',
    filter: 'Salain',
    refresh: 'Refresh',
    expand: label => (label ? `Palawakin "${ label }"` : 'Palawakin'),
    collapse: label => (label ? `Pagbagsak "${ label }"` : 'Pagbagsak')
  },
  date: {
    days: 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
    daysShort: 'Dom_Lun_Mar_Miy_Hiy_Byr_Sab'.split('_'),
    months: 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
    monthsShort: 'Ene_Peb_Mar_Abr_Mayo_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false,
    pluralDay: 'araw'
  },
  table: {
    noData: 'Walang available na data',
    noResults: 'Walang nakitang katugmang mga tala',
    loading: 'Naglo-load...',
    selectedRecords: rows => (
      rows === 1
        ? '1 napili ang record.'
        : (rows === 0 ? 'Hindi' : rows) + ' mga rekord na napili.'
    ),
    recordsPerPage: 'Mga tala sa bawat pahina:',
    allRows: 'Lahat',
    pagination: (start, end, total) => start + '-' + end + ' ng ' + total,
    columns: 'Mga hanay'
  },
  editor: {
    url: 'URL',
    bold: 'Matapang',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    underline: 'Salungguhit',
    unorderedList: 'Hindi Nakaayos na Listahan',
    orderedList: 'Inorder na Listahan',
    subscript: 'Subscript',
    superscript: 'Superscript',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'I-toggle ang Fullscreen',
    quote: 'Quote',
    left: 'I-align sa kaliwa',
    center: 'I-align sa gitna',
    right: 'I-align sa kanan',
    justify: 'I-align ang katwiran',
    print: 'Print',
    outdent: 'Bawasan ang indentation',
    indent: 'Dagdagan ang indentation',
    removeFormat: 'Alisin ang pag-format',
    formatting: 'Pag-format',
    fontSize: 'Laki ng Font',
    align: 'I-align',
    hr: 'Ipasok ang Pahalang na Panuntunan',
    undo: 'Pawalang-bisa',
    redo: 'Gawin muli',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    paragraph: 'Talata',
    code: 'Code',
    size1: 'Napakaliit',
    size2: 'Medyo maliit',
    size3: 'Normal',
    size4: 'Katamtaman-malaki',
    size5: 'Malaki',
    size6: 'Napakalaki',
    size7: 'Pinakamataas',
    defaultFont: 'Default na Font',
    viewSource: 'Tingnan ang Pinagmulan'
  },
  tree: {
    noNodes: 'Walang available na node',
    noResults: 'Walang nakitang tumutugmang node'
  }
}
