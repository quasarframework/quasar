export default {
  lang: 'bg',
  label: {
    clear: 'Изчисти',
    ok: 'OK',
    cancel: 'Отказ',
    close: 'Затвори',
    set: 'Задай',
    select: 'Избери',
    reset: 'Наново',
    remove: 'Изтрий',
    update: 'Обнови',
    create: 'Създай',
    search: 'Търси',
    filter: 'Филтър',
    refresh: 'Обнови'
  },
  date: {
    days: 'Неделя_Понеделник_Вторник_Сряда_Четвъртък_Петък_Събота'.split('_'),
    daysShort: 'Нд_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
    months: 'Януари_Февруари_Март_Април_Май_Юни_Юли_Август_Септември_Октомври_Ноември_Декември'.split('_'),
    monthsShort: 'Яну_Фев_Мар_Апр_Май_Юни_Юли_Авг_Сеп_Окт_Ное_Дек'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  pullToRefresh: {
    pull: 'Изтеглете надолу за обновяване',
    release: 'Пуснете за обновление',
    refresh: 'Обновление...'
  },
  table: {
    noData: 'Няма данни',
    noResults: 'Нищо не е намерено',
    loading: 'Зареждане...',
    selectedRows: function (rows) {
      return rows > 1
        ? rows + ' избрани реда.'
        : (rows === 0 ? 'Няма' : '1') + ' избрани редове.'
    },
    rowsPerPage: 'Редове на страница:',
    allRows: 'Всички',
    pagination: function (start, end, total) {
      return start + '-' + end + ' от ' + total
    },
    columns: 'Колони'
  },
  editor: {
    url: 'URL',
    bold: 'Удебелен',
    italic: 'Курсив',
    strikethrough: 'Задраскан',
    underline: 'Подчертан',
    unorderedList: 'Неподреден списък',
    orderedList: 'Номериран списък',
    subscript: 'Под-редово',
    superscript: 'Над-редово',
    hyperlink: 'Линк',
    toggleFullscreen: 'На цял екран',
    quote: 'Цитат',
    left: 'Ляво подравняване',
    center: 'Центриране',
    right: 'Дясно подравняване',
    justify: 'Подравняване по ширина',
    print: 'Отпечатване',
    outdent: 'Намали отстъпа',
    indent: 'Увеличи отстъпа',
    removeFormat: 'Без форматиране',
    formatting: 'Форматиране',
    fontSize: 'Размер на шрифта',
    align: 'Подравняване',
    hr: 'Вмъкни хоризонтална линия',
    undo: 'Отмени',
    redo: 'Повтори',
    header1: 'Заглавие 1',
    header2: 'Заглавие 2',
    header3: 'Заглавие 3',
    header4: 'Заглавие 4',
    header5: 'Заглавие 5',
    header6: 'Заглавие 6',
    paragraph: 'Параграф',
    code: 'Код',
    size1: 'Много малък',
    size2: 'Малък',
    size3: 'Нормален',
    size4: 'Среден',
    size5: 'Голям',
    size6: 'Много голям',
    size7: 'Огромен',
    defaultFont: 'Шрифт по подразбиране'
  },
  tree: {
    noNodes: 'Няма повече възли',
    noResults: 'Нищо не е намерено'
  }
}
