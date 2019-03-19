export default {
  isoName: 'zh-hant',
  nativeName: '汉语',
  label: {
    clear: '清除',
    ok: '確定',
    cancel: '取消',
    close: '關閉',
    set: '設定',
    select: '選擇',
    reset: '重置',
    remove: '移除',
    update: '更新',
    create: '新增',
    search: '搜尋',
    filter: '篩選',
    refresh: '更新'
  },
  date: {
    days: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    daysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    headerTitle: function (date) {
      return new Intl.DateTimeFormat('zh-hant', {
        weekday: 'short', month: 'short', day: 'numeric'
      }).format(date)
    },
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false
  },
  table: {
    noData: '無資料',
    noResults: '無相符資料',
    loading: '載入中...',
    selectedRecords: function (rows) {
      return '已選擇' + rows + '筆'
    },
    recordsPerPage: '每頁筆數:',
    allRows: '全部',
    pagination: function (start, end, total) {
      return start + '-' + end + ' / ' + total
    },
    columns: '列'
  },
  editor: {
    url: '網址',
    bold: '粗體',
    italic: '斜體',
    strikethrough: '刪除線',
    underline: '下劃線',
    unorderedList: '項目符號清單',
    orderedList: '編號清單',
    subscript: '下標',
    superscript: '上標',
    hyperlink: '超連結',
    toggleFullscreen: '切換全螢幕',
    quote: '引言',
    left: '靠左對齊',
    center: '置中對齊',
    right: '靠右對齊',
    justify: '左右對齊',
    print: '列印',
    outdent: '減少縮排',
    indent: '增加縮排',
    removeFormat: '清除格式',
    formatting: '式樣',
    fontSize: '字型大小',
    align: '對齊',
    hr: '插入水平線',
    undo: '復原',
    redo: '取消復原',
    header1: '標題 1',
    header2: '標題 2',
    header3: '標題 3',
    header4: '標題 4',
    header5: '標題 5',
    header6: '標題 6',
    paragraph: '段落',
    code: '程式碼',
    size1: '非常小',
    size2: '比較小',
    size3: '正常',
    size4: '中等偏大',
    size5: '大',
    size6: '非常大',
    size7: '超級大',
    defaultFont: '預設字型'
  },
  tree: {
    noNodes: '無節點',
    noResults: '無相符節點'
  }
}
