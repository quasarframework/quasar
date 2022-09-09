export default {
  isoName: 'uz-Latn',
  nativeName: 'O\'zbekcha (Lotin)',
  label: {
    clear: 'Tozalash',
    ok: 'OK',
    cancel: 'Bekor qilish',
    close: 'Yopish',
    set: 'O\'rnatish',
    select: 'Tanlash',
    reset: 'Qayta o\'rnatish',
    remove: 'O\'chirish',
    update: 'Yangilash',
    create: 'Yaratish',
    search: 'Qidirish',
    filter: 'Filtrlash',
    refresh: 'Yangilash'
  },
  date: {
    days: 'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split(
      '_'
    ),
    daysShort: 'Yak_Du_Se_Chor_Pay_Juma_Shanba'.split('_'),
    months:
      'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split(
        '_'
      ),
    monthsShort: 'Yan_Fev_Mart_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split(
      '_'
    ),
    firstDayOfWeek: 1, // 0-6, 0 - Yakshanba, 1 Dushanba, ...
    format24h: true,
    pluralDay: 'Kunlar'
  },
  table: {
    noData: 'Ma\'lumotlar topilmadi',
    noResults: 'Qidiruv bo\'yicha ma\'lumotlar topilmadi',
    loading: 'Yuklanmoqda...',
    selectedRecords: (rows) =>
      (rows === 1
        ? '1 ta malumot  tanlandi.'
        : (rows === 0 ? 'Hech qanday' : rows) + ' ma\'lumotlar tanlanmadi.'),
    recordsPerPage: 'Saxifadagi qatorlar:',
    allRows: 'Barchasi',
    pagination: (start, end, total) => start + '-' + end + ' jami ' + total,
    columns: 'Ustunlar'
  },
  editor: {
    url: 'URL',
    bold: 'Qalin',
    italic: 'Kursiv',
    strikethrough: 'Chizilgan',
    underline: 'Tagiga chizilgan',
    unorderedList: 'Tartibsiz ro\'yxat',
    orderedList: 'Tartibga keltirilgan ro\'yxat',
    subscript: 'Satr ostida',
    superscript: 'Satr ustida',
    hyperlink: 'Giperhavola',
    toggleFullscreen: 'To\'liq ekran rejimiga o\'tish',
    quote: 'Iqtibos',
    left: 'Chapga saflash',
    center: 'Markazga saflash',
    right: 'O\'nggadan saflash',
    justify: 'Ikki tomondan saflash',
    print: 'Chop etish',
    outdent: 'Chekinishni kamaytirish',
    indent: 'Chekinishni ko\'paytirish',
    removeFormat: 'Formatlashni o\'chirib tashlash',
    formatting: 'Formatlash',
    fontSize: 'Shrift hajmi',
    align: 'Saflash',
    hr: 'Gorizontal qoidani kiritish',
    undo: 'Bekor qilish',
    redo: 'Takrorlash',
    heading1: 'Sarlavha 1',
    heading2: 'Sarlavha 2',
    heading3: 'Sarlavha 3',
    heading4: 'Sarlavha 4',
    heading5: 'Sarlavha 5',
    heading6: 'Sarlavha 6',
    paragraph: 'Paragraf',
    code: 'Kod',
    size1: 'Juda kichkik',
    size2: 'Biroz kichik',
    size3: 'Oddiy',
    size4: 'O\'rta katta',
    size5: 'Katta',
    size6: 'Juda katta',
    size7: 'Maksimal',
    defaultFont: 'Standart shrift',
    viewSource: 'Manbani ko\'rish'
  },
  tree: {
    noNodes: 'Kesishmalar mavjud emas',
    noResults: 'Mos keladigan kesishmalar topilmadi'
  }
}
