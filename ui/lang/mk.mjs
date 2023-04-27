export default {
  isoName: 'mk-MK',
  nativeName: 'Македонски',
  label: {
    clear: 'Испразни',
    ok: 'ОК',
    cancel: 'Откажи',
    close: 'Затвори',
    set: 'Постави',
    select: 'Избери',
    reset: 'Ресетирај',
    remove: 'Отстрани',
    update: 'Ажурирај',
    create: 'Креирај',
    search: 'Пребарувај',
    filter: 'Филтрирај',
    refresh: 'Освежи',
    expand: label => (label ? `Прошири "${ label }"` : 'Прошири'),
    collapse: label => (label ? `Собери на "${ label }"` : 'Собери')
  },
  date: {
    days: 'Недела_Понеделник_Вторник_Среда_Четврток_Петок_Сабота'.split(''),
    daysShort: 'Нед_Пон_Вто_Сре_Чет_Пет_Саб'.split(''),
    months: 'Јануари_Февруари_Март_Април_Мај_Јуни_Јули_Август_Септември_Октомври_Ноември_Декември'.split(''),
    monthsShort: 'Јан_Фев_Мар_Апр_Мај_Јун_Јул_Авг_Сеп_Окт_Ное_Дек'.split(''),
    firstDayOfWeek: 0, // 0-6, 0 - Недела, 1 - Понеделник, ...
    format24h: false,
    pluralDay: 'денови'
  },
  table: {
    noData: 'Нема достапни податоци',
    noResults: 'Нема резултати за пребарување',
    loading: 'Вчитување...',
    selectedRecords: rows => (
      rows === 1
        ? 'Избран е 1 запис.'
        : (rows === 0 ? 'Нема' : rows) + ' записи се избрани.'
    ),
    recordsPerPage: 'Записи по страница:',
    allRows: 'Сите',
    pagination: (start, end, total) => start + '-' + end + ' од ' + total,
    columns: 'Колони'
  },
  editor: {
    url: 'URL',
    bold: 'Задебелено',
    italic: 'Курзив',
    strikethrough: 'Прецртано',
    underline: 'Подвлечено',
    unorderedList: 'Неподредена листа',
    orderedList: 'Подредена листа',
    subscript: 'Индекс',
    superscript: 'Степен',
    hyperlink: 'Хиперврска',
    toggleFullscreen: 'Цел екран',
    quote: 'Цитат',
    left: 'Лева подредба',
    center: 'Центрирана подредба',
    right: 'Десна подредба',
    justify: 'Равномерна подредба',
    print: 'Печати',
    outdent: 'Намали маргина',
    indent: 'Зголеми маргина',
    removeFormat: 'Отстрани форматирање',
    formatting: 'Форматирање',
    fontSize: 'Големина на фонт',
    align: 'Подредба',
    hr: 'Вметни хоризонтална линија',
    undo: 'Поништи',
    redo: 'Врати',
    heading1: 'Наслов 1',
    heading2: 'Наслов 2',
    heading3: 'Наслов 3',
    heading4: 'Наслов 4',
    heading5: 'Наслов 5',
    heading6: 'Наслов 6',
    paragraph: 'Параграф',
    code: 'Код',
    size1: 'Многу мала',
    size2: 'Малку помала',
    size3: 'Нормална',
    size4: 'Средно-голема',
    size5: 'Голема',
    size6: 'Многу голема',
    size7: 'Максимална',
    defaultFont: 'Стандарден фонт',
    viewSource: 'Преглед на изворниот код'
  },
  tree: {
    noNodes: 'Нема достапни јазли',
    noResults: 'Нема пронајдено резултати'
  }
}
