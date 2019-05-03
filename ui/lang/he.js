export default {
  isoName: 'he',
  nativeName: 'עברית',
  rtl: true,
  label: {
    clear: 'נקה',
    ok: 'אישור',
    cancel: 'ביטול',
    close: 'סגור',
    set: 'הגדר',
    select: 'בחר',
    reset: 'איפוס',
    remove: 'מחק',
    update: 'עדכן',
    create: 'צור',
    search: 'חיפוש',
    filter: 'סינון',
    refresh: 'רענון'
  },
  date: {
    days: 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
    daysShort: 'א_ב_ג_ד_ה_ו_ש'.split('_'),
    months: 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
    monthsShort: 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  table: {
    noData: 'לא נמצאו נתונים',
    noResults: 'לא נמצאו תוצאות רלוונטיות',
    loading: 'טוען...',
    selectedRecords: function (rows) {
      return rows === 1
        ? 'נבחרה שורה אחת.'
        : (rows === 0 ? 'לא' : rows) + ' שורות נבחרו'
    },
    recordsPerPage: 'שורות בעמוד:',
    allRows: 'הכל',
    pagination: function (start, end, total) {
      return start + '-' + end + ' מתוך ' + total
    },
    columns: 'עמודות'
  },
  editor: {
    url: 'כתובת אתר',
    bold: 'בולט',
    italic: 'נטוי',
    strikethrough: 'קו חוצה',
    underline: 'קו תחתון',
    unorderedList: 'רשימת תבליטים',
    orderedList: 'רשימה ממוספרת',
    subscript: 'קו תחתון',
    superscript: 'קו עליון',
    hyperlink: 'קישור',
    toggleFullscreen: 'מסך מלא',
    quote: 'ציטוט',
    left: 'יישור לשמאל',
    center: 'יישור למרכז',
    right: 'יישור לימין',
    justify: 'יישור',
    print: 'הדפסה',
    outdent: 'הקטן כניסה',
    indent: 'הגדל כניסה',
    removeFormat: 'נקה עיתוב',
    formatting: 'עיצוב',
    fontSize: 'גודל פונט',
    align: 'יישור',
    hr: 'הוסף קו אופקי',
    undo: 'בטל',
    redo: 'בצע מחדש',
    header1: 'כותרת 1',
    header2: 'כותרת 2',
    header3: 'כותרת 3',
    header4: 'כותרת 4',
    header5: 'כותרת 5',
    header6: 'כותרת 6',
    paragraph: 'פסקה',
    code: 'קטע קוד',
    size1: 'קטן מאוד',
    size2: 'קטן',
    size3: 'נורמלי',
    size4: 'בינוני-גדול',
    size5: 'גדול',
    size6: 'גדול מאוד',
    size7: 'מקסימלי',
    defaultFont: 'ברירת מחדל'
  },
  tree: {
    noNodes: 'אין פריטים להצגה',
    noResults: 'לא נמצאו פריטים רלוונטים'
  }
}
