export default {
  lang: 'ar',
  rtl: true,
  label: {
    clear: 'مسح',
    ok: 'حسناً',
    cancel: 'إلغاء',
    close: 'إغلاق',
    set: 'ضبط',
    select: 'إختيار',
    reset: 'إعادة تعيين',
    remove: 'إزالة',
    update: 'تحديث',
    create: 'إنشاء',
    search: 'بحث',
    filter: 'تصفية',
    refresh: 'تحديث'
  },
  date: {
    days: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    daysShort: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    months: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    monthsShort: 'ينا_فبر_مار_أبر_ماي_يون_يول_أغس_سبت_أكت_نوف_ديس'.split('_'),
    firstDayOfWeek: 6, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false
  },
  pullToRefresh: {
    pull: 'إسحب للأسفل للتحديث',
    release: 'أفلت ليتم التحديث',
    refresh: 'جاري التحديث...'
  },
  table: {
    noData: 'عفواً، لا توجد بيانات',
    noResults: 'عفواً، لا توجد سجلات مطابقة',
    loading: 'جاري التحميل...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 سجل مختار.'
        : (rows === 0 ? 'No' : rows) + ' سجلات مختاره.'
    },
    recordsPerPage: 'سجلات لكل صفحة:',
    allRows: 'الكل',
    pagination: function (start, end, total) {
      return start + '-' + end + ' من ' + total
    },
    columns: 'أعمدة'
  },
  editor: {
    url: 'مسار',
    bold: 'سميك',
    italic: 'مائل',
    strikethrough: 'يتوسطه خط',
    underline: 'تحته خط',
    unorderedList: 'قائمة غير مرتبة',
    orderedList: 'قائمة مرتبة',
    subscript: 'منخفض',
    superscript: 'مرتفع',
    hyperlink: 'إرتباط',
    toggleFullscreen: 'ملء الشاشة',
    quote: 'إقتباس',
    left: 'محاذاة لليسار',
    center: 'محاذاة للوسط',
    right: 'محاذاة لليمين',
    justify: 'محاذاة بالتساوي',
    print: 'طباعة',
    outdent: 'تقليل المسافة البادئة',
    indent: 'زيادة المسافة البادئة',
    removeFormat: 'إزالة التنسيق',
    formatting: 'تنسيق',
    fontSize: 'حجم الخط',
    align: 'محاذاة',
    hr: 'إضافة المسطرة الأفقية',
    undo: 'تراجع',
    redo: 'إعادة',
    header1: 'ترويسة 1',
    header2: 'ترويسة 2',
    header3: 'ترويسة 3',
    header4: 'ترويسة 4',
    header5: 'ترويسة 5',
    header6: 'ترويسة 6',
    paragraph: 'فقرة',
    code: 'رمز',
    size1: 'صغير جداً',
    size2: 'صغير قليلاً',
    size3: 'عادي',
    size4: 'وسط',
    size5: 'كبير',
    size6: 'كبير جداً',
    size7: 'الأقصى',
    defaultFont: 'الخط الإفتراضي'
  },
  tree: {
    noNodes: 'لا توجد نقاط متاحة',
    noResults: 'لا توجد نقاط متطابقة'
  }
}
