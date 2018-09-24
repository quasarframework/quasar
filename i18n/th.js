export default {
  lang: 'th',
  label: {
    clear: 'ล้าง',
    ok: 'ตกลง',
    cancel: 'ยกเลิก',
    close: 'ปิด',
    set: 'ตั้งค่า',
    select: 'เลือก',
    reset: 'ตั้งใหม่',
    remove: 'ลบ',
    update: 'ปรับปรุง',
    create: 'สร้าง',
    search: 'ค้นหา',
    filter: 'กรอง',
    refresh: 'รีเฟรช'
  },
  date: {
    days: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
    daysShort: 'อา._จ._อ._พ._พฤ_.ศ._ส.'.split('_'),
    months: 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
    monthsShort: 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true
  },
  pullToRefresh: {
    pull: 'ดึงลงเพื่อรีเฟรช',
    release: 'ปล่อยเพื่อรีเฟรช',
    refresh: 'กำลังรีเฟรช...'
  },
  table: {
    noData: 'ไม่มีข้อมูล',
    noResults: 'ไม่มีผลลัพธ์',
    loading: 'กำลังโหลด...',
    selectedRecords: function (rows) {
      return rows > 0
        ? 'เลือกทั้งหมด ' + rows + ' แถว'
        : 'ไม่มีแถวที่ถูกเลือก'
    },
    recordsPerPage: 'แถวต่อหน้า:',
    allRows: 'แถวทั้งหมด',
    pagination: function (start, end, total) {
      return start + '-' + end + ' of ' + total
    },
    columns: 'คอลัมน์'
  },
  editor: {
    url: 'URL',
    bold: 'ตัวหนา',
    italic: 'ตัวเอียง',
    strikethrough: 'เส้นคร่อม',
    underline: 'เส้นใต้',
    unorderedList: 'รายการ',
    orderedList: 'ลำดับรายการ',
    subscript: 'ตัวห้อย',
    superscript: 'ตัวยก',
    hyperlink: 'ไฮเปอร์ลิงค์',
    toggleFullscreen: 'สลับเต็มจอ',
    quote: 'อ้างอิง',
    left: 'ชิดซ้าย',
    center: 'แนวกลาง',
    right: 'ชิดขวา',
    justify: 'ชิดขอบ',
    print: 'พิมพ์',
    outdent: 'ลดย่อหน้า',
    indent: 'เพิ่มย่อหน้า',
    removeFormat: 'ล้างรูปแบบ',
    formatting: 'จัดรูปแบบ',
    fontSize: 'ขนาดอักษร',
    align: 'แนว',
    hr: 'เพิ่มเส้นขั้นบรรทัด',
    undo: 'ยกเลิก',
    redo: 'ทำซ้ำ',
    header1: 'หัวข้อ 1',
    header2: 'หัวข้อ 2',
    header3: 'หัวข้อ 3',
    header4: 'หัวข้อ 4',
    header5: 'หัวข้อ 5',
    header6: 'หัวข้อ 6',
    paragraph: 'ย่อหน้า',
    code: 'โค้ด',
    size1: 'เล็กมาก',
    size2: 'เล็ก',
    size3: 'ปกติ',
    size4: 'ใหญ่กว่าปกติ',
    size5: 'ใหญ่',
    size6: 'ใหญ่มาก',
    size7: 'ใหญ่เต็มที่',
    defaultFont: 'ฟอนต์มาตรฐาน'
  },
  tree: {
    noNodes: 'ไม่มีโหนด',
    noResults: 'ไม่พบโหนดตามที่ระบุ'
  }
}
