export default {
  isoName: 'ro',
  nativeName: 'Română',
  label: {
    clear: 'Golește',
    ok: 'OK',
    cancel: 'Anulează',
    close: 'Închide',
    set: 'Setează',
    select: 'Alege',
    reset: 'Resetează',
    remove: 'Elimină',
    update: 'Actualizează',
    create: 'Creează',
    search: 'Caută',
    filter: 'Filtrează',
    refresh: 'Actualizează'
  },
  date: {
    days: 'Duminică_Luni_Marți_Miercuri_Joi_Vineri_Sâmbătă'.split('_'),
    daysShort: 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
    months: 'Ianuarie_Februarie_Martie_Aprilie_Mai_Iunie_Iulie_August_Septembrie_Octombrie_Noiembrie_Decembrie'.split('_'),
    monthsShort: 'Ian_Feb_Mar_Apr_Mai_Iun_Iul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'zile'
  },
  table: {
    noData: 'Nu sunt date disponibile',
    noResults: 'Nu am găsit înregistrări care să corespundă',
    loading: 'Se încarcă...',
    selectedRecords: rows => (
      rows > 1
        ? rows + ' înregistrări selectate.'
        : (rows === 0 ? 'Nici o' : '1') + ' înregistrare selectată.'
    ),
    recordsPerPage: 'Înregistrări pe pagină:',
    allRows: 'Toate',
    pagination: (start, end, total) => start + '-' + end + ' din ' + total,
    columns: 'Coloane'
  },
  editor: {
    url: 'URL',
    bold: 'Îngroșat',
    italic: 'Înclinat',
    strikethrough: 'Tăiat',
    underline: 'Subliniat',
    unorderedList: 'Listă neordonată',
    orderedList: 'Listă ordonată',
    subscript: 'Dedesubt',
    superscript: 'Deasupra',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'Comută ecran complet',
    quote: 'Citat',
    left: 'Aliniere la stânga',
    center: 'Aliniere la centru',
    right: 'Aliniere la dreapta',
    justify: 'Aliniere totală',
    print: 'Tipărește',
    outdent: 'Scade spațierea',
    indent: 'Crește spațierea',
    removeFormat: 'Îndepărtează formatările',
    formatting: 'Formatare',
    fontSize: 'Mărime font',
    align: 'Aliniază',
    hr: 'Adaugă linie orizontală',
    undo: 'Schimbă inapoi',
    redo: 'Refă',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    paragraph: 'Paragraf',
    code: 'Cod',
    size1: 'Foarte mic',
    size2: 'Mic',
    size3: 'Normal',
    size4: 'Mediu-mare',
    size5: 'Big',
    size6: 'Foarte mare',
    size7: 'Maxim',
    defaultFont: 'Font implicit',
    viewSource: 'Vizualizare sursă'
  },
  tree: {
    noNodes: 'Nu sunt date disponibile',
    noResults: 'Nu am găsit noduri care să corespundă'
  }
}
