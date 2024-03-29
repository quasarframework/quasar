export default {
  isoName: 'ms-MY',
  nativeName: 'Malaysia',
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
    create: 'Cipta',
    search: 'Cari',
    filter: 'Saring',
    refresh: 'Muat semula',
    expand: label => (label ? `Kembangkan "${ label }"` : 'Kembangkan'),
    collapse: label => (label ? `Runtuhkan "${ label }"` : 'Runtuh')
  },
  date: {
    days: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
    daysShort: 'Aha_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
    months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
    monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogo_Sep_Okt_Nov_Dis'.split('_'),
    headerTitle: date => new Intl.DateTimeFormat('my', {
      weekday: 'short', month: 'short', day: 'numeric'
    }).format(date),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false,
    pluralDay: 'hari'
  },
  table: {
    noData: 'Tiada data tersedia',
    noResults: 'Tiada rekod yang sepadan ditemui',
    loading: 'Dalam proses...',
    selectedRecords: rows => (
      rows > 1
        ? rows + ' rekod terpilih.'
        : (rows === 0 ? 'tiada' : '1') + ' rekod terpilih.'
    ),
    recordsPerPage: 'Rekod setiap halaman:',
    allRows: 'Semua',
    pagination: (start, end, total) => start + '-' + end + ' / ' + total,
    columns: 'Senaraikan'
  },
  editor: {
    url: 'URL',
    bold: 'Tebal',
    italic: 'Italik',
    strikethrough: 'Garis Tengah',
    underline: 'Garis Bawah',
    unorderedList: 'Senarai Tidak Teratur',
    orderedList: 'Senarai Teratur',
    subscript: 'Subskrip',
    superscript: 'Superskrip',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'Togol Skrin Penuh',
    quote: 'Petikan',
    left: 'Jajar ke Kiri',
    center: 'Penjajaran Tengah',
    right: 'Sejajar ke kanan',
    justify: 'Wajar',
    print: 'Cetak',
    outdent: 'Mengurangkan Lekukan',
    indent: 'Tambah Indentasi',
    removeFormat: 'Buang Format',
    formatting: 'Format',
    fontSize: 'Saiz Huruf',
    align: 'Selaraskan',
    hr: 'Masukkan Garisan Mendatar',
    undo: 'Undo',
    redo: 'Redo',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    paragraph: 'Perenggan',
    code: 'Kod',
    size1: 'Paling Kecil',
    size2: 'Agak Kecil',
    size3: 'Normal',
    size4: 'Sederhana',
    size5: 'Besar',
    size6: 'Paling Besar',
    size7: 'Maksimum',
    defaultFont: 'Tulisan Asal',
    viewSource: 'Lihat Sumber'
  },
  tree: {
    noNodes: 'Tiada nod tersedia',
    noResults: 'Tiada nod yang sepadan dijumpai'
  }
}
