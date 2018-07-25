export default {
  lang: 'vi',
  label: {
    clear: 'Xóa hết',
    ok: 'OK',
    cancel: 'Hủy',
    close: 'Đóng',
    set: 'Thiết đặt',
    select: 'Chọn',
    reset: 'Đặt lại',
    remove: 'Gỡ bỏ',
    update: 'Cập nhật',
    create: 'Tạo',
    search: 'Tìm kiếm',
    filter: 'Bộ lọc',
    refresh: 'Làm mới'
  },
  date: {
    days: 'Chủ Nhật_Thứ Hai_Thứ Ba_Thứ Tư_Thứ Năm_Thứ Sáu_Thứ Bảy'.split('_'),
    daysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    months: 'Tháng Một_Tháng Hai_Tháng Ba_Tháng Tư_Tháng Năm_Tháng Sáu_Tháng Bảy_Tháng Tám_Tháng Chín_Tháng Mười_Tháng Mười Một_Tháng Mười Hai'.split('_'),
    monthsShort: 'Th1_Th2_Th3_Th4_Th5_Th6_Th7_Th8_Th9_Th10_Th11_Th12'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false
  },
  pullToRefresh: {
    pull: 'Kéo xuống để làm mới',
    release: 'Thả ra để làm mới',
    refresh: 'Đang làm mới'
  },
  table: {
    noData: 'Không có dữ liệu',
    noResults: 'Không tìm thấy kết quả',
    loading: 'Đang tải',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 hàng đã chọn.'
        : (rows === 0 ? 'Không có hàng nào' : rows) + ' hàng đã chọn.'
    },
    recordsPerPage: 'Hàng trên mỗi trang:',
    allRows: 'Tất cả',
    pagination: function (start, end, total) {
      return start + '-' + end + ' của ' + total
    },
    columns: 'Cột'
  },
  editor: {
    url: 'URL',
    bold: 'Đậm',
    italic: 'Nghiêng',
    strikethrough: 'Gạch giữa',
    underline: 'Gạch dưới',
    unorderedList: 'Danh sách không theo thứ tự',
    orderedList: 'Danh sách theo thứ tự',
    subscript: 'Chỉ số dưới',
    superscript: 'Chỉ số trên',
    hyperlink: 'Liên kết',
    toggleFullscreen: 'Điều chỉnh chế độ toàn màn hình',
    quote: 'Trích dẫn',
    left: 'Căn trái',
    center: 'Căn giữa',
    right: 'Căn phải',
    justify: 'Căn đều 2 bên',
    print: 'In',
    outdent: 'Giảm lề',
    indent: 'Tăng lề',
    removeFormat: 'Xóa định dạng',
    formatting: 'Định dạng',
    fontSize: 'Kích cỡ phông',
    align: 'Căn chỉnh',
    hr: 'Chèn Quy Tắc Ngang',
    undo: 'Hoàn tác',
    redo: 'Làm lại',
    header1: 'Tiêu đề 1',
    header2: 'Tiêu đề 2',
    header3: 'Tiêu đề 3',
    header4: 'Tiêu đề 4',
    header5: 'Tiêu đề 5',
    header6: 'Tiêu đề 6',
    paragraph: 'Đoạn',
    code: 'Mã',
    size1: 'Rất nhỏ',
    size2: 'Nhỏ vừa',
    size3: 'Thường',
    size4: 'To vừa',
    size5: 'To',
    size6: 'Rất To',
    size7: 'Tối đa',
    defaultFont: 'Phông mặc định'
  },
  tree: {
    noNodes: 'Không có nốt nào có sẵn',
    noResults: 'Không tìm thấy các nốt'
  }
}
