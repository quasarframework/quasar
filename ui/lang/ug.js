const days = 'يەكشەنبە_دۈشەنبە_سەيشەنبە_چارشەنبە_پەيشەنبە_جۈمە_شەنبە'.split('_')
const monthsShort = '1-ئاي_2-ئاي_3-ئاي_4-ئاي_5-ئاي_6-ئاي_7-ئاي_8-ئاي_9-ئاي_10-ئاي_11-ئاي_12-ئاي'.split('_')

export default {
  isoName: 'ug',
  nativeName: 'ئۇيغۇرچە',
  rtl: true,
  label: {
    clear: 'تازلاش',
    ok: 'جەزملەش',
    cancel: 'بىكار قىلىش',
    close: 'تاقاش',
    set: 'تەڭشەك',
    select: 'تاللاش',
    reset: 'ئەسلىگە قايتۇرۇش',
    remove: 'چىقىرۋىتىش',
    update: 'يېڭىلاش',
    create: 'قۇرۇش',
    search: 'ئىزدەش',
    filter: 'سۈزۈش',
    refresh: 'يېڭىلاش'
  },
  date: {
    days: days,
    daysShort: 'ي_د_س_چ_پ_ج_ش'.split('_'),
    months: monthsShort,
    monthsShort: monthsShort,
    headerTitle: function(date, model) {
      return monthsShort[model.month - 1] + 'نىڭ ' + model.day + '-كۈنى، ' + days[date.getDay()]
    },
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false,
    pluralDay: 'كۈن'
  },
  table: {
    noData: 'ئۇچۇر يوق',
    noResults: 'مۇناسىۋەتلىك ئۇچۇر تېپىلمىدى',
    loading: 'يۈكلىنىۋاتىدۇ...',
    selectedRecords: function(rows) {
      return rows + ' قۇر تاللاندى'
    },
    recordsPerPage: 'ھەربەتتىكى قۇر سانى:',
    allRows: 'ھەممىسى',
    pagination: function(start, end, total) {
      return start + '-' + end + ' / ' + total
    },
    columns: 'ئىستون'
  },
  editor: {
    url: 'URL',
    bold: '粗体',
    italic: '斜体',
    strikethrough: '删除线',
    underline: '下划线',
    unorderedList: '无序列表',
    orderedList: '有序列表',
    subscript: '下标',
    superscript: '上标',
    hyperlink: '超链接',
    toggleFullscreen: '全屏切换',
    quote: '引号',
    left: '左对齐',
    center: '居中对齐',
    right: '右对齐',
    justify: '两端对齐',
    print: '打印',
    outdent: '减少缩进',
    indent: '增加缩进',
    removeFormat: '清除样式',
    formatting: '格式化',
    fontSize: '字体大小',
    align: '对齐',
    hr: '插入水平线',
    undo: '撤消',
    redo: '重做',
    heading1: '标题一',
    heading2: '标题二',
    heading3: '标题三',
    heading4: '标题四',
    heading5: '标题五',
    heading6: '标题六',
    paragraph: '段落',
    code: '代码',
    size1: '非常小',
    size2: '比较小',
    size3: '正常',
    size4: '中等偏大',
    size5: '大',
    size6: '非常大',
    size7: '超级大',
    defaultFont: '默认字体',
    viewSource: '查看资料'
  },
  tree: {
    noNodes: 'ئۇچۇر يوق',
    noResults: 'مۇناسىۋەتلىك ئۇچۇر تېپىلمىدى'
  }
}
