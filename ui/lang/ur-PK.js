const days = 'اتوار_پیر_منگل_بدھ_جمعرات_جمعہ_ہفتہ'.split('_')
const daysShort = 'ات_پیر_منگ_بدھ_جمعر_جمعہ_ہف'.split('_')
// You can refine abbreviations if needed; e.g.
// 'ات_پیر_من_بد_جم_جمع_ہف' or any shorter versions that make sense.

const months = 'جنوری_فروری_مارچ_اپریل_مئی_جون_جولائی_اگست_ستمبر_اکتوبر_نومبر_دسمبر'.split('_')
// Short forms below can also be adjusted if you prefer more concise abbreviations.
const monthsShort = 'جن._فر._مار._اپر._مئی_جون_جول._اگ._ستم._اکت._نوم._دسم.'.split('_')

export default {
  isoName: 'ur-PK',
  nativeName: 'اردو (پاکستان)',
  rtl: true,
  label: {
    clear: 'صاف کریں',
    ok: 'ٹھیک ہے',
    cancel: 'منسوخ کریں',
    close: 'بند کریں',
    set: 'سیٹ کریں',
    select: 'منتخب کریں',
    reset: 'ری سیٹ کریں',
    remove: 'ہٹا دیں',
    update: 'اپ ڈیٹ کریں',
    create: 'بنائیں',
    search: 'تلاش کریں',
    filter: 'فلٹر',
    refresh: 'تازہ کریں',
    expand: label => (label ? `"${ label }" کو وسیع کریں` : 'وسیع کریں'),
    collapse: label => (label ? `"${ label }" کو سکیڑیں` : 'سکیڑیں')
  },
  date: {
    days,
    daysShort,
    months,
    monthsShort,
    // Shown on the Quasar date picker’s title bar; you can adjust the format if needed
    headerTitle: (date, model) =>
      `${ days[ date.getDay() ] }، ${ model.day } ${ months[ model.month - 1 ] }`,
    firstDayOfWeek: 0, // 0-6; 0 = اتوار, 1 = پیر, etc.
    format24h: true,
    pluralDay: 'دن',
    prevMonth: 'پچھلا مہینہ',
    nextMonth: 'اگلے مہینے',
    prevYear: 'پچھلے سال',
    nextYear: 'اگلے سال',
    today: 'آج',
    prevRangeYears: range => `پچھلا ${ range } سال`,
    nextRangeYears: range => `اگلا ${ range } سال`
  },
  table: {
    noData: 'کوئی ڈیٹا دستیاب نہیں',
    noResults: 'کوئی نتیجہ نہیں ملا',
    loading: 'لوڈ ہو رہا ہے...',
    selectedRecords: rows =>
      rows === 0
        ? 'کوئی ریکارڈ منتخب نہیں ہوا'
        : `${ rows } ریکارڈ منتخب ہوئے`,
    recordsPerPage: 'ریکارڈز فی صفحہ:',
    allRows: 'سب',
    pagination: (start, end, total) => `${ start }-${ end } / ${ total }`,
    columns: 'کالم'
  },
  pagination: {
    first: 'لومړی مخ',
    prev: 'مخکینۍ پاڼه',
    next: 'بل مخ',
    last: 'وروستۍ پاڼه'
  },
  editor: {
    url: 'یو آر ایل',
    bold: 'موٹا',
    italic: 'ترچھا',
    strikethrough: 'کاٹا ہوا',
    underline: 'انڈر لائن',
    unorderedList: 'غیر ترتیب شدہ فہرست',
    orderedList: 'ترتیب شدہ فہرست',
    subscript: 'ذیلی',
    superscript: 'بالائی',
    hyperlink: 'ہائپر لنک',
    toggleFullscreen: 'مکمل اسکرین',
    quote: 'اقتباس',
    left: 'بائیں جانب',
    center: 'درمیان میں',
    right: 'دائیں جانب',
    justify: 'برابر پھیلائیں',
    print: 'پرنٹ کریں',
    outdent: 'انڈینٹ کم کریں',
    indent: 'انڈینٹ زیادہ کریں',
    removeFormat: 'فارمیٹنگ ختم کریں',
    formatting: 'فارمیٹنگ',
    fontSize: 'فونٹ سائز',
    align: 'سیدھ کریں',
    hr: 'افقی لکیر داخل کریں',
    undo: 'پچھلا قدم',
    redo: 'دوبارہ کریں',
    heading1: 'سرخی 1',
    heading2: 'سرخی 2',
    heading3: 'سرخی 3',
    heading4: 'سرخی 4',
    heading5: 'سرخی 5',
    heading6: 'سرخی 6',
    paragraph: 'پیراگراف',
    code: 'کوڈ',
    size1: 'بہت چھوٹا',
    size2: 'چھوٹا',
    size3: 'معمولی',
    size4: 'درمیانہ',
    size5: 'بڑا',
    size6: 'بہت بڑا',
    size7: 'سب سے بڑا',
    defaultFont: 'طے شدہ فونٹ',
    viewSource: 'ماخذ دیکھیں'
  },
  tree: {
    noNodes: 'کوئی نوڈ دستیاب نہیں',
    noResults: 'کوئی نوڈ نہیں ملا'
  }
}
