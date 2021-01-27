export default {
  isoName: 'kur-CKB',
  nativeName: 'کوردی سۆرانی',
  rtl: true,
  label: {
    clear: 'پاککردنەوە',
    ok: 'باشە',
    cancel: 'هەڵوەشاندنەوە',
    close: 'داخستن',
    set: 'دانان',
    select: 'هەڵبژاردن',
    reset: 'رێکخستنەوه',
    remove: 'لابردن',
    update: 'نوێکردنەوە',
    create: 'دروستکردن',
    search: 'گەڕان',
    filter: 'پاڵاوتن',
    refresh: 'تازەکردنەوە'
  },
  date: {
    days: 'یەک شەممە_دووشەممە_سێ شەممە_چوار شەممە_پێنج شەممە_هەینی_شەممە'.split(
      '_'
    ),
    daysShort: '١شم_٢شم_٣شم_٤شم_٥شم_هەینی_شەممە'.split(
      '_'
    ),
    months: 'مانگی یەک_مانگی دوو_مانگی سێ_مانگی چوار_مانگی پێنج_مانگی شەش_مانگی حەوت_مانگی هەشت_مانگی نۆ_مانگی دە_مانگی یانزە_مانگی دووانزە'.split(
      '_'
    ),
    monthsShort: 'مانگی یەک_مانگی دوو_مانگی سێ_مانگی چوار_مانگی پێنج_مانگی شەش_مانگی حەوت_مانگی هەشت_مانگی نۆ_مانگی دە_مانگی یانزە_مانگی دووانزە'.split(
      '_'
    ),
    firstDayOfWeek: 6, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false,
    singleDay: 'ڕۆژ',
    pluralDay: 'ڕۆژەکان'
  },
  table: {
    noData: 'هیچ داتەیەک نییە',
    noResults: 'هیچ ئەنجامێک نییە',
    loading: 'چاوەڕوانبە...',
    selectedRecords: rows => (
      rows === 1
        ? 'یەک ڕیکۆرد هەڵبژێردراوە'
        : (rows === 0 ? '0' : rows) + 'ڕیکۆرد هەڵبژێرداوە.'
    ),
    recordsPerPage: 'ئەنجام بۆهەر پەڕەیەک:',
    allRows: 'هەمووی',
    pagination: (start, end, total) => start + '-' + end + ' لە ' + total,
    columns: 'ڕیز'
  },
  editor: {
    url: 'لینک',
    bold: 'تۆخ',
    italic: 'لار',
    strikethrough: 'خەتپیاهاتوو',
    underline: 'خەتبەژێرهاتوو',
    unorderedList: 'لیستی ڕیزنەکراو',
    orderedList: 'لیستی ڕیزکراو',
    subscript: 'ژێرهێڵ',
    superscript: 'سەرهێڵ',
    hyperlink: 'لینک',
    toggleFullscreen: 'پربە شاشە یان نا',
    quote: 'دەق',
    left: 'لای چەپ',
    center: 'ناوەڕاست',
    right: 'لای ڕاست',
    justify: 'بە یەکسانی',
    print: 'پرینت',
    outdent: 'کەمکردنەوەی بۆشای',
    indent: 'زۆرکردنی بۆشای',
    removeFormat: 'لابردنی ستایل',
    formatting: 'ستایل',
    fontSize: 'قەبارەی فۆنت',
    align: 'ڕێککردن',
    hr: 'دانانی هیڵی ئاسۆی',
    undo: 'پاشگەزبونەوە',
    redo: 'کردنەوە',
    heading1: 'ناونیشان ١',
    heading2: 'ناونیشان ٢',
    heading3: 'ناونیشان ٣',
    heading4: 'ناونیشان ٤',
    heading5: 'ناونیشان ٥',
    heading6: 'ناونیشان  ٦',
    paragraph: 'بڕگە',
    code: 'کۆد',
    size1: 'زۆر بچووک',
    size2: 'بچووک',
    size3: 'ئاسای',
    size4: 'ناوەند',
    size5: 'گەورە',
    size6: 'زۆر گەورە',
    size7: 'گەورەترین',
    defaultFont: 'فۆنتی بنەڕەت',
    viewSource: 'سەیرکردنی سەرچاوە'
  },
  tree: {
    noNodes: 'هیچ نۆدێک نیە',
    noResults: 'هیچ نۆدێک نەدۆزرایەوە'
  }
}
