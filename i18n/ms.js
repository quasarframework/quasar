export default {
  lang: 'ms',
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
    format24h: false
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
    header1: 'Header 1',
    header2: 'Header 2',
    header3: 'Header 3',
    header4: 'Header 4',
    header5: 'Header 5',
    header6: 'Header 6',
    paragraph: 'Paragraf',
    code: 'Kod',
    size1: 'Paling Kecil',
    size2: 'Agak Kecil',
    size3: 'Normal',
    size4: 'Sederhana',
    size5: 'Besar',
    size6: 'Paling Besar',
    size7: 'Maksimum',
    defaultFont: 'Tulisan Asal'
  },
  tree: {
    noNodes: 'Tiada nod tersedia',
    noResults: 'Tiada nod yang sesuai dijumpai'
  },
  media: {
    oldBrowserVideo: 'To view this video please enable JavaScript and/or consider upgrading to a browser that supports HTML5 video.',
    oldBrowserAudio: 'To listen to this audio please enable JavaScript and/or consider upgrading to a browser that supports HTML5 audio.',
    pause: 'Pause',
    play: 'Play',
    settings: 'Settings',
    toggleFullscreen: 'Toggle Fullscreen',
    mute: 'Mute',
    unmute: 'Unmute',
    speed: 'Speed', // Playback rate
    language: 'Language',
    playbackRate: 'Playback Rate',
    waitingVideo: 'Waiting for video',
    waitingAudio: 'Waiting for audio',
    ratePoint5: '.5x',
    rateNormal: 'Normal',
    rate1Point5: '1.5x',
    rate2: '2x',
    trackLanguageOff: 'Off',
    noLoadVideo: 'Unable to load video',
    noLoadAudio: 'Unable to load audio',
    cannotPlayVideo: 'Cannot play video',
    cannotPlayAudio: 'Cannot play audio'
  }
}
