export default {
  isoName: 'pl',
  nativeName: 'Polski',
  label: {
    clear: 'Wyczyść',
    ok: 'OK',
    cancel: 'Anuluj',
    close: 'Zamknij',
    set: 'Ustaw',
    select: 'Wybierz',
    reset: 'Zresetuj',
    remove: 'Usuń',
    update: 'Zaktualizuj',
    create: 'Utwórz',
    search: 'Szukaj',
    filter: 'Filtruj',
    refresh: 'Odśwież'
  },
  date: {
    days: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split('_'),
    daysShort: 'Nd_Pon_Wt_Śr_Czw_Ptk_Sob'.split('_'),
    months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień'.split('_'),
    monthsShort: 'Sty_Lut_Mar_Kwi_Maj_Cze_Lip_Sie_Wrz_Paź_Lis_Gru'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  table: {
    noData: 'Brak dostępnych danych',
    noResults: 'Nie znaleziono pasujących wpisów',
    loading: 'Ładowanie...',
    selectedRecords: function (rows) {
      return rows > 1
        ? rows + ' zaznaczony(ch) wiersz(y).'
        : (rows === 0 ? 'Brak' : '1') + ' zaznaczony wiersz.'
    },
    recordsPerPage: 'Wierszy na stronę:',
    allRows: 'Wszystkie',
    pagination: function (start, end, total) {
      return start + '-' + end + ' z ' + total
    },
    columns: 'Kolumny'
  },
  editor: {
    url: 'URL',
    bold: 'Pogrubienie',
    italic: 'Kursywa',
    strikethrough: 'Przekreślenie',
    underline: 'Podkreślenie',
    unorderedList: 'Nieuporządkowana lista',
    orderedList: 'Uporządkowana lista',
    subscript: 'Indeks dolny',
    superscript: 'Indeks górny',
    hyperlink: 'Hiperłącze',
    toggleFullscreen: 'Przełącz na tryb pełnoekranowy',
    quote: 'Zacytuj',
    left: 'Wyrównaj do lewej',
    center: 'Wyrównaj do środka',
    right: 'Wyrównaj do prawej',
    justify: 'Wyjustuj',
    print: 'Drukuj',
    outdent: 'Zmniejsz wcięcie',
    indent: 'Zwiększ wcięcie',
    removeFormat: 'Usuń formatowanie',
    formatting: 'Formatowanie',
    fontSize: 'Rozmiar czcionki',
    align: 'Wyrównanie',
    hr: 'Wstaw poziomą linię',
    undo: 'Cofnij',
    redo: 'Przywróć',
    heading1: 'Nagłówek 1',
    heading2: 'Nagłówek 2',
    heading3: 'Nagłówek 3',
    heading4: 'Nagłówek 4',
    heading5: 'Nagłówek 5',
    heading6: 'Nagłówek 6',
    paragraph: 'Paragraf',
    code: 'Kod',
    size1: 'Bardzo mała',
    size2: 'Mała',
    size3: 'Normalna',
    size4: 'Średnio-duża',
    size5: 'Duża',
    size6: 'Bardzo duża',
    size7: 'Maksymalna',
    defaultFont: 'Domyślna czcionka',
    viewSource: 'Pokaż źródło'
  },
  tree: {
    noNodes: 'Brak dostępnych gałęzi',
    noResults: 'Nie znaleziono pasujących gałęzi'
  }
}
