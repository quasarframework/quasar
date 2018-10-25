export default {
  lang: 'hu',
  label: {
    clear: 'Törlés',
    ok: 'OK',
    cancel: 'Mégsem',
    close: 'Bezárás',
    set: 'Beállítás',
    select: 'Kiválasztás',
    reset: 'Visszaállítás',
    remove: 'Eltávolítás',
    update: 'Módosítás',
    create: 'Létrehozás',
    search: 'Keresés',
    filter: 'Szűrés',
    refresh: 'Frissítés'
  },
  date: {
    days: 'Vasárnap_Hétfő_Kedd_Szerda_Csütörtök_Péntek_Szombat'.split('_'),
    daysShort: 'Vas_Hét_Ke_Sze_Csü_Pén_Szo'.split('_'),
    months: 'Január_Február_Március_Április_Május_Június_Július_Augusztus_Szeptember_Október_November_December'.split('_'),
    monthsShort: 'Jan_Feb_Már_Ápr_Máj_Jún_Júl_Aug_Szep_Okt_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  pullToRefresh: {
    pull: 'Húzza le a frissítéshez',
    release: 'Engedje el a frissítéshez',
    refresh: 'Frissítés...'
  },
  table: {
    noData: 'Nincs elérhető adat',
    noResults: 'Nincsenek egyező találatok',
    loading: 'Betöltés...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 kiválasztott elem.'
        : (rows === 0 ? 'Nincs' : rows) + ' kiválasztott elem.'
    },
    recordsPerPage: 'Elemek száma oldalanként:',
    allRows: 'Összes',
    pagination: function (start, end, total) {
      return start + '-' + end + ' / ' + total
    },
    columns: 'Oszlopok'
  },
  editor: {
    url: 'URL',
    bold: 'Félkövér',
    italic: 'Dőlt',
    strikethrough: 'Áthúzott',
    underline: 'Aláhúzott',
    unorderedList: 'Felsorolás',
    orderedList: 'Számozás',
    subscript: 'Alsó index',
    superscript: 'Felső index',
    hyperlink: 'Hivatkozás',
    toggleFullscreen: 'Teljes képernyő',
    quote: 'Idézet',
    left: 'Balra igazítás',
    center: 'Középre igazítás',
    right: 'Jobbra igazítás',
    justify: 'Sorkizárás',
    print: 'Nyomtatás',
    outdent: 'Behúzás csökkentése',
    indent: 'Behúzás növelése',
    removeFormat: 'Formázás törlése',
    formatting: 'Formázás',
    fontSize: 'Betűméret',
    align: 'Igazítás',
    hr: 'Vízszintes elválasztó beillesztése',
    undo: 'Visszavonás',
    redo: 'Mégis',
    header1: 'Címsor 1',
    header2: 'Címsor 2',
    header3: 'Címsor 3',
    header4: 'Címsor 4',
    header5: 'Címsor 5',
    header6: 'Címsor 6',
    paragraph: 'Paragrafus',
    code: 'Kód',
    size1: 'Nagyon kicsi',
    size2: 'Kicsi',
    size3: 'Normál',
    size4: 'Közepesen nagy',
    size5: 'Nagy',
    size6: 'Nagyon nagy',
    size7: 'Maximális',
    defaultFont: 'Alapértelmezett betűtípus'
  },
  tree: {
    noNodes: 'Nincsenek elérhető elemek',
    noResults: 'Nincsenek egyező találatok'
  }
}
