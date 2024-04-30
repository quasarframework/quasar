export default {
  isoName: 'hi',
  nativeName: 'अमेरिकी अंग्रेज़ी',
  label: {
    clear: 'स्पष्ट',
    ok: 'ठीक',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    set: 'सेट करें',
    select: 'चयन करें',
    reset: 'रीसेट करें',
    remove: 'हटाएँ',
    update: 'अपडेट करें',
    create: 'बनाएँ',
    search: 'खोजें',
    filter: 'फ़िल्टर करें',
    refresh: 'ताज़ा करें',
    expand: label => (label ? `"${ label }" का विस्तार करें` : 'विस्तार करें'),
    collapse: label => (label ? `"${ label }" को संकुचित करें` : 'संकुचित करें')
  },
  date: {
    days: 'रविवार_सोमवार_मंगलवार_बुधवार_गुरुवार_शुक्रवार_शनिवार'.split('_'),
    daysShort: 'रवि_सोम_मंगल_बुध_गुरु_शुक्र_शनि'.split('_'),
    months: 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितंबर_अक्तूबर_नवंबर_दिसंबर'.split('_'),
    monthsShort: 'जन_फ़र_मार्च_अप्रैल_मई_जून_जुलाई_अग_सितं_अक्तू_नवं_दिसं'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - रविवार, 1 - सोमवार, ...
    format24h: false,
    pluralDay: 'दिन'
  },
  table: {
    noData: 'कोई डेटा उपलब्ध नहीं है',
    noResults: 'कोई मिलते जुलते रिकॉर्ड नहीं मिले',
    loading: 'लोड हो रहा है...',
    selectedRecords: rows => (
      rows === 1
        ? '1 रिकॉर्ड चयनित।'
        : (rows === 0 ? 'कोई' : rows) + ' रिकॉर्ड चयनित।'
    ),
    recordsPerPage: 'प्रति पृष्ठ रिकॉर्ड:',
    allRows: 'सभी',
    pagination: (start, end, total) => start + '-' + end + ' कुल ' + total,
    columns: 'कॉलम'
  },
  editor: {
    url: 'URL',
    bold: 'बोल्ड',
    italic: 'इटैलिक',
    strikethrough: 'स्ट्राइकथ्रू',
    underline: 'रेखांकित',
    unorderedList: 'अव्यवस्थित सूची',
    orderedList: 'क्रमित सूची',
    subscript: 'निम्नलिखित',
    superscript: 'अधिलिखित',
    hyperlink: 'हाइपरलिंक',
    toggleFullscreen: 'पूर्णस्क्रीन टॉगल करें',
    quote: 'उद्धरण',
    left: 'बाईं तरफ',
    center: 'मध्य तरफ',
    right: 'दायं तरफ',
    justify: 'संरेखित',
    print: 'प्रिंट',
    outdent: 'प्रवृद्धि घटाएँ',
    indent: 'प्रवृद्धि करें',
    removeFormat: 'फ़ॉर्मैटिंग हटाएँ',
    formatting: 'फ़ॉर्मैटिंग',
    fontSize: 'फ़ॉन्ट आकार',
    align: 'एकीकरण',
    hr: 'क्षैतिज रेखा डालें',
    undo: 'पूर्ववत करें',
    redo: 'पुन: करें',
    heading1: 'शीर्षक 1',
    heading2: 'शीर्षक 2',
    heading3: 'शीर्षक 3',
    heading4: 'शीर्षक 4',
    heading5: 'शीर्षक 5',
    heading6: 'शीर्षक 6',
    paragraph: 'अनुच्छेद',
    code: 'कोड',
    size1: 'बहुत छोटा',
    size2: 'थोड़ा छोटा',
    size3: 'सामान्य',
    size4: 'मध्यम-बड़ा',
    size5: 'बड़ा',
    size6: 'बहुत बड़ा',
    size7: 'अधिकतम',
    defaultFont: 'डिफ़ॉल्ट फ़ॉन्ट',
    viewSource: 'स्रोत देखें'
  },
  tree: {
    noNodes: 'कोई नोड उपलब्ध नहीं है',
    noResults: 'कोई मिलते जुलते नोड नहीं मिले'
  }
}
