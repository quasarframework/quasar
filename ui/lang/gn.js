export default {
  isoName: 'gn',
  nativeName: 'Avañe\'ẽ',
  label: {
    clear: 'Mbogue',
    ok: 'OĨma',
    cancel: 'Cancelar',
    close: 'Mboty',
    set: 'Mohenda',
    select: 'Poravo',
    reset: 'MoĨ jey',
    remove: 'Juka',
    update: 'Actualisa',
    create: 'Japo',
    search: 'Heka',
    filter: 'Mbogua',
    refresh: 'Actualisa'
  },
  date: {
    days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'ára'
  },
  table: {
    noData: 'Ni peteĨ mba\'e',
    noResults: 'Ni peteĨ resultado',
    loading: 'Era\'arõ...',
    selectedRecords: function (rows) {
      return rows > 1
        ? rows + ' fila selesionada.'
        : (rows === 0 ? 'Sin' : '1') + ' fila selesionada.'
    },
    recordsPerPage: 'Fila por páhina:',
    allRows: 'Entero',
    pagination: function (start, end, total) {
      return start + '-' + end + ' de ' + total
    },
    columns: 'Columnakuéra'
  },
  editor: {
    url: 'URL',
    bold: 'Negrita',
    italic: 'Kursíva',
    strikethrough: 'Tachado',
    underline: 'Subrayado',
    unorderedList: 'Lista Desordenada',
    orderedList: 'Lista Ordenada',
    subscript: 'Subíndice',
    superscript: 'Superíndice',
    hyperlink: 'Hipervínculo',
    toggleFullscreen: 'Pantalla kompléta',
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
    viewSource: 'View Source'
  },
  tree: {
    noNodes: 'Sin nodos disponibles',
    noResults: 'No se encontraron nodos correspondientes'
  }
}
