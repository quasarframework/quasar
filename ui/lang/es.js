export default {
  isoName: 'es',
  nativeName: 'Español',
  label: {
    clear: 'Borrar',
    ok: 'OK',
    cancel: 'Cancelar',
    close: 'Cerrar',
    set: 'Ezarri',
    select: 'Hautatu',
    reset: 'Berrezarri',
    remove: 'Ezabatu',
    update: 'Eguneratu',
    create: 'Sortu',
    search: 'Bilatu',
    filter: 'Iragazi',
    refresh: 'Eguneratu'
  },
  date: {
    days: 'Igandea_Astelehena_Astearte_Asteazkena_Osteguna_Ostirala_Larunbata'.split('_'),
    daysShort: 'Iga_Ast_Asr_Asz_Ost_Osr_Lar'.split('_'),
    months: 'Urtarrila_Otsaila_Martxoa_Apirila_Maiatza_Ekaina_Uztailea_Abuztua_Iraila_Urria_Azaroa_Abendua'.split('_'),
    monthsShort: 'Urt_Ots_Mar_Api_Mai_Eka_Uzt_Abu_Ira_Urr_Aza_Abe'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'egun'
  },
  table: {
    noData: 'Daturik ez',
    noResults: 'Ez da emaitzarik aurkitu',
    loading: 'Cargando...',
    selectedRecords: rows => (
      rows > 1
        ? rows + ' filas seleccionadas.'
        : (rows === 0 ? 'Sin' : '1') + ' fila seleccionada.'
    ),
    recordsPerPage: 'Filas por página:',
    allRows: 'Todas',
    pagination: (start, end, total) => start + '-' + end + ' de ' + total,
    columns: 'Columnas'
  },
  editor: {
    url: 'URL',
    bold: 'Negrita',
    italic: 'Itálico',
    strikethrough: 'Tachado',
    underline: 'Subrayado',
    unorderedList: 'Lista Desordenada',
    orderedList: 'Lista Ordenada',
    subscript: 'Subíndice',
    superscript: 'Superíndice',
    hyperlink: 'Hipervínculo',
    toggleFullscreen: 'Alternar pantalla completa',
    quote: 'Cita',
    left: 'Alineación izquierda',
    center: 'Alineación centro',
    right: 'Alineación derecha',
    justify: 'Justificar alineación',
    print: 'Imprimir',
    outdent: 'Disminuir indentación',
    indent: 'Aumentar indentación',
    removeFormat: 'Eliminar formato',
    formatting: 'Formato',
    fontSize: 'Tamaño de Fuente',
    align: 'Alinear',
    hr: 'Insertar línea horizontal',
    undo: 'Deshacer',
    redo: 'Rehacer',
    heading1: 'Encabezado 1',
    heading2: 'Encabezado 2',
    heading3: 'Encabezado 3',
    heading4: 'Encabezado 4',
    heading5: 'Encabezado 5',
    heading6: 'Encabezado 6',
    paragraph: 'Párrafo',
    code: 'Código',
    size1: 'Muy pequeño',
    size2: 'Pequeño',
    size3: 'Normal',
    size4: 'Mediano',
    size5: 'Grande',
    size6: 'Muy grande',
    size7: 'Máximo',
    defaultFont: 'Fuente por defecto',
    viewSource: 'Ver fuente'
  },
  tree: {
    noNodes: 'Sin nodos disponibles',
    noResults: 'No se encontraron nodos correspondientes'
  }
}
