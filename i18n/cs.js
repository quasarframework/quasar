export default {
  lang: 'cs',
  label: {
    clear: 'Vymazat',
    ok: 'OK',
    cancel: 'Zrušit',
    close: 'Zavřít',
    set: 'Nastavit',
    select: 'Vybrat',
    reset: 'Resetovat',
    remove: 'Odstranit',
    update: 'Upravit',
    create: 'Vytvořit',
    save: 'Uložit',
    search: 'Hledat',
    filter: 'Filtrovat',
    refresh: 'Obnovit',
  },
  date: {
    days: 'Neděle_Pondělí_Úterý_Středa_Čtvrtek_Pátek_Sobota'.split('_'),
    daysShort: 'Ne_Po_Út_St_Čt_Pá_So'.split('_'),
    months: 'Leden_Únor_Březen_Duben_Květen_Červen_Červenec_Srpen_Září_Říjen_Listopad_Prosinec'.split('_'),
    monthsShort: 'Led_Úno_Bře_Dub_Kvě_Čen_Čec_Srp_Zář_Říj_Lis_Pro'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Neděle, 1 Pondělí, ...
    format24h: true
  },
  pullToRefresh: {
    pull: 'Potáhněte pro načtení',
    release: 'Pro načtení pusťte',
    refresh: 'Načítání...'
  },
  table: {
    noData: 'Žádná data',
    noResults: 'Žádné výsledky',
    loading: 'Nahrávám',
    selectedRows: function (rows) {
      return rows > 0
        ? rows + ' ' + (rows === 1 ? 'řádek vybrán' : (rows < 5 ? 'řádky vybrané' : 'řádků vybraných')) + '.'
        : 'Žádné vybrané řádky.'
    },
    rowsPerPage: 'Řádků na stránku:',
    allRows: 'Všechny řádky',
    pagination: function (start, end, total) {
      return start + '-' + end + ' z ' + total
    },
    columns: 'Sloupce'
  },
  editor: {
    url: 'URL adresa',
    bold: 'Tučně',
    italic: 'Kurzíva',
    strikethrough: 'Přeškrtnutě',
    underline: 'Podtrženě',
    unorderedList: 'Odrážky',
    orderedList: 'Číslovaný seznam',
    subscript: 'Dolní index',
    superscript: 'Horní index',
    hyperlink: 'Odkaz',
    toggleFullscreen: 'Zobrazení na celou obrazovku',
    quote: 'Citace',
    left: 'Zarovnat doleva',
    center: 'Vycentrovat',
    right: 'Zarovnat doprava',
    justify: 'Zarovnat podle okrajů',
    print: 'Tisk',
    outdent: 'Zmenšit odsazení',
    indent: 'Zvětšit odsazení',
    removeFormat: 'Odstranit formátování',
    formatting: 'Formátování',
    fontSize: 'Velikost písma',
    align: 'Zarovnat',
    hr: 'Vložit horizontální oddělovač',
    undo: 'Zpět',
    redo: 'Znovu',
    header1: 'Hlavička 1',
    header2: 'Hlavička 2',
    header3: 'Hlavička 3',
    header4: 'Hlavička 4',
    header5: 'Hlavička 5',
    header6: 'Hlavička 6',
    paragraph: 'Odstavec',
    code: 'Kód',
    size1: 'Velmi malé',
    size2: 'Malé',
    size3: 'Normální',
    size4: 'Středně velké',
    size5: 'Velké',
    size6: 'Velmi velké',
    size7: 'Největší',
    defaultFont: 'Základní písmo'
  },
  tree: {
    noNodes: 'Nejsou dostupné větve',
    noResults: 'Nebyly nalezeny vyhovující větve'
  }
}
