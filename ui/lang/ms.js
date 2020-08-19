export default {
  isoName: 'ms',
  nativeName: 'Bahasa Melayu',
  label: {
    clear: 'Semula',
    ok: 'OK',
    cancel: 'Batal',
    close: 'Tutup',
    set: 'Set',
    select: 'Pilih',
    reset: 'Reset',
    remove: 'Keluarkan',
    update: 'Kemaskini',
    create: 'Tambah',
    search: 'Cari',
    filter: 'Saring',
    refresh: 'Muat semula'
  },
  date: {
    days: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jummat_Sabtu'.split('_'),
    daysShort: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jummat_Sabtu'.split('_'),
    months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_Oktober_November_Disember'.split('_'),
    monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogos_Sep_Okt_Nov_Dis'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false,
    pluralDay: 'hari'
  },
  table: {
    noData: 'Tiada data tersedia',
    noResults: 'Tiada rekod sepadan yang dijumpai',
    loading: 'Sedang dalam proses..',
    selectedRecords: function (rows) {
      return rows > 1
        ? rows + ' rekod terpilih.'
        : (rows === 0 ? 'tiada' : '1') + ' rekod terpilih.'
    },
    recordsPerPage: 'Rekod per halaman:',
    allRows: 'Semua',
    pagination: function (start, end, total) {
      return start + '-' + end + ' dari ' + total
    },
    columns: 'Kolum'
  },
  editor: {
    url: 'URL',
    bold: 'Tebal',
    italic: 'Italik',
    strikethrough: 'Garis Tengah',
    underline: 'Garis Bawah',
    unorderedList: 'Daftar Tidak Tersusun',
    orderedList: 'Daftar Tersusun',
    subscript: 'Subskrip',
    superscript: 'Superskrip',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'Alihkan Layar Penuh',
    quote: 'Petikan',
    left: 'Selaras Kiri',
    center: 'Selaras Tengah',
    right: 'Selaras Kanan',
    justify: 'Selaras Sisi',
    print: 'Cetak',
    outdent: 'Kurangkan Indentasi',
    indent: 'Tambah indentasi',
    removeFormat: 'Buang Format',
    formatting: 'Format',
    fontSize: 'Saiz Tulisan',
    align: 'Selaras',
    hr: 'Masukkan Aturan Horizontal',
    undo: 'Undo',
    redo: 'Redo',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    paragraph: 'Paragraf',
    code: 'Kod',
    size1: 'Paling Kecil',
    size2: 'Agak Kecil',
    size3: 'Normal',
    size4: 'Sederhana',
    size5: 'Besar',
    size6: 'Paling Besar',
    size7: 'Maksimum',
    defaultFont: 'Tulisan Asal',
    viewSource: 'Lihat sumber'
  },
  tree: {
    noNodes: 'Tiada nod tersedia',
    noResults: 'Tiada nod yang sesuai dijumpai'
  }
}
