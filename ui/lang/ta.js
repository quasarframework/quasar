export default {
  isoName: 'ta',
  nativeName: 'தமிழ்',
  label: {
    clear: 'அகற்று',
    ok: 'சரி',
    cancel: 'ரத்து',
    close: 'மூடு',
    set: 'அமை',
    select: 'தேர்ந்தெடு',
    reset: 'மீட்டமை',
    remove: 'நீக்கு',
    update: 'மேம்படுத்து',
    create: 'உருவாக்கு',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    refresh: 'புதுப்பி'
  },
  date: {
    days: 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
    daysShort: 'ஞாயி_திங்_செவ்_புத_வியா_வெள்_சனி'.split('_'),
    months: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
    monthsShort: 'ஜன_பிப்_மார்_ஏப்_மே_ஜூன்_ஜூலை_ஆக_செப்_அக்_நவ_டிச'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false,
    pluralDay: 'நாட்கள்'
  },
  table: {
    noData: 'தரவு எதுவும் கிடைக்கவில்லை',
    noResults: 'பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை',
    loading: 'ஏற்றுகிறது...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 பதிவு தேர்ந்தெடுக்கப்பட்டது.'
        : (rows === 0 ? '0' : rows) + ' பதிவு தேர்ந்தெடுக்கப்பட்டது.'
    },
    recordsPerPage: 'ஒரு பக்கத்திற்கு பதிவுகள்:',
    allRows: 'அனைத்தும்',
    pagination: function (start, end, total) {
      return start + '-' + end + ' மொத்தம் ' + total
    },
    columns: 'பத்திகள்'
  },
  editor: {
    url: 'URL',
    bold: 'தடித்த',
    italic: 'சாய்ந்த',
    strikethrough: 'குறுக்குக்கோடு',
    underline: 'அடிக்கோடு',
    unorderedList: 'வரிசையற்ற பட்டியல்',
    orderedList: 'வரிசையுள்ள பட்டியல்',
    subscript: 'கீழ்க்குறியீடு',
    superscript: 'மேல்குறியீடு',
    hyperlink: 'மிகையிணைப்பு',
    toggleFullscreen: 'முழுத்திரை மாற்றம்',
    quote: 'மேற்கோள்',
    left: 'இடது சீரமை',
    center: 'மைய சீரமை',
    right: 'வலது சீரமை',
    justify: 'உள்ளடக்க சீரமை',
    print: 'அச்சு',
    outdent: 'உள்தள்ளலைக் குறைக்கவும்',
    indent: 'உள்தள்ளலை அதிகரிக்கவும்',
    removeFormat: 'வடிவமைப்பை அகற்று',
    formatting: 'வடிவமைப்பு',
    fontSize: 'எழுத்துரு அளவு',
    align: 'சீரமை',
    hr: 'படுக்கைவாட்டு கொடு',
    undo: 'செயல்தவிர்',
    redo: 'மீண்டும் செய்',
    heading1: 'தலைப்பு 1',
    heading2: 'தலைப்பு 2',
    heading3: 'தலைப்பு 3',
    heading4: 'தலைப்பு 4',
    heading5: 'தலைப்பு 5',
    heading6: 'தலைப்பு 6',
    paragraph: 'பத்தி',
    code: 'குறியீடு',
    size1: 'மிகவும் சிறியது',
    size2: 'சிறியது',
    size3: 'இயல்பான',
    size4: 'நடுத்தர பெரியது',
    size5: 'பெரியது',
    size6: 'மிகவும் பெரியது',
    size7: 'அதிகபட்ச',
    defaultFont: 'இயல்புநிலை எழுத்துரு',
    viewSource: 'மூலத்தை பார்'
  },
  tree: {
    noNodes: 'முனைகள் எதுவும் கிடைக்கவில்லை',
    noResults: 'பொருந்தும் முனைகள் எதுவும் கிடைக்கவில்லை'
  }
}
