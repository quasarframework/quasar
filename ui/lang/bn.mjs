export default {
  isoName: 'bn',
  nativeName: 'বাংলা',
  label: {
    clear: 'পরিষ্কার',
    ok: 'ঠিক আছে',
    cancel: 'বাতিল',
    close: 'বন্ধ',
    set: 'স্থাপন',
    select: 'নির্বাচন',
    reset: 'পুন:স্থাপন',
    remove: 'অপসারণ',
    update: 'আধুনিকরণ',
    create: 'তৈরী',
    search: 'সন্ধান',
    filter: 'ছাঁকনি',
    refresh: 'সতেজ'
  },
  date: {
    days: 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
    daysShort: 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
    months: 'জানুয়ারি_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
    monthsShort: 'জানুয়ারি_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false,
    pluralDay: 'দিন'
  },
  table: {
    noData: 'কোন তথ্য নেই',
    noResults: 'কোনো মিলের তথ্য পাওয়া যায়নি',
    loading: 'লোড হচ্ছে...',
    selectedRecords: rows => (
      rows === 1
        ? '১ টি রেকর্ড নির্বাচিত'
        : (rows === 0 ? '' : rows) + ' রেকর্ড নির্বাচিত'
    ),
    recordsPerPage: 'প্রতি পৃষ্ঠায় রেকর্ড:',
    allRows: 'সব',
    pagination: (start, end, total) => start + '-' + end + ' মধ্যে ' + total,
    columns: 'কলাম'
  },
  editor: {
    url: 'ইউ আর এল',
    bold: 'মোটা',
    italic: 'বাঁকা',
    strikethrough: 'কাটা',
    underline: 'নিচে দাগ',
    unorderedList: 'অনিয়ন্ত্রিত তালিকা',
    orderedList: 'নিয়ন্ত্রিত তালিকা',
    subscript: 'নিম্ন লিখিত',
    superscript: 'শীর্ষদেশে লিখনযুক্ত',
    hyperlink: 'হাইপারলিঙ্ক',
    toggleFullscreen: 'টগল পূর্ণপর্দা',
    quote: 'উদ্ধৃতি',
    left: 'বাম সারিবদ্ধ',
    center: 'কেন্দ্র সারিবদ্ধ',
    right: 'ডান সারিবদ্ধ',
    justify: 'সারিবদ্ধ',
    print: 'ছাপা',
    outdent: 'ইন্ডেন্টেশন কমান',
    indent: 'ইন্ডেন্টেশন বাড়ান',
    removeFormat: 'বিন্যাস সরান',
    formatting: 'বিন্যাস',
    fontSize: 'অক্ষরের আকার',
    align: 'সারিবদ্ধ',
    hr: 'অনুভূমিক নিয়ম সন্নিবেশ করান',
    undo: 'পূর্বাবস্থায় ফেরান',
    redo: 'পুনরায় করুন',
    heading1: 'শিরোনাম 1',
    heading2: 'শিরোনাম 2',
    heading3: 'শিরোনাম 3',
    heading4: 'শিরোনাম 4',
    heading5: 'শিরোনাম 5',
    heading6: 'শিরোনাম 6',
    paragraph: 'শিরোনাম',
    code: 'কোড',
    size1: 'খুব ছোট',
    size2: 'একটু ছোট',
    size3: 'স্বাভাবিক',
    size4: 'মাঝারি বৃহৎ',
    size5: 'বড়',
    size6: 'অনেক বড়',
    size7: 'সর্বোচ্চ',
    defaultFont: 'ডিফল্ট ফন্ট',
    viewSource: 'উৎস দেখুন'
  },
  tree: {
    noNodes: 'কোন নোড পাওয়া যায়নি',
    noResults: 'কোন মিলে যাওয়া নোড পাওয়া যায়নি'
  }
}
