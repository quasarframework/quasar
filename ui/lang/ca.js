export default {
  isoName: 'ca',
  nativeName: 'Català',
  label: {
    clear: 'Netejar',
    ok: 'D\'acord',
    cancel: 'Cancel·lar',
    close: 'Tancar',
    set: 'Definir',
    select: 'Seleccionar',
    reset: 'Reinicialitzar',
    remove: 'Suprimir',
    update: 'Actualitzar',
    create: 'Crear',
    search: 'Cercar',
    filter: 'Filtrar',
    refresh: 'Refrescar'
  },
  date: {
    days: 'Diumenge_Dilluns_Dimarts_Dimecres_Dijous_Divendres_Dissabte'.split('_'),
    daysShort: 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
    months: 'Gener_Febrer_Març_Abril_Maig_Juny_Juliol_Agost_Setembre_Octubre_Novembre_Desembre'.split('_'),
    monthsShort: 'Gen_Feb_Mar_Abr_Mai_Jun_Jul_Ago_Set_Oct_Nov_Des'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dies'
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
    hyperlink: 'Hiperenllaç',
    toggleFullscreen: 'Commutar pantalla completa',
    quote: 'Cita',
    left: 'Alinear a l\'esquerra',
    center: 'Alinear al centre',
    right: 'Alinear a la dreta',
    justify: 'Alinear justificat',
    print: 'Imprimir',
    outdent: 'Augmentar identació',
    indent: 'Disminuir identació',
    removeFormat: 'Llevar el format',
    formatting: 'Formatant',
    fontSize: 'Mida de la font',
    align: 'Alinear',
    hr: 'Inserir una línea horitzontal',
    undo: 'Desfer',
    redo: 'Refer',
    heading1: 'Encapçalament 1',
    heading2: 'Encapçalament 2',
    heading3: 'Encapçalament 3',
    heading4: 'Encapçalament 4',
    heading5: 'Encapçalament 5',
    heading6: 'Encapçalament 6',
    paragraph: 'Paràgraf',
    code: 'Codi',
    size1: 'Molt petit',
    size2: 'Petit',
    size3: 'Normal',
    size4: 'Mitjà',
    size5: 'Gran',
    size6: 'Molt gran',
    size7: 'Màxim',
    defaultFont: 'Font per defecte',
    viewSource: 'Veure font'
  },
  tree: {
    noNodes: 'No hi ha nodes disponibles',
    noResults: 'No s\'han trobat nodes'
  }
}
