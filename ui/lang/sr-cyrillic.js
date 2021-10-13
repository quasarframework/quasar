export default {
  isoName: 'sr-cyr',
  nativeName: 'српски језик',
  label: {
    clear: 'Обриши',
    ok: 'У реду',
    cancel: 'Одустани',
    close: 'Затвори',
    set: 'Постави',
    select: 'Изабери',
    reset: 'Поништи',
    remove: 'Уклони',
    update: 'Ажурирај',
    create: 'Додај',
    search: 'Тражи',
    filter: 'Филтер',
    refresh: 'Освежи'
  },
  date: {
    days: 'Недеља_Понедељак_Уторак_Среда_Четвртак_Петак_Субота'.split('_'),
    daysShort: 'Нед_Пон_Уто_Сре_Чет_Пет_Суб'.split('_'),
    months: 'Јануар_Фебруар_Март_Април_Мај_Јун_Јул_Август_Септембар_Октобар_Новембар_Децембар'.split('_'),
    monthsShort: 'Јан_Феб_Мар_Апр_Мај_Јун_Јул_Авг_Сеп_Окт_Нов_Дец'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'дана'
  },
  table: {
    noData: 'Нема података',
    noResults: 'Нема одговарајућих записа',
    loading: 'Учитавање...',
    selectedRecords: function (rows) {
      return rows > 1
        ? rows + ' Изабраних редова.'
        : (rows === 0 ? 'Нема' : '1') + ' изабраних редова.'
    },
    recordsPerPage: 'Редова по страници:',
    allRows: 'Све',
    pagination: function (start, end, total) {
      return start + '-' + end + ' од ' + total
    },
    columns: 'Колоне'
  },
  editor: {
    url: 'УРЛ',
    bold: 'Подебљано',
    italic: 'Накошено',
    strikethrough: 'Прецртано',
    underline: 'Подцртано',
    unorderedList: 'Означена листа',
    orderedList: 'Нумерисана листа',
    subscript: 'Подписано',
    superscript: 'Натписано',
    hyperlink: 'Хиперлинк',
    toggleFullscreen: 'Цео екран',
    quote: 'Цитат',
    left: 'Поравнати улево',
    center: 'Центрирати',
    right: 'Поравнати удесно',
    justify: 'Поравнати обострано',
    print: 'Штампа',
    outdent: 'Смањити увеличање',
    indent: 'Повећати увеличање',
    removeFormat: 'Уклонити форматирање',
    formatting: 'Форматирати',
    fontSize: 'Величина слова',
    align: 'Поравнати',
    hr: 'Убацити хоризонталну линију',
    undo: 'Поништити',
    redo: 'Вратити',
    heading1: 'Наслов 1',
    heading2: 'Наслов 2',
    heading3: 'Наслов 3',
    heading4: 'Наслов 4',
    heading5: 'Наслов 5',
    heading6: 'Наслов 6',
    paragraph: 'Параграф',
    code: 'Код',
    size1: 'Најмање',
    size2: 'Мање',
    size3: 'Нормално',
    size4: 'Средње велико',
    size5: 'Велико',
    size6: 'Веће',
    size7: 'Највеће',
    defaultFont: 'Подразумевани фонт',
    viewSource: 'Погледај извор'
  },
  tree: {
    noNodes: 'Нема ни једног чвора',
    noResults: 'Нема одговарајућих чворова'
  }
}
