export default {
  isoName: 'km',
  nativeName: 'ខ្មែរ',
  label: {
    clear: 'សម្អាត',
    ok: 'យល់ព្រម',
    cancel: 'បោះបង់',
    close: 'បិទ',
    set: 'កំណត់',
    select: 'ជ្រើសរើស',
    reset: 'កំណត់ឡើងវិញ',
    remove: 'លុប',
    update: 'កែប្រែ',
    create: 'បង្កើត',
    search: 'ស្វែងរក',
    filter: 'ច្រោះ',
    refresh: 'ធ្វើឲ្យថ្មី'
  },
  date: {
    days: 'អាទិត្យ_ចន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    daysShort: 'អទ_ចន_អង_ពុ_ព្រ_សុ_សរ'.split('_'),
    months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
    monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false
  },
  table: {
    noData: 'គ្មានទិន្ន័យ',
    noResults: 'គ្មានទិន្ន័យដូច',
    loading: 'កំពុងផ្ទេរទិន្នន័យ...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 ជួរដេកត្រូវបានជ្រើសរើស'
        : (rows === 0 ? 'មិនមាន' : rows) + ' ជួរដេកត្រូវបានជ្រើសរើស'
    },
    recordsPerPage: 'ជួរដេកក្នុងមួយទំព័រ:',
    allRows: 'ទាំងអស់',
    pagination: function (start, end, total) {
      return start + '-' + end + ' នៃ ' + total
    },
    columns: 'ជួរឈរ'
  },
  editor: {
    url: 'URL',
    bold: 'ដិត',
    italic: 'ទ្រេត',
    strikethrough: 'បន្ទាត់ឆ្នូតកណ្តាល',
    underline: 'បន្ទាត់ពីក្រោម',
    unorderedList: 'បញ្ជីគ្មានលំដាប់',
    orderedList: 'បញ្ជីមានលំដាប់',
    subscript: 'សន្ទស្សន៍ខាងក្រោម',
    superscript: 'សន្ទស្សន៍ខាងលើ',
    hyperlink: 'តំណភ្ជាប់',
    toggleFullscreen: 'ប្តូរអេក្រង់ពេញ',
    quote: 'សម្រង់',
    left: 'តម្រឹមឆ្វេង',
    center: 'តម្រឹមកណ្តាល',
    right: 'តម្រឹមស្តាំ',
    justify: 'តម្រឹមសងខាង',
    print: 'បោះពុម្ភ',
    outdent: 'បន្ថយចូលបន្ទាត់',
    indent: 'បន្ថែមចូលបន្ទាត់',
    removeFormat: 'លុបទ្រង់ទ្រាយ',
    formatting: 'ទ្រង់ទ្រាយ',
    fontSize: 'ទំហំអក្សរ',
    align: 'តម្រឹម',
    hr: 'បញ្ចូលបន្ទាត់ផ្តេក',
    undo: 'មិនធ្វើវិញ',
    redo: 'ធ្វើវិញ',
    heading1: 'ចំណងជើង 1',
    heading2: 'ចំណងជើង 2',
    heading3: 'ចំណងជើង 3',
    heading4: 'ចំណងជើង 4',
    heading5: 'ចំណងជើង 5',
    heading6: 'ចំណងជើង 6',
    paragraph: 'កថាខណ្ឌ',
    code: 'កូដ',
    size1: 'តូចណាស់',
    size2: 'តូចបន្តិច',
    size3: 'ធម្មតា',
    size4: 'ធំមធ្យម',
    size5: 'ធំ',
    size6: 'ធំណាស់',
    size7: 'អតិបរិមា',
    defaultFont: 'ពុម្ពអក្សរដើម',
    viewSource: 'មើលប្រភព។'
  },
  tree: {
    noNodes: 'គ្មានទិន្នន័យ',
    noResults: 'គ្មានទិន្ន័យដូច'
  }
}
