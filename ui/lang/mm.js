export default {
  isoName: 'mm',
  nativeName: 'မြန်မာ',
  label: {
    clear: 'ရှင်းလင်းမည်',
    ok: 'အဆင်ပြေသည်',
    cancel: 'မလုပ်တော့ပါ',
    close: 'ပိတ်မည်',
    set: 'သတ်မှတ်မည်',
    select: 'ရွေးမည်',
    reset: 'ပြန်လည်သတ်မှတ်မည်',
    remove: 'ပယ်ဖျက်မည်',
    update: 'ပြင်ဆင်မည်',
    create: 'ဖန်တီးမည်',
    search: 'ရှာမည်',
    filter: 'စစ်ထုတ်မည်',
    refresh: 'အသစ်ပြန်လုပ်မည်',
    expand: label => (label ? `"${ label }" ကိုချဲ့ထွင်ပါ။` : 'ချဲ့ထွင်ပါ။'),
    collapse: label => (label ? `"${ label }" ကို ခေါက်သိမ်းပါ` : 'ခေါက်သိမ်းပါ')
  },
  date: {
    days: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
    daysShort: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
    months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
    monthsShort: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false,
    pluralDay: 'ရက်',
    prevMonth: 'အရင်လ',
    nextMonth: 'နောက်လ',
    prevYear: 'အရင်နှစ်',
    nextYear: 'နောက်နှစ်',
    today: 'ဒီနေ့',
    prevRangeYears: range => `ယခင် ${ range } နှစ် များ`,
    nextRangeYears: range => `နောက် ${ range } နှစ် များ`
  },
  table: {
    noData: 'အချက်အလတ်မရှိပါ',
    noResults: 'ကိုက်ညီသောရလဒ်မရှိပါ',
    loading: 'လုပ်ဆောင်နေသည်',
    selectedRecords: rows => (
      rows > 0
        ? rows + ' တန်းရွေးချယ်ထားသည်'
        : 'ဘာမှ မရွေးချယ်ထားပါ'
    ),
    recordsPerPage: 'တစ်မျက်နှာခြင်း အတန်းရေတွက်',
    allRows: 'အားလုံး',
    // eslint-disable-next-line no-useless-concat
    pagination: (start, end, total) => start + 'မှ' + end + 'ထိ' + 'အားလုံး' + total + 'ရှိ',
    columns: 'ကော်လံ'
  },
  pagination: {
    first: 'ပထမစာမျက်နှာ',
    prev: 'အရင်စာမျက်နှာ',
    next: 'နောက်စာမျက်နှာ',
    last: 'နောက်ဆုံးစာမျက်နှာ'
  },
  editor: {
    url: 'URL',
    bold: 'အထူ',
    italic: 'အစောင်း',
    strikethrough: 'လိုင်းဖြတ်',
    underline: 'လိုင်းအောက်',
    unorderedList: 'မစီထားသောစာရင်း',
    orderedList: 'စီးထားသောစာရင်း',
    subscript: 'Subscript',
    superscript: 'Superscript',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'စခရင်းပြည့် ဖွင့်/ပိတ်',
    quote: 'Quote',
    left: 'ဘယ်',
    center: 'အလယ်',
    right: 'ညာ',
    justify: 'Justify align',
    print: 'Print',
    outdent: 'Decrease indentation',
    indent: 'Increase indentation',
    removeFormat: 'Remove formatting',
    formatting: 'Formatting',
    fontSize: 'ဖောင့်အရွယ်အစား',
    align: 'Align',
    hr: 'Insert Horizontal Rule',
    undo: 'Undo',
    redo: 'Redo',
    heading1: 'ခေါင်းစဉ် ၁',
    heading2: 'ခေါင်းစဉ် ၂',
    heading3: 'ခေါင်းစဉ် ၃',
    heading4: 'ခေါင်းစဉ် ၄',
    heading5: 'ခေါင်းစဉ် ၅',
    heading6: 'ခေါင်းစဉ် ၆',
    paragraph: 'စာပိုဒ်',
    code: 'ကုဒ်',
    size1: 'အသေးဆုံး',
    size2: 'အသေး',
    size3: 'ပုံမုန်',
    size4: 'အလယ်အလတ်',
    size5: 'အကြီး',
    size6: 'ပိုကြီး',
    size7: 'အကြီးဆုံး',
    defaultFont: 'Default Font',
    viewSource: 'View Source'
  },
  tree: {
    noNodes: 'No nodes available',
    noResults: 'No matching nodes found'
  }
}
