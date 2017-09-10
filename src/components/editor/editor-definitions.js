export const buttons = {
  // toggle
  bold: {cmd: 'bold', icon: 'format_bold', tip: 'Bold', key: 66},
  italic: {cmd: 'italic', icon: 'format_italic', tip: 'Italic', key: 73},
  strike: {cmd: 'strikeThrough', icon: 'strikethrough_s', tip: 'Strikethrough', key: 83},
  underline: {cmd: 'underline', icon: 'format_underlined', tip: 'Underline', key: 85},
  unordered: {cmd: 'insertUnorderedList', icon: 'format_list_bulleted', tip: 'Unordered List'},
  ordered: {cmd: 'insertOrderedList', icon: 'format_list_numbered', tip: 'Ordered List'},
  subscript: {cmd: 'subscript', icon: 'vertical_align_bottom', tip: 'Subscript'},
  superscript: {cmd: 'superscript', icon: 'vertical_align_top', tip: 'Superscript'},
  link: {cmd: 'link', icon: 'link', tip: 'Hyperlink', key: 76},

  quote: {cmd: 'formatBlock', param: 'BLOCKQUOTE', icon: 'format_quote', tip: 'Quote', key: 81},
  left: {cmd: 'justifyLeft', icon: 'format_align_left', tip: 'Left align'},
  center: {cmd: 'justifyCenter', icon: 'format_align_center', tip: 'Center align'},
  right: {cmd: 'justifyRight', icon: 'format_align_right', tip: 'Right align'},
  justify: {cmd: 'justifyFull', icon: 'format_align_justify', tip: 'Justify align'},

  print: {type: 'no-state', cmd: 'print', icon: 'print', tip: 'Print'},
  outdent: {type: 'no-state', disable: vm => vm.caret && !vm.caret.can('outdent'), cmd: 'outdent', icon: 'format_indent_decrease', tip: 'Decrease indentation'},
  indent: {type: 'no-state', disable: vm => vm.caret && !vm.caret.can('indent'), cmd: 'indent', icon: 'format_indent_increase', tip: 'Increase indentation'},
  highlight: {type: 'no-state', cmd: 'hiliteColor', param: '#D4FF00', icon: 'format_color_text', tip: 'Highlight'}, // no IE
  removeFormat: {type: 'no-state', cmd: 'removeFormat', icon: 'format_clear', tip: 'Remove formatting'},
  hr: {type: 'no-state', cmd: 'insertHorizontalRule', icon: 'remove', tip: 'Insert Horizontal Rule'},
  undo: {type: 'no-state', cmd: 'undo', icon: 'undo', tip: 'Undo', key: 90},
  redo: {type: 'no-state', cmd: 'redo', icon: 'redo', tip: 'Redo', key: 89},

  h1: {cmd: 'formatBlock', param: 'H1', icon: 'format_size', tip: 'Title H1'},
  h2: {cmd: 'formatBlock', param: 'H2', icon: 'format_size', tip: 'Title H2'},
  h3: {cmd: 'formatBlock', param: 'H3', icon: 'format_size', tip: 'Title H3'},
  h4: {cmd: 'formatBlock', param: 'H4', icon: 'format_size', tip: 'Title H4'},
  h5: {cmd: 'formatBlock', param: 'H5', icon: 'format_size', tip: 'Title H5'},
  h6: {cmd: 'formatBlock', param: 'H6', icon: 'format_size', tip: 'Title H6'},
  p: {cmd: 'formatBlock', param: 'DIV', icon: 'format_size', tip: 'Paragraph'},
  code: {cmd: 'formatBlock', param: 'PRE', icon: 'code', tip: 'Code'},

  'size-1': {cmd: 'fontSize', param: '1', icon: 'looks_one', tip: 'Very small'},
  'size-2': {cmd: 'fontSize', param: '2', icon: 'looks_two', tip: 'A bit small'},
  'size-3': {cmd: 'fontSize', param: '3', icon: 'looks_3', tip: 'Normal'},
  'size-4': {cmd: 'fontSize', param: '4', icon: 'looks_4', tip: 'Medium-large'},
  'size-5': {cmd: 'fontSize', param: '5', icon: 'looks_5', tip: 'Big'},
  'size-6': {cmd: 'fontSize', param: '6', icon: 'looks_6', tip: 'Very big'},
  'size-7': {cmd: 'fontSize', param: '7', icon: 'looks_7', tip: 'Maximum'}
}
