export default {
  isoName: 'el',
  nativeName: 'ελληνικά',
  label: {
    clear: 'Καθαρισμός',
    ok: 'Εντάξει',
    cancel: 'Ακύρωση',
    close: 'Κλείσιμο',
    set: 'Ορισμός',
    select: 'Επιλογή',
    reset: 'Επαναφορά',
    remove: 'Αφαίρεση',
    update: 'Αναβάθμιση',
    create: 'Δημιουργία',
    search: 'Αναζήτηση',
    filter: 'Φίλτρο',
    refresh: 'Ανανέωση'
  },
  date: {
    days: 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
    daysShort: 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
    months: 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
    monthsShort: 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'ημέρες'
  },
  table: {
    noData: 'Χωρίς δεδομένα',
    noResults: 'Δεν βρέθηκαν αποτελέσματα',
    loading: 'Φόρτωση...',
    selectedRecords: rows => (
      rows === 1
        ? '1 επιλεγμένη εγγραφή.'
        : (rows === 0 ? 'Καμμία' : rows) + ' επιλεγμένες εγγραφές.'
    ),
    recordsPerPage: 'Εγγραφές ανα σελίδα:',
    allRows: 'Όλες',
    pagination: (start, end, total) => start + '-' + end + ' από ' + total,
    columns: 'Στήλες'
  },
  editor: {
    url: 'Διεύθυνση URL', // Needs Translation
    bold: 'Έντονα',
    italic: 'Πλάγια',
    strikethrough: 'Διακριτή διαγραφή',
    underline: 'Υπογράμμιση',
    unorderedList: 'Αταξινόμητη λίστα',
    orderedList: 'Ταξινομημένη λίστα',
    subscript: 'Δείκτης',
    superscript: 'Εκθέτης',
    hyperlink: 'Υπερσύνδεσμος',
    toggleFullscreen: 'Εναλλαγή μεγιστοποίησης οθόνης',
    quote: 'Παράθεση',
    left: 'Αριστερή στοίχιση',
    center: 'Κεντρική στοίχιση',
    right: 'Δεξιά στοίχιση',
    justify: 'Πλήρης στοίχιση',
    print: 'Εκτύπωση',
    outdent: 'Μείωση εσοχής',
    indent: 'Αύξηση εσοχής',
    removeFormat: 'Απαλοιφή μορφοποίησης',
    formatting: 'Μορφοποίηση',
    fontSize: 'Μέγεθος γραμματοσειράς',
    align: 'Στοίχιση',
    hr: 'Εισαγωγή οριζόντιας γραμμής',
    undo: 'Αναίρεση',
    redo: 'Επανάληψη',
    heading1: 'Επικεφαλίδα 1',
    heading2: 'Επικεφαλίδα 2',
    heading3: 'Επικεφαλίδα 3',
    heading4: 'Επικεφαλίδα 4',
    heading5: 'Επικεφαλίδα 5',
    heading6: 'Επικεφαλίδα 6',
    paragraph: 'Παράγραφος',
    code: 'Κώδικας',
    size1: 'Πολύ μικρό',
    size2: 'Μικρό',
    size3: 'Κανονικό',
    size4: 'Μεσαίο',
    size5: 'Μεγάλο',
    size6: 'Πολύ μεγάλο',
    size7: 'Μέγιστο',
    defaultFont: 'Προκαθορισμένη γραμματοσειρά',
    viewSource: 'Προβολή προέλευσης'
  },
  tree: {
    noNodes: 'Μη διαθέσιμοι κόμβοι',
    noResults: 'Δεν βρέθηκαν αποτελέσματα'
  }
}
