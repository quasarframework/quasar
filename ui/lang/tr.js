export default {
  isoName: 'tr',
  nativeName: 'Türkçe',
  label: {
    clear: 'Temizle',
    ok: 'Tamam',
    cancel: 'İptal',
    close: 'Kapat',
    set: 'Ayarla',
    select: 'Seç',
    reset: 'Sıfırla',
    remove: 'Kaldır',
    update: 'Güncelle',
    create: 'Oluştur',
    search: 'Ara',
    filter: 'Süz',
    refresh: 'Yenile'
  },
  date: {
    days: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
    daysShort: 'Paz_Pzt_Sal_Çar_Per_Cum_Cmt'.split('_'),
    months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
    monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  table: {
    noData: 'Veri yok',
    noResults: 'Uyuşan kayıt bulunamadı',
    loading: 'Yükleniyor...',
    selectedRecords: function (rows) {
      return rows + ' seçili kayıt.'
    },
    recordsPerPage: 'Sayfa başına kayıt:',
    allRows: 'Tümü',
    pagination: function (start, end, total) {
      return start + '-' + end + ' toplam ' + total
    },
    columns: 'Sütunlar'
  },
  editor: {
    url: 'URL',
    bold: 'Kalın',
    italic: 'Eğik',
    strikethrough: 'Üstü çizili',
    underline: 'Altı çizili',
    unorderedList: 'Sırasız Liste',
    orderedList: 'Sıralı Liste',
    subscript: 'Alt betik',
    superscript: 'Üst betik',
    hyperlink: 'Köprü',
    toggleFullscreen: 'Tam ekranı Aç-Kapa',
    quote: 'Alıntı',
    left: 'Sola hizala',
    center: 'Ortala',
    right: 'Sağa hizala',
    justify: 'Sığdır',
    print: 'Yazdır',
    outdent: 'Girintiyi azalt',
    indent: 'Girintiyi artır',
    removeFormat: 'Biçimlendirmeyi kaldır',
    formatting: 'Biçimliyor',
    fontSize: 'Yazı Tipi Boyutu',
    align: 'Hizala',
    hr: 'Yatay Çizgi Ekle',
    undo: 'Geri Al',
    redo: 'Yinele',
    header1: 'Başlık 1',
    header2: 'Başlık 2',
    header3: 'Başlık 3',
    header4: 'Başlık 4',
    header5: 'Başlık 5',
    header6: 'Başlık 6',
    paragraph: 'Paragraf',
    code: 'Kod',
    size1: 'Çok küçük',
    size2: 'Küçük',
    size3: 'Normal',
    size4: 'Orta-geniş',
    size5: 'Büyük',
    size6: 'Çok büyük',
    size7: 'En büyük',
    defaultFont: 'Varsayılan Yazı Tipi'
  },
  tree: {
    noNodes: 'Düğüm yok',
    noResults: 'Uyuşan düğüm bulunamadı'
  }
}
