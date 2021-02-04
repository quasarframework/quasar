export default {
  isoName: 'id',
  nativeName: 'Bahasa Indonesia',
  label: {
    clear: 'Bersihkan',
    ok: 'OK',
    cancel: 'Batal',
    close: 'Tutup',
    set: 'Set',
    select: 'Pilih',
    reset: 'Reset',
    remove: 'Copot',
    update: 'Perbarui',
    create: 'Buat',
    search: 'Cari',
    filter: 'Saring',
    refresh: 'Segarkan'
  },
  date: {
    days: 'Minggu_Senin_Selasa_Rabu_Kamis_Jum\'at_Sabtu'.split('_'),
    daysShort: 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
    months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'hari'
  },
  table: {
    noData: 'Tidak ada data tersedia',
    noResults: 'Tidak ada yang cocok',
    loading: 'Memuat...',
    selectedRecords: function (rows) {
      return rows > 1
        ? rows + ' baris terpilih.'
        : (rows === 0 ? 'tidak ada' : '1') + ' baris terpilih.'
    },
    recordsPerPage: 'Baris per halaman:',
    allRows: 'Semua',
    pagination: function (start, end, total) {
      return start + '-' + end + ' dari ' + total
    },
    columns: 'Kolom'
  },
  editor: {
    url: 'URL',
    bold: 'Tebal',
    italic: 'Miring',
    strikethrough: 'Coret',
    underline: 'Garis Bawah',
    unorderedList: 'Daftar tak Tersusun',
    orderedList: 'Daftar Tersusun',
    subscript: 'Subscript',
    superscript: 'Superscript',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'Alihkan Layar Penuh',
    quote: 'Kutip',
    left: 'Rata Kiri',
    center: 'Rata Tengah',
    right: 'Rata Kanan',
    justify: 'Rata Sisi',
    print: 'Cetak',
    outdent: 'Kurangi Indentasi',
    indent: 'Tambah indentasi',
    removeFormat: 'Hilangkan Pemformatan',
    formatting: 'Pemformatan',
    fontSize: 'Ukuran Huruf',
    align: 'Rata',
    hr: 'Masukkan Aturan Horizontal',
    undo: 'Urungkan',
    redo: 'Ulangi',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    paragraph: 'Paragraf',
    code: 'Kode',
    size1: 'Sangat Kecil',
    size2: 'Agak Kecil',
    size3: 'Normal',
    size4: 'Agak Besar',
    size5: 'Besar',
    size6: 'Sangat Besar',
    size7: 'Maksimum',
    defaultFont: 'Huruf Bawaan',
    viewSource: 'Lihat sumber'
  },
  tree: {
    noNodes: 'Tak ada node tersedia',
    noResults: 'Tak ditemukan node yang cocok'
  }
}
