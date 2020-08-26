export default {
  isoName: 'cs',
  nativeName: 'Čeština',
  label: {
    clear: 'Smazat',
    ok: 'OK',
    cancel: 'Zrušit',
    close: 'Zavřít',
    set: 'Nastavit',
    select: 'Vybrat',
    reset: 'Reset',
    remove: 'Odebrat',
    update: 'Opravit',
    create: 'Vytvořit',
    search: 'Hledat',
    filter: 'Filtrovat',
    refresh: 'Obnovit'
  },
  date: {
    days: 'Neděle_Pondělí_Úterý_Středa_Čtvrtek_Pátek_Sobota'.split('_'),
    daysShort: 'Ne_Po_Út_St_Čt_Pá_So'.split('_'),
    months: 'Leden_Únor_Březen_Duben_Květen_Červen_Červenec_Srpen_Září_Říjen_Listopad_Prosinec'.split(
      '_'),
    monthsShort: 'Led_Úno_Bře_Dub_Kvě_Čvn_Čvc_Srp_Zář_Říj_Lis_Pro'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dny'
  },
  table: {
    noData: 'Žádná data k dispozici',
    noResults: 'Nebyly nalezeny žádné odpovídající záznamy',
    loading: 'Načítá se...',
    selectedRecords: function (rows) {
      switch (rows) {
        case 0:
          return 'Nejsou vybrány žádné řádky.'
        case 1:
          return 'Vybrán 1 řádek.'
        case 2:
          return 'Vybrány 2 řádky.'
        case 3:
          return 'Vybrány 3 řádky.'
        case 4:
          return 'Vybrány 4 řádky.'
      }
      return ('Vybráno ' + rows + ' řádků.')
    },
    recordsPerPage: 'Počet řádků na stránku:',
    allRows: 'Všechny',
    pagination: function (start, end, total) {
      return start + '-' + end + ' z ' + total
    },
    columns: 'Sloupce'
  },
  editor: {
    url: 'URL',
    bold: 'Tučně',
    italic: 'Kurzíva',
    strikethrough: 'Přeškrtnuté',
    underline: 'Podtržené',
    unorderedList: 'Odrážkový seznam',
    orderedList: 'Číslovaný seznam',
    subscript: 'Dolní index',
    superscript: 'Horní index',
    hyperlink: 'Odkaz',
    toggleFullscreen: 'Přepnout zobrazení na celou obrazovku',
    quote: 'Bloková citace',
    left: 'Zarovnat vlevo',
    center: 'Zarovnat na střed',
    right: 'Zarovnat vpravo',
    justify: 'Zarovnat do bloku',
    print: 'Tisk',
    outdent: 'Zmenšit odsazení',
    indent: 'Zvětšit odsazení',
    removeFormat: 'Vymazat formátování',
    formatting: 'Styl',
    fontSize: 'Velikost písma',
    align: 'Zarovnání',
    hr: 'Vložit oddělovač',
    undo: 'Zpět',
    redo: 'Znovu',
    heading1: 'Nadpis 1',
    heading2: 'Nadpis 2',
    heading3: 'Nadpis 3',
    heading4: 'Nadpis 4',
    heading5: 'Nadpis 5',
    heading6: 'Nadpis 6',
    paragraph: 'Odstavec',
    code: 'Kód',
    size1: 'Velmi malé',
    size2: 'Malé',
    size3: 'Normální',
    size4: 'Středně velké',
    size5: 'Velké',
    size6: 'Velmi velké',
    size7: 'Maximum',
    defaultFont: 'Výchozí písmo',
    viewSource: 'Zobrazit zdroj'
  },
  tree: {
    noNodes: 'Žádné uzly',
    noResults: 'Žádné odpovídající uzly nenalezeny'
  }
}
