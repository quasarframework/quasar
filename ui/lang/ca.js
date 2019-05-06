export default {
  isoName: 'ca',
  nativeName: 'Català',
  label: {
    clear: 'Neteja',
    ok: 'D\'acord',
    cancel: 'Cancel·la',
    close: 'Tanca',
    set: 'Estableix',
    select: 'Selecciona',
    reset: 'Restableix',
    remove: 'Elimina',
    update: 'Actualitza',
    create: 'Crea',
    search: 'Cerca',
    filter: 'Filtra',
    refresh: 'Refresca'
  },
  date: {
    days: 'Diumenge_Dilluns_Dimarts_Dimecres_Dijous_Divendres_Dissabte'.split('_'),
    daysShort: 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
    months: 'Gener_Febrer_Març_Abril_Maig_Juny_Juliol_Agost_Setembre_Octubre_Novembre_Desembre'.split('_'),
    monthsShort: 'Gen_Feb_Mar_Abr_Mai_Jun_Jul_Ago_Set_Oct_Nov_Des'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  table: {
    noData: 'No hi ha dades disponibles',
    noResults: 'No s\'han trobat resultats',
    loading: 'Carregant...',
    selectedRecords: function (rows) {
      return rows > 1
        ? rows + ' files seleccionades.'
        : (rows === 0 ? 'Sense' : '1') + ' fila seleccionada.'
    },
    recordsPerPage: 'Files per pàgina:',
    allRows: 'Totes',
    pagination: function (start, end, total) {
      return start + '-' + end + ' de ' + total
    },
    columns: 'Columnes'
  },
  editor: {
    url: 'URL',
    bold: 'Negreta',
    italic: 'Cursiva',
    strikethrough: 'Barrat',
    underline: 'Subratllat',
    unorderedList: 'Llista sense ordre',
    orderedList: 'Llista amb ordre',
    subscript: 'Subíndex',
    superscript: 'Superíndex',
    hyperlink: 'Hyperenllaç',
    toggleFullscreen: 'Commuta pantalla completa',
    quote: 'Cita',
    left: 'Alínea a l\'esquerra',
    center: 'Alínea al centre',
    right: 'Alínea a la dreta',
    justify: 'Alínea justificat',
    print: 'Imprimeix',
    outdent: 'Incrementa la sagnia',
    indent: 'Disminueix la sagnia',
    removeFormat: 'Lleva el format',
    formatting: 'Donant format',
    fontSize: 'Mida de la font',
    align: 'Alínea',
    hr: 'Insereix una línea horitzontal',
    undo: 'Desfés',
    redo: 'Refés',
    header1: 'Encapçalament 1',
    header2: 'Encapçalament 2',
    header3: 'Encapçalament 3',
    header4: 'Encapçalament 4',
    header5: 'Encapçalament 5',
    header6: 'Encapçalament 6',
    paragraph: 'Paràgraf',
    code: 'Codi',
    size1: 'Molt petit',
    size2: 'Un poc petit',
    size3: 'Normal',
    size4: 'Mitjà-gran',
    size5: 'Gran',
    size6: 'Molt gran',
    size7: 'Màxim',
    defaultFont: 'Font per defecte'
  },
  tree: {
    noNodes: 'No hi han nodes disponibles',
    noResults: 'No s\'han trobat nodes'
  }
}
