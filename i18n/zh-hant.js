export default {
  lang: 'zh-hant',
  label: {
    clear: '清空',
    ok: '確定',
    cancel: '取消',
    close: '關閉',
    set: '設置',
    select: '選擇',
    reset: '重置',
    remove: '移除',
    update: '更新',
    create: '創建',
    search: '搜索',
    filter: '過濾',
    refresh: '刷新'
  },
  date: {
    days: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    daysShort: '日_一_二_三_四_五_六'.split('_'),
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '一_二_三_四_五_六_七_八_九_十_十一_十二'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false
  },
  pullToRefresh: {
    pull: '下拉刷新',
    release: '釋放刷新',
    refresh: '正在刷新...'
  },
  table: {
    noData: '沒有可用數據',
    noResults: '找不到匹配的數據',
    loading: '正在加載...',
    selectedRows: function (rows) {
      return rows === 1
        ? '1 selected row.'
        : (rows === 0 ? 'No' : rows) + ' selected rows.'
    },
    rowsPerPage: '每頁的行數:',
    allRows: '全部',
    pagination: function (start, end, total) {
      return start + '-' + end + ' / ' + total
    },
    columns: '列'
  },
  editor: {
    url: '地址',
    bold: '粗體',
    italic: '斜體',
    strikethrough: '刪除線',
    underline: '下劃線',
    unorderedList: '無序列表',
    orderedList: '有序列表',
    subscript: '子腳本',
    superscript: '超級腳本',
    hyperlink: '超鏈接',
    toggleFullscreen: '全屏切換',
    quote: '引號',
    left: '左對齊',
    center: '居中對齊',
    right: '右對齊',
    justify: '兩端對齊',
    print: '打印',
    outdent: '減少縮進',
    indent: '增加縮進',
    removeFormat: '清除樣式',
    formatting: '格式化',
    fontSize: '字體大小',
    align: '對齊',
    hr: '插入水平線',
    undo: '撤消',
    redo: '重做',
    header1: '標題一',
    header2: '標題二',
    header3: '標題三',
    header4: '標題四',
    header5: '標題五',
    header6: '標題六',
    paragraph: '段落',
    code: '代碼',
    size1: '非常小',
    size2: '比較小',
    size3: '正常',
    size4: '中等偏大',
    size5: '大',
    size6: '非常大',
    size7: '超級大',
    defaultFont: '默認字體'
  },
  tree: {
    noNodes: '沒有可用節點',
    noResults: '找不到匹配的節點'
  }
}
