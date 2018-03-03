export default {
  lang: 'el',
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
    format24h: true
  },
  pullToRefresh: {
    pull: 'Τράβηξε κάτω για ανανέωση',
    release: 'Ελευθέρωσε για ανανέωση',
    refresh: 'Ανανέωση...'
  },
  table: {
    noData: 'Χωρίς δεδομένα',
    noResults: 'Δεν βρέθηκαν αποτελέσματα',
    loading: 'Φόρτωση...',
    selectedRows: function (rows) {
      return rows === 1
        ? '1 Επιλεγμένη εγγραφή.'
        : (rows === 0 ? 'Καμμία' : rows) + ' Επιλεγμένες Εγγραφές.'
    },
    rowsPerPage: 'Εγγραφές ανα σελίδα:',
    allRows: 'Όλες',
    pagination: function (start, end, total) {
      return start + '-' + end + ' of ' + total
    },
    columns: 'Στήλες'
  },
  editor: {
    url: 'URL', // Needs Translation
    bold: 'Έντονα',
    italic: 'Πλάγια',
    strikethrough: 'Διακριτή διαγραφή',
    underline: 'Υπογράμμιση',
    unorderedList: 'Αταξινόμητη λίστα',
    orderedList: 'Ταξινομημένη λίστα',
    subscript: 'Δείκτης',
    superscript: 'Εκθέτης',
    hyperlink: 'υπερσύνδεση',
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
    header1: 'Επικεφαλίδα 1',
    header2: 'Επικεφαλίδα 2',
    header3: 'Επικεφαλίδα 3',
    header4: 'Επικεφαλίδα 4',
    header5: 'Επικεφαλίδα 5',
    header6: 'Επικεφαλίδα 6',
    paragraph: 'Παράγραφος',
    code: 'Κώδικας',
    size1: 'Πολύ μικρό',
    size2: 'Μικρό',
    size3: 'Κανονικό',
    size4: 'Μεσαίο',
    size5: 'Μεγάλο',
    size6: 'Πολύ μεγάλο',
    size7: 'Μέγιστο',
    defaultFont: 'Προκαθορισμένη Γραμματοσειρά'
  },
  tree: {
    noNodes: 'Μη διαθέσιμοι κόμβοι',
    noResults: 'Δεν βρέθηκαν αποτελέσματα'
  }
}
