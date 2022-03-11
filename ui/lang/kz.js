function plurals (n, opts) {
  return opts[ n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2 ]
}

export default {
  isoName: 'kz',
  nativeName: 'Қазақша',
  label: {
    clear: 'Тазалау',
    ok: 'OK',
    cancel: 'Бас тарту',
    close: 'Жабу',
    set: 'Орнату',
    select: 'Таңдау',
    reset: 'Қалпына келтіру',
    remove: 'Өшіру',
    update: 'Жаңарту',
    create: 'Жасау',
    search: 'Іздеу',
    filter: 'Сүзгі',
    refresh: 'Жаңарту'
  },
  date: {
    days: 'Жексенбі_Дүйсенбі_Сейсенбі_Сәрсенбі_Бейсенбі_Жұма_Сенбі'.split('_'),
    daysShort: 'Жс_Дс_Сс_Ср_Бс_Жм_Сб'.split('_'),
    months: 'Қаңтар_Ақпан_Наурыз_Сәуір_Мамыр_Маусым_Шілде_Тамыз_Қыркүйек_Қазан_Қараша_Желтоқсан'.split('_'),
    monthsShort: 'Қаң_Ақп_Нау_Сәу_Мам_Мау_Шіл_Там_Қыр_Қаз_Қар_Жел'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'күн'
  },
  table: {
    noData: 'Мәлімет жоқ',
    noResults: 'Сәйкестік табылмады',
    loading: 'Жүктеу...',
    selectedRecords: function (rows) {
      return rows > 0
        ? rows + ' ' + plurals(rows, [ 'жол таңдалды', 'жол таңдалды', 'жол таңдалды' ]) + '.'
        : 'Ешбір жол таңдалмады.'
    },
    recordsPerPage: 'Беттегі жолдар:',
    allRows: 'Бәрі',
    pagination: function (start, end, total) {
      return start + '-' + end + ' из ' + total
    },
    columns: 'Бағандар'
  },
  editor: {
    url: 'URL',
    bold: 'Қалың',
    italic: 'Курсив',
    strikethrough: 'Сызылған',
    underline: 'Асты сызылған',
    unorderedList: 'Маркерленген тізім',
    orderedList: 'Нөмірленген тізім',
    subscript: 'Астыңғы таңба',
    superscript: 'Үстінгі таңба',
    hyperlink: 'Гиперсілтеме',
    toggleFullscreen: 'Толық экран режимі',
    quote: 'Жазба',
    left: 'Солға туралау',
    center: 'Ортаға туралау',
    right: 'Оңға туралау',
    justify: 'Ені бойынша туралау',
    print: 'Басып шығару',
    outdent: 'Шегірісті азайту',
    indent: 'Шегірісті үлкейту',
    removeFormat: 'Пішімдеуді жою',
    formatting: 'Пішімдеу',
    fontSize: 'Қаріп өлшемі',
    align: 'Туралау',
    hr: 'Көлденең сызықты енгізу',
    undo: 'Болдырмау',
    redo: 'Қайталау',
    heading1: 'Тақырып 1',
    heading2: 'Тақырып 2',
    heading3: 'Тақырып 3',
    heading4: 'Тақырып 4',
    heading5: 'Тақырып 5',
    heading6: 'Тақырып 6',
    paragraph: 'Параграф',
    code: 'Код',
    size1: 'Өте кішкентай',
    size2: 'Кішкентай',
    size3: 'Қалыпты',
    size4: 'Орташа',
    size5: 'Үлкен',
    size6: 'Өте үлкен',
    size7: 'Дәу',
    defaultFont: 'Әдепкі қаріп',
    viewSource: 'Бастапқы кодты қарау'
  },
  tree: {
    noNodes: 'Түйіндер қолжетімді емес',
    noResults: 'Сәйкестік табылмады'
  }
}
