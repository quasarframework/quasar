export default {
  isoName: 'az-Latn',
  nativeName: 'Azerbaijani (latin)',
  label: {
    clear: 'Təmizlə',
    ok: 'OK',
    cancel: 'Ləğv et',
    close: 'Bağla',
    set: 'Ayarla',
    select: 'Seç',
    reset: 'Sıfırla',
    remove: 'Sil',
    update: 'Güncəllə',
    create: 'Yarat',
    search: 'Axtar',
    filter: 'Filtrlə',
    refresh: 'Yenilə'
  },
  date: {
    days: 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
    daysShort: 'B_B.E_Ç_Ç.E_C.A_C_Ş'.split('_'),
    months: 'Yanvar_Fevral_Mart_Aprel_May_İyun_İyul_Avqust_Sentyabr_Oktyabr_Noyabr_Dekabr'.split('_'),
    monthsShort: 'Yan_Fev_Mar_Apr_May_İyn_İyl_Avq_Sen_Okt_Noy_Dek'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'gün'
  },
  table: {
    noData: 'Məlumat yoxdur',
    noResults: 'Uyğun məlumat tapılmadı',
    loading: 'Yüklənir...',
    selectedRecords: rows => (
      rows === 1
        ? '1 record selected.'
        : (rows === 0 ? 'No' : rows) + ' seçilmiş məlumat.'
    ),
    recordsPerPage: 'Hər səhifədəki məlumat:',
    allRows: 'Bütün',
    pagination: (start, end, total) => start + '-' + end + ' cəmi ' + total,
    columns: 'Sütun'
  },
  editor: {
    url: 'URL',
    bold: 'Bold',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    underline: 'Altdan xətt',
    unorderedList: 'Sıralanmamış siyahı',
    orderedList: 'Sıralanmış siyahı',
    subscript: 'Alt yazı',
    superscript: 'Üst yazı',
    hyperlink: 'Link',
    toggleFullscreen: 'Tam ekranı aç/bağla',
    quote: 'Sitat',
    left: 'Sol tərəf',
    center: 'Orta',
    right: 'Rağ tərəf',
    justify: 'Mərkəzləşdir',
    print: 'Çap et',
    outdent: 'Abzası azalt',
    indent: 'Abzası artır',
    removeFormat: 'Formatlamanı sil',
    formatting: 'Formatlama',
    fontSize: 'Font ölçüsü',
    align: 'Tərəf',
    hr: 'Horizantal xətt əlavə et',
    undo: 'Geri qaytar',
    redo: 'Təkrarla',
    heading1: 'Başlıq 1',
    heading2: 'Başlıq 2',
    heading3: 'Başlıq 3',
    heading4: 'Başlıq 4',
    heading5: 'Başlıq 5',
    heading6: 'Başlıq 6',
    paragraph: 'Paraqraf',
    code: 'Kod',
    size1: 'Çox kiçik',
    size2: 'Bir az kiçik',
    size3: 'Normal',
    size4: 'Orta-böyük',
    size5: 'Böyük',
    size6: 'Çox böyük',
    size7: 'Maksimum',
    defaultFont: 'Varsayılan font',
    viewSource: 'Qaynağı gör'
  },
  tree: {
    noNodes: 'Düyün yoxdur',
    noResults: 'Uyğun düyün yoxdur'
  }
}
