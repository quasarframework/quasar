export default {
  lang: 'nb-no',
  label: {
    clear: 'Tøm',
    ok: 'OK',
    cancel: 'Avbryt',
    close: 'Lukk',
    set: 'Bruk',
    select: 'Velg',
    reset: 'Nullstill',
    remove: 'Slett',
    update: 'Oppdater',
    create: 'Lag',
    search: 'Søk',
    filter: 'Filter',
    refresh: 'Oppdater'
  },
  date: {
    days: 'Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag'.split('_'),
    daysShort: 'Søn_Man_Tir_Ons_Tor_Fre_Lør'.split('_'),
    months: 'Januar_Februar_Mars_April_Mai_Juni_Juli_August_September_Oktober_November_Desember'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  table: {
    noData: 'Ingen data tilgjenelig',
    noResults: 'Ingen treff i data funnet',
    loading: 'Laster...',
    row: 'rad',
    selectedRecords: function (rows) {
      return rows > 0
        ? rows + ' row' + (rows === 1 ? '' : 's') + ' valgt.'
        : 'Ingen valgte rader.'
    },
    recordsPerPage: 'Rader pr side:',
    allRows: 'Alle',
    pagination: function (start, end, total) {
      return start + '-' + end + ' av ' + total
    },
    columns: 'Kolonner'
  },
  editor: {
    url: 'URL',
    bold: 'Fet',
    italic: 'Kursiv',
    strikethrough: 'Strikethrough',
    underline: 'Understrek',
    unorderedList: 'Uordnet liste',
    orderedList: 'Ordnet liste',
    subscript: 'Senket skrift',
    superscript: 'Hevet skrift',
    hyperlink: 'Lenke',
    toggleFullscreen: 'Av/på fullskjerm',
    quote: 'Sitat',
    left: 'Venstrestill',
    center: 'Sentrer',
    right: 'Høyrestill',
    justify: 'Tilpasset bredde',
    print: 'Skriv ut',
    outdent: 'Midre innrykk',
    indent: 'Større innrykk',
    removeFormat: 'Fjern formatering',
    formatting: 'Formatering',
    fontSize: 'Fontstørrelse',
    align: 'Stilling',
    hr: 'Sett inn horisontal linje',
    undo: 'Angre',
    redo: 'Gjenta',
    header1: 'Overskrift 1',
    header2: 'Overskrift 2',
    header3: 'Overskrift 3',
    header4: 'Overskrift 4',
    header5: 'Overskrift 5',
    header6: 'Overskrift 6',
    paragraph: 'Avsnitt',
    code: 'Kode',
    size1: 'Veldig liten',
    size2: 'Liten',
    size3: 'Normal',
    size4: 'Medium-stor',
    size5: 'Stor',
    size6: 'Veldig stor',
    size7: 'Maximum',
    defaultFont: 'Normal font'
  },
  tree: {
    noNodes: 'Ingen noder tilgjenelig',
    noResults: 'Ingen treff i noder funnet'
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
