const days = 'یکشنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنجشنبه_جمعه_شنبه'.split('_')
const monthsShort = 'فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند'.split('_')

export default {
  isoName: 'fa-ir',
  nativeName: 'فارسی',
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
    days: days,
    daysShort: 'ی_د_س_چ_پ_ج_ش'.split('_'),
    months: 'فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند'.split('_'),
    monthsShort: monthsShort,
    headerTitle: function (date, model) {
      return days[ date.getDay() ] + '، ' +
        model.day + ' ' +
        monthsShort[ model.month - 1 ]
    },
    firstDayOfWeek: 6,
    format24h: true,
    pluralDay: 'روزها'
  },
  table: {
    noData: 'اطلاعاتی موجود نیست',
    noResults: 'هیچ موردی یافت نشد',
    loading: 'در حال بارگذاری ...',
    selectedRecords: function (rows) {
      return rows === 0 ? 'رکوردی انتخاب نشده' : rows + ' رکورد انتخاب شده'
    },
    recordsPerPage: 'رکورد در صفحه:',
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
    align: 'تراز',
    hr: 'درج خط افقی',
    undo: 'عمل قبلی',
    redo: 'عملی بعدی',
    heading1: 'سرفصل ۱',
    heading2: 'سرفصل ۲',
    heading3: 'سرفصل ۳',
    heading4: 'سرفصل ۴',
    heading5: 'سرفصل ۵',
    heading6: 'سرفصل ۶',
    paragraph: 'پاراگراف',
    code: 'کد',
    size1: 'خیلی کوچک',
    size2: 'کوچک',
    size3: 'معمولی',
    size4: 'متوسط-بزرگ',
    size5: 'بزرگ',
    size6: 'خیلی بزرگ',
    size7: 'بزرگترین',
    defaultFont: 'قلم پیش‌فرض',
    viewSource: 'مشاهده منبع'
  },
  tree: {
    noNodes: 'گره‌ای در دسترس نیست',
    noResults: 'گره‌ای یافت نشد'
  }
}
