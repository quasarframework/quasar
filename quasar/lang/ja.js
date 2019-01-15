export default {
  isoName: 'ja',
  nativeName: '日本語 (にほんご)',
  label: {
    clear: 'クリア', // 'Clear',
    ok: 'OK', // 'OK',
    cancel: 'キャンセル', // 'Cancel',
    close: '閉じる', // 'Close',
    set: '設定', // 'Set',
    select: '選択', // 'Select',
    reset: 'リセット', // 'Reset',
    remove: '削除', // 'Remove',
    update: '更新', // 'Update',
    create: '作成', // 'Create',
    search: '検索', // 'Search',
    filter: 'フィルタ', // 'Filter',
    refresh: '再読込' // 'Refresh'
  },
  date: {
    days: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'), // 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    daysShort: '日_月_火_水_木_金_土'.split('_'), // 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'), // 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'), // 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true // true
  },
  table: {
    noData: 'データがありません', // 'No data available',
    noResults: '検索結果がありません', // 'No matching records found',
    loading: '読込中...', // 'Loading...',
    selectedRecords: function (rows) {
      return rows > 0
        ? rows + '行を選択中'
        : '行を選択'
    },
    recordsPerPage: 'ページあたりの行数', // 'Rows per page:',
    allRows: '全て', // 'All',
    pagination: function (start, end, total) {
      return start + '-' + end + ' ／ ' + total
    },
    columns: '列' // 'Columns'
  },
  editor: {
    url: 'URL', // 'URL',
    bold: '太字', // 'Bold',
    italic: '斜体', // 'Italic',
    strikethrough: '取り消し線', // 'Strikethrough',
    underline: '下線', // 'Underline',
    unorderedList: '箇条書き', // 'Unordered List',
    orderedList: '段落番号', // 'Ordered List',
    subscript: '下付き', // 'Subscript',
    superscript: '上付き', // 'Superscript',
    hyperlink: 'リンク', // 'Hyperlink',
    toggleFullscreen: '全画面表示', // 'Toggle Fullscreen',
    quote: '引用文', // 'Quote',
    left: '左揃え', // 'Left align',
    center: '中央揃え', // 'Center align',
    right: '右揃え', // 'Right align',
    justify: '両端揃え', // 'Justify align',
    print: '印刷', // 'Print',
    outdent: 'インデント解除', // 'Decrease indentation',
    indent: 'インデント', // 'Increase indentation',
    removeFormat: '書式解除', // 'Remove formatting',
    formatting: '書式', // 'Formatting',
    fontSize: 'フォントサイズ', // 'Font Size',
    align: '揃え', // 'Align',
    hr: '横線を投入', // 'Insert Horizontal Rule',
    undo: '元に戻す', // 'Undo',
    redo: 'やり直し', // 'Redo',
    header1: 'ヘッダー 1', // 'Header 1',
    header2: 'ヘッダー 2', // 'Header 2',
    header3: 'ヘッダー 3', // 'Header 3',
    header4: 'ヘッダー 4', // 'Header 4',
    header5: 'ヘッダー 5', // 'Header 5',
    header6: 'ヘッダー 6', // 'Header 6',
    paragraph: '段落', // 'Paragraph',
    code: 'コード', // 'Code',
    size1: '小さい', // 'Very small',
    size2: 'やや小さい', // 'A bit small',
    size3: '普通', // 'Normal',
    size4: 'やや大きい', // 'Medium-large',
    size5: '大きい', // 'Big',
    size6: 'とても大きい', // 'Very big',
    size7: '最大', // 'Maximum',
    defaultFont: '初期フォント' // 'Default Font'
  },
  tree: {
    noNodes: 'ノードがありません', // 'No nodes available',
    noResults: '該当するノードがありません' // 'No matching nodes found'
  }
}
