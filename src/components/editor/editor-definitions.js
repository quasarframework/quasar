export const buttons = {
  // toggle
  bold: {cmd: 'bold', icon: 'format_bold', tip: 'Bold', key: 66},
  italic: {cmd: 'italic', icon: 'format_italic', tip: 'Italic', key: 73},
  strike: {cmd: 'strikeThrough', icon: 'strikethrough_s', tip: 'Strikethrough', key: 83},
  underline: {cmd: 'underline', icon: 'format_underlined', tip: 'Underline', key: 85},
  unordered: {cmd: 'insertUnorderedList', icon: 'format_list_bulleted', tip: 'Unordered List'},
  ordered: {cmd: 'insertOrderedList', icon: 'format_list_numbered', tip: 'Ordered List'},
  subscript: {cmd: 'subscript', icon: 'vertical_align_bottom', tip: 'Subscript', htmlTip: 'x<subscript>2</subscript>'},
  superscript: {cmd: 'superscript', icon: 'vertical_align_top', tip: 'Superscript', htmlTip: 'x<superscript>2</superscript>'},
  link: {cmd: 'link', icon: 'link', tip: 'Hyperlink', key: 76},
  fullscreen: {cmd: 'fullscreen', icon: 'fullscreen', tip: 'Toggle Fullscreen', key: 70},

  quote: {cmd: 'formatBlock', param: 'BLOCKQUOTE', icon: 'format_quote', tip: 'Quote', key: 81},
  left: {cmd: 'justifyLeft', icon: 'format_align_left', tip: 'Left align'},
  center: {cmd: 'justifyCenter', icon: 'format_align_center', tip: 'Center align'},
  right: {cmd: 'justifyRight', icon: 'format_align_right', tip: 'Right align'},
  justify: {cmd: 'justifyFull', icon: 'format_align_justify', tip: 'Justify align'},

  print: {type: 'no-state', cmd: 'print', icon: 'print', tip: 'Print', key: 80},
  outdent: {type: 'no-state', disable: vm => vm.caret && !vm.caret.can('outdent'), cmd: 'outdent', icon: 'format_indent_decrease', tip: 'Decrease indentation'},
  indent: {type: 'no-state', disable: vm => vm.caret && !vm.caret.can('indent'), cmd: 'indent', icon: 'format_indent_increase', tip: 'Increase indentation'},
  removeFormat: {type: 'no-state', cmd: 'removeFormat', icon: 'format_clear', tip: 'Remove formatting'},
  hr: {type: 'no-state', cmd: 'insertHorizontalRule', icon: 'remove', tip: 'Insert Horizontal Rule'},
  undo: {type: 'no-state', cmd: 'undo', icon: 'undo', tip: 'Undo', key: 90},
  redo: {type: 'no-state', cmd: 'redo', icon: 'redo', tip: 'Redo', key: 89},

  h1: {cmd: 'formatBlock', param: 'H1', icon: 'format_size', tip: 'Header 1', htmlTip: '<h1>Header 1</h1>'},
  h2: {cmd: 'formatBlock', param: 'H2', icon: 'format_size', tip: 'Header 2', htmlTip: '<h2>Header 2</h2>'},
  h3: {cmd: 'formatBlock', param: 'H3', icon: 'format_size', tip: 'Header 3', htmlTip: '<h3>Header 3</h3>'},
  h4: {cmd: 'formatBlock', param: 'H4', icon: 'format_size', tip: 'Header 4', htmlTip: '<h4>Header 4</h4>'},
  h5: {cmd: 'formatBlock', param: 'H5', icon: 'format_size', tip: 'Header 5', htmlTip: '<h5>Header 5</h5>'},
  h6: {cmd: 'formatBlock', param: 'H6', icon: 'format_size', tip: 'Header 6', htmlTip: '<h6>Header 6</h6>'},
  p: {cmd: 'formatBlock', param: 'DIV', icon: 'format_size', tip: 'Paragraph'},
  code: {cmd: 'formatBlock', param: 'PRE', icon: 'code', tip: '<code>Code</code>'},

  'size-1': {cmd: 'fontSize', param: '1', icon: 'filter_1', tip: 'Very small', htmlTip: '<font size="1">Very small</font>'},
  'size-2': {cmd: 'fontSize', param: '2', icon: 'filter_2', tip: 'A bit small', htmlTip: '<font size="2">A bit small</font>'},
  'size-3': {cmd: 'fontSize', param: '3', icon: 'filter_3', tip: 'Normal', htmlTip: '<font size="3">Normal</font>'},
  'size-4': {cmd: 'fontSize', param: '4', icon: 'filter_4', tip: 'Medium-large', htmlTip: '<font size="4">Medium-large</font>'},
  'size-5': {cmd: 'fontSize', param: '5', icon: 'filter_5', tip: 'Big', htmlTip: '<font size="5">Big</font>'},
  'size-6': {cmd: 'fontSize', param: '6', icon: 'filter_6', tip: 'Very big', htmlTip: '<font size="6">Very big</font>'},
  'size-7': {cmd: 'fontSize', param: '7', icon: 'filter_7', tip: 'Maximum', htmlTip: '<font size="7">Maximum</font>'}
}
