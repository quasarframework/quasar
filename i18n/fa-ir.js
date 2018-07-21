export default {
  lang: 'fa-ir',
  rtl: true,
  label: {
    clear: 'پاک‌سازی',
    ok: 'قبول',
    cancel: 'لغو',
    close: 'بستن',
    set: 'ثبت',
    select: 'انتخاب',
    reset: 'بازنشانی',
    remove: 'حذف',
    update: 'بروزرسانی',
    create: 'ساخت',
    search: 'جستجو',
    filter: 'فیلتر',
    refresh: 'تازه‌سازی'
  },
  date: {
    days: 'یکشنبه/دوشنبه/سه‌شنبه/چهارشنبه/پنجشنبه/جمعه/شنبه'.split('/'),
    daysShort: 'ی/د/س/چ/پ‌/ج‌/ش‌'.split('/'),
    months: 'ژانویه/فوریه/مارس/آپریل/مه/ژوئن/ژولای/آگوست/سپتامبر/اکتبر/نوامبر/دسامبر'.split('/'),
    monthsShort: 'ژانویه/فوریه/مارس/آپریل/مه/ژوئن/ژولای/آگوست/سپتامبر/اکتبر/نوامبر/دسامبر'.split('/'),
    firstDayOfWeek: 5,
    format24h: false
  },
  pullToRefresh: {
    pull: 'برای تازه‌سازی بکشید',
    release: 'برای تازه‌سازی رهاکنید',
    refresh: 'تازه‌سازی ...'
  },
  table: {
    noData: 'تاریخ دردسترس نیست',
    noResults: 'هیچ موردی یافت نشد',
    loading: 'در حال بارگذاری ...',
    selectedRecords: function (rows) {
      return rows === 0 ? 'ردیفی انتخاب نشده' : rows + ' ردیف انتخاب شده'
    },
    recordsPerPage: 'ردیف بر صفحه:',
    allRows: 'همه',
    pagination: function (start, end, total) {
      return start + '-' + end + ' از ' + total
    },
    columns: 'ستون'
  },
  editor: {
    url: 'آدرس',
    bold: 'کلفت',
    italic: 'کج',
    strikethrough: 'خط‌خورده',
    underline: 'زیرخط',
    unorderedList: 'فهرست غیرترتیبی',
    orderedList: 'فهرست ترتیبی',
    subscript: 'زیرنویس',
    superscript: 'بالانویس',
    hyperlink: 'پیوند',
    toggleFullscreen: 'تغییر حالت تمام صفحه',
    quote: 'نقل قول',
    left: 'چپ تراز',
    center: 'وسط تراز',
    right: 'راست تراز',
    justify: 'هم‌تراز',
    print: 'چاپ',
    outdent: 'کاهش دندانه',
    indent: 'افزایش دندانه',
    removeFormat: 'حذف قالب‌بندی',
    formatting: 'قالب‌بندی',
    fontSize: 'اندازه قلم',
    align: 'تراز کردن',
    hr: 'درج خطکش افقی',
    undo: 'عمل قبلی',
    redo: 'عملی بعدی',
    header1: 'سرفصل 1',
    header2: 'سرفصل 2',
    header3: 'سرفصل 3',
    header4: 'سرفصل 4',
    header5: 'سرفصل 5',
    header6: 'سرفصل 6',
    paragraph: 'پاراگراف',
    code: 'کد',
    size1: 'خیلی کوچک',
    size2: 'کمی کوچک',
    size3: 'معمولی',
    size4: 'متوسط-بزرگ',
    size5: 'بزرگ',
    size6: 'خیلی بزرگ',
    size7: 'بیشترین',
    defaultFont: 'قلم پیش‌فرض'
  },
  tree: {
    noNodes: 'گره‌ای در دسترس نیست',
    noResults: 'گره‌ی منطبقی یافت نشد'
  }
}
