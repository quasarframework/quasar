export default {
  lang: 'de',
  label: {
    clear: 'Leeren',
    ok: 'Ok',
    cancel: 'Abbrechen',
    close: 'Schließen',
    set: 'Setzen',
    select: 'Auswählen',
    reset: 'Zurücksetzen',
    remove: 'Löschen',
    update: 'Aktualisieren',
    create: 'Erstellen',
    search: 'Suche',
    filter: 'Filter',
    refresh: 'Aktualisieren'
  },
  date: {
    days: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    daysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Dez'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  pullToRefresh: {
    pull: 'Ziehen zum aktualisieren',
    release: 'Loslassen zum aktualisieren',
    refresh: 'Aktualisiere...'
  },
  table: {
    noData: 'Keine Daten vorhanden.',
    noResults: 'Keine Einträge gefunden',
    loading: 'Lade...',
    selectedRecords: function (rows) {
      return rows > 1
        ? rows + ' ausgewählte Zeilen'
        : (rows === 0 ? 'Keine' : '1') + ' ausgewählt.'
    },
    recordsPerPage: 'Zeilen pro Seite',
    allRows: 'Alle',
    pagination: function (start, end, total) {
      return start + '-' + end + ' von ' + total
    },
    columns: 'Spalten'
  },
  editor: {
    url: 'URL',
    bold: 'Fett',
    italic: 'Kursiv',
    strikethrough: 'Durchgestrichen',
    underline: 'Unterstrichen',
    unorderedList: 'Ungeordnete Liste',
    orderedList: 'Geordnete Liste',
    subscript: 'tiefgestellt',
    superscript: 'hochgestellt',
    hyperlink: 'Link',
    toggleFullscreen: 'Vollbild umschalten',
    quote: 'Zitat',
    left: 'linksbündig',
    center: 'zentriert',
    right: 'rechtsbündig',
    justify: 'Ausrichten',
    print: 'Drucken',
    outdent: 'ausrücken',
    indent: 'einrücken',
    removeFormat: 'Entferne Formatierung',
    formatting: 'Formatiere',
    fontSize: 'Schriftgröße',
    align: 'Ausrichten',
    hr: 'Horizontale Linie einfügen',
    undo: 'Rückgänging',
    redo: 'Wiederherstellen',
    header1: 'Überschrift 1',
    header2: 'Überschrift 2',
    header3: 'Überschrift 3',
    header4: 'Überschrift 4',
    header5: 'Überschrift 5',
    header6: 'Überschrift 6',
    paragraph: 'Absatz',
    code: 'Code',
    size1: 'Sehr klein',
    size2: 'klein',
    size3: 'Normal',
    size4: 'Groß',
    size5: 'Größer',
    size6: 'Sehr groß',
    size7: 'Maximum',
    defaultFont: 'Standard Schrift'
  },
  tree: {
    noNodes: 'Keine Knoten verfügbar',
    noResults: 'Keine passenden Knoten gefunden'
  }
}
