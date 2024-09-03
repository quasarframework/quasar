function plurals (n, opts) {
  const index = n % 10 === 1 && n % 100 !== 11
    ? 0
    : (
        n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 10 || n % 100 >= 20)
          ? 1
          : 2
      )

  return opts[ index ].replace(/{}/g, n)
}

export default {
  isoName: 'lt',
  nativeName: 'Lithuanian',
  label: {
    clear: 'Išvalyti',
    ok: 'Gerai',
    cancel: 'Atšaukti',
    close: 'Uždaryti',
    set: 'Nustatyti',
    select: 'Pasirinkti',
    reset: 'Atkurti',
    remove: 'Pašalinti',
    update: 'Atnaujinti',
    create: 'Sukurti',
    search: 'Ieškoti',
    filter: 'Filtruoti',
    refresh: 'Atnaujinti',
    expand: label => (label ? `Išskleisti "${ label }"` : 'Išskleisti'),
    collapse: label => (label ? `Sutraukti "${ label }"` : 'Sutraukti')
  },
  date: {
    days: 'Sekmadienis_Pirmadienis_Antradienis_Trečiadienis_Ketvirtadienis_Penktadienis_Šeštadienis'.split('_'),
    daysShort: 'S_P_A_T_K_Pn_Š'.split('_'),
    months: 'Sausis_Vasaris_Kovas_Balandis_Gegužė_Birželis_Liepa_Rugpjūtis_Rugsėjis_Spalis_Lapkritis_Gruodis'.split('_'),
    monthsShort: 'Sau_Vas_Kov_Bal_Geg_Bir_Lie_Rgp_Rgs_Spa_Lap_Gru'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dienos'
  },
  table: {
    noData: 'Nėra duomenų',
    noResults: 'Įrašų nerasta',
    loading: 'Įkeliama...',
    selectedRecords: rows => (
      rows > 0
        ? plurals(rows, [ 'Pasirinktas {} įrašas', 'Pasirinkti {} įrašai', 'Pasirinkta {} įrašų' ]) + '.'
        : 'Nepasirinktas joks įrašas.'
    ),
    recordsPerPage: 'Puslapyje:',
    allRows: 'Visi',
    pagination: (start, end, total) => start + '-' + end + ' iš ' + total,
    columns: 'Stulpeliai'
  },
  editor: {
    url: 'URL',
    bold: 'Paryškintasis',
    italic: 'Kursyvas',
    strikethrough: 'Perbraukimas',
    underline: 'Pabrauktasis',
    unorderedList: 'Ženkleliai',
    orderedList: 'Numeravimas',
    subscript: 'Apatinis indeksas',
    superscript: 'Viršutinis indeksas',
    hyperlink: 'Įterpti Hipersaitą',
    toggleFullscreen: 'Įjungti pilno ekrano režimą',
    quote: 'Cituoti',
    left: 'Lygiuoti kairėje',
    center: 'Centrinė lygiuotė',
    right: 'Lygiuoti dešinėje',
    justify: 'Abipusė lygiuotė',
    print: 'Spausdinti',
    outdent: 'Mažinti įtrauką',
    indent: 'Didinti įtrauką',
    removeFormat: 'Valyti formatavimą',
    formatting: 'Formatavimas',
    fontSize: 'Šrifto dydis',
    align: 'Lygiuoti',
    hr: 'Įterpti horizontalią liniją',
    undo: 'Anuliuoti veiksmą',
    redo: 'Perdaryti veiksmą',
    heading1: 'Antraštė 1',
    heading2: 'Antraštė 2',
    heading3: 'Antraštė 3',
    heading4: 'Antraštė 4',
    heading5: 'Antraštė 5',
    heading6: 'Antraštė 6',
    paragraph: 'Pastraipa',
    code: 'Kodas',
    size1: 'Mažiausias',
    size2: 'Mažas',
    size3: 'Normalus',
    size4: 'Vidutinis',
    size5: 'Didelis',
    size6: 'Labai didelis',
    size7: 'Didžiausias',
    defaultFont: 'Numatytasis šriftas',
    viewSource: 'Peržiūrėti kodo režimu'
  },
  tree: {
    noNodes: 'Nėra elementų',
    noResults: 'Elementų nerasta'
  }
}
