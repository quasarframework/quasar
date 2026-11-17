export default {
  isoName: 'uz-Cyrl',
  nativeName: 'Ўзбекча (Кирил)',
  label: {
    clear: 'Тозалаш',
    ok: 'ОК',
    cancel: 'Бекор қилиш',
    close: 'Ёпиш',
    set: 'Ўрнатиш',
    select: 'Танлаш',
    reset: 'Қайта ўрнатиш',
    remove: 'Ўчириш',
    update: 'Янгилаш',
    create: 'Яратиш',
    search: 'Қидириш',
    filter: 'Филтрлаш',
    refresh: 'Янгилаш',
    minimum: 'Минимум',
    maximum: 'Максимум',
    range: 'Диапазон',
    noValue: 'Қиймат йўқ',
    resize: 'Ўлчамни ўзгартириш',
    expand: label => (label ? `"${label}" ни кенгайтириш` : 'Кенгайтириш'),
    collapse: label => (label ? `"${label}" ни йиғиш` : 'Йиғиш')
  },
  date: {
    days: 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
    daysShort: 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
    months:
      'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split(
        '_'
      ),
    monthsShort: 'Ян_Фев_Март_Апр_Май_Июнь_Июль_Авг_Сен_Окт_Ноя_Дек'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Якшанба, 1 Душанба, ...
    format24h: true,
    pluralDay: 'Кунлар',
    prevMonth: 'Олдинги ой',
    nextMonth: 'Кейинги ой',
    prevYear: 'Олдинги йил',
    nextYear: 'Кейинги йил',
    today: 'Бугун',
    prevRangeYears: range => `Олдинги ${range} йил`,
    nextRangeYears: range => `Кейинги ${range} йил`,
    hour: 'Соат',
    minute: 'Дақиқа',
    second: 'Сония',
    now: 'Жорий вақт'
  },
  table: {
    noData: 'Маълумот топилмади',
    noResults: 'Қидирув бўйича маълумотлар топилмади',
    loading: 'Юкланмоқда...',
    selectedRecords: rows => {
      if (rows === 0) {
        return 'Ҳеч қандай маълумотлар танланмади.'
      }
      if (rows === 1) {
        return '1 та маълумот танланди.'
      }
      return rows + ' та маълумот танланди.'
    },
    recordsPerPage: 'Саҳифадаги қаторлар:',
    allRows: 'Барчаси',
    pagination: (start, end, total) => start + '-' + end + ' жами ' + total,
    columns: 'Устунлар',
    selectAllRows: 'Барча қаторларни танлаш',
    selectRow: 'Қаторни танлаш'
  },
  pagination: {
    label: 'Саҳифалаш',
    first: 'Биринчи саҳифа',
    prev: 'Олдинги саҳифа',
    next: 'Кейинги саҳифа',
    last: 'Сўнгги саҳифа'
  },
  carousel: {
    prevSlide: 'Олдинги слайд',
    nextSlide: 'Кейинги слайд'
  },
  colorPicker: {
    spectrum: 'Спектр',
    tune: 'Созлаш',
    palette: 'Палитра',
    value: 'Ранг қиймати',
    hue: 'Тус',
    alpha: 'Ношаффофлик',
    saturation: 'Тўйинганлик',
    brightness: 'Ёрқинлик'
  },
  uploader: {
    addFiles: 'Файлларни танлаш',
    upload: 'Файлларни юклаш',
    abort: 'Юклашни тўхтатиш',
    removeQueued: 'Навбатдаги файлларни ўчириш',
    removeUploaded: 'Юкланган файлларни ўчириш',
    removeFile: 'Файлни ўчириш'
  },
  editor: {
    toolbar: 'Муҳаррир асбоблар панели',
    url: 'УРЛ',
    bold: 'Қалин',
    italic: 'Курсив',
    strikethrough: 'Устидан чизилган',
    underline: 'Тагига чизилган',
    unorderedList: 'Тартибсиз рўйхат',
    orderedList: 'Тартибга киритилган рўйхат',
    subscript: 'Сатр остида',
    superscript: 'Сатр устида',
    hyperlink: 'Гиперҳавола',
    toggleFullscreen: 'Тўлиқ экран режимига ўтиш',
    quote: 'Иқтибос',
    left: 'Чапга сафлаш',
    center: 'Марказга сафлаш',
    right: 'Ўнгга сафлаш',
    justify: 'Икки томондан сафлаш',
    print: 'Чоп этиш',
    outdent: 'Чекинишни камайтириш',
    indent: 'Чекинишни кўпайтириш',
    removeFormat: 'Форматлашни ўчириб ташлаш',
    formatting: 'Форматлаш',
    fontSize: 'Шрифт ҳажми',
    align: 'Сафлаш',
    hr: 'Горизонтал чизиқ қўйиш',
    undo: 'Бекор қилиш',
    redo: 'Такрорлаш',
    heading1: 'Сарлавҳа 1',
    heading2: 'Сарлавҳа 2',
    heading3: 'Сарлавҳа 3',
    heading4: 'Сарлавҳа 4',
    heading5: 'Сарлавҳа 5',
    heading6: 'Сарлавҳа 6',
    paragraph: 'Параграф',
    code: 'Код',
    size1: 'Ўта кичик',
    size2: 'Бироз кичик',
    size3: 'Оддий',
    size4: 'Ўрта катта',
    size5: 'Катта',
    size6: 'Жуда катта',
    size7: 'Максимал',
    defaultFont: 'Стандарт шрифт',
    viewSource: 'Манбани кўриш'
  },
  tree: {
    noNodes: 'Тугунлар йўқ',
    noResults: 'Мос келадиган тугунлар топилмади'
  }
}
