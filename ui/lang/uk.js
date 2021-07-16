function plurals (n, opts) {
  return opts[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
}

export default {
  isoName: 'uk',
  nativeName: 'Українська',
  label: {
    clear: 'Очистити',
    ok: 'OK',
    cancel: 'Скасувати',
    close: 'Закрити',
    set: 'Встановити',
    select: 'Обрати',
    reset: 'Скинути',
    remove: 'Видалити',
    update: 'Оновити',
    create: 'Створити',
    search: 'Пошук',
    filter: 'Фільтр',
    refresh: 'Оновити'
  },
  date: {
    days: 'Неділя_Понеділок_Вівторок_Середа_Четвер_П`ятниця_Субота'.split('_'),
    daysShort: 'Нд_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
    months: 'Січень_Лютий_Березень_Квітень_Травень_Червень_Липень_Серпень_Вересень_Жовтень_Листопад_Грудень'.split('_'),
    monthsShort: 'Січ_Лют_Бер_Кві_Тра_Чер_Лип_Сер_Вер_Жов_Лис_Гру'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'днів'
  },
  table: {
    noData: 'Немає даних',
    noResults: 'Співпадінь не знайдено',
    loading: 'Завантаження...',
    selectedRecords: rows => (
      rows > 0
        ? rows + ' ' + plurals(rows, [ 'рядок обраний', 'рядки обрані', 'рядків обрано' ]) + '.'
        : 'Жодного рядку не обрано.'
    ),
    recordsPerPage: 'Рядків на сторінці:',
    allRows: 'Усі',
    pagination: (start, end, total) => start + '-' + end + ' з ' + total,
    columns: 'Колонки'
  },
  editor: {
    url: 'URL',
    bold: 'Напівжирний',
    italic: 'Курсив',
    strikethrough: 'Закреслений',
    underline: 'Підкреслений',
    unorderedList: 'Маркований список',
    orderedList: 'Нумерований список',
    subscript: 'Підрядковий',
    superscript: 'Надрядковий',
    hyperlink: 'Гіперпосилання',
    toggleFullscreen: 'Повноекранний режим',
    quote: 'Цитата',
    left: 'Вирівнювання по лівому краю',
    center: 'Вирівнювання по центру',
    right: 'Вирівнювання по правому краю',
    justify: 'Вирівнювання по ширині',
    print: 'Друк',
    outdent: 'Зменшити відтуп',
    indent: 'Збільшити відступ',
    removeFormat: 'Видалити форматування',
    formatting: 'Форматування',
    fontSize: 'Розмір шрифту',
    align: 'Вирівнювання',
    hr: 'Вставити горизонтальну лінію',
    undo: 'Відмінити',
    redo: 'Повторити',
    heading1: 'Заголовок 1',
    heading2: 'Заголовок 2',
    heading3: 'Заголовок 3',
    heading4: 'Заголовок 4',
    heading5: 'Заголовок 5',
    heading6: 'Заголовок 6',
    paragraph: 'Параграф',
    code: 'Код',
    size1: 'Дуже маленький',
    size2: 'Маленький',
    size3: 'Нормальний',
    size4: 'Середній',
    size5: 'Великий',
    size6: 'Дуже великий',
    size7: 'Величезний',
    defaultFont: 'Шрифт за замовчуванням',
    viewSource: 'Переглянути джерело'
  },
  tree: {
    noNodes: 'Немає доступних вузлів',
    noResults: 'Співпадінь не знайдено'
  }
}
