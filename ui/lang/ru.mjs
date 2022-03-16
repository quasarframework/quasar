function plurals (n, opts) {
  return opts[ n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2 ]
}

export default {
  isoName: 'ru',
  nativeName: 'русский',
  label: {
    clear: 'Очистить',
    ok: 'OK',
    cancel: 'Отмена',
    close: 'Закрыть',
    set: 'Установить',
    select: 'Выбрать',
    reset: 'Сбросить',
    remove: 'Удалить',
    update: 'Обновить',
    create: 'Создать',
    search: 'Поиск',
    filter: 'Фильтр',
    refresh: 'Обновить'
  },
  date: {
    days: 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота'.split('_'),
    daysShort: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
    months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split('_'),
    monthsShort: 'Янв_Фев_Мар_Апр_Май_Июн_Июл_Авг_Сен_Окт_Ноя_Дек'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'дней'
  },
  table: {
    noData: 'Нет данных',
    noResults: 'Совпадений не найдено',
    loading: 'Загрузка...',
    selectedRecords: rows => (
      rows > 0
        ? rows + ' ' + plurals(rows, [ 'строка выбрана', 'строки выбраны', 'строк выбрано' ]) + '.'
        : 'Ни одна строка не выбрана.'
    ),
    recordsPerPage: 'Строк на странице:',
    allRows: 'Все',
    pagination: (start, end, total) => start + '-' + end + ' из ' + total,
    columns: 'Колонки'
  },
  editor: {
    url: 'URL',
    bold: 'Полужирный',
    italic: 'Курсив',
    strikethrough: 'Зачеркнутый',
    underline: 'Подчеркнутый',
    unorderedList: 'Маркированный список',
    orderedList: 'Нумерованный список',
    subscript: 'Подстрочный',
    superscript: 'Надстрочный',
    hyperlink: 'Гиперссылка',
    toggleFullscreen: 'Полноэкранный режим',
    quote: 'Цитата',
    left: 'Выравнивание по левому краю',
    center: 'Выравнивание по центру',
    right: 'Выравнивание по правому краю',
    justify: 'Выравнивание по ширине',
    print: 'Печать',
    outdent: 'Уменьшить отступ',
    indent: 'Увеличить отступ',
    removeFormat: 'Удалить форматирование',
    formatting: 'Форматирование',
    fontSize: 'Размер шрифта',
    align: 'Выравнивание',
    hr: 'Вставить горизонтальную линию',
    undo: 'Отменить',
    redo: 'Повторить',
    heading1: 'Заголовок 1',
    heading2: 'Заголовок 2',
    heading3: 'Заголовок 3',
    heading4: 'Заголовок 4',
    heading5: 'Заголовок 5',
    heading6: 'Заголовок 6',
    paragraph: 'Параграф',
    code: 'Код',
    size1: 'Очень маленький',
    size2: 'Маленький',
    size3: 'Нормальный',
    size4: 'Средний',
    size5: 'Большой',
    size6: 'Очень большой',
    size7: 'Огромный',
    defaultFont: 'Шрифт по умолчанию',
    viewSource: 'Просмотреть исходный код'
  },
  tree: {
    noNodes: 'Нет доступных узлов',
    noResults: 'Совпадений не найдено'
  }
}
