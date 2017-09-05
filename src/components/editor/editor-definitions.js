export const buttons = {
  // toggle
  bold: {type: 'toggle', cmd: 'bold', icon: 'format_bold', tip: 'Bold', key: 66},
  italic: {type: 'toggle', cmd: 'italic', icon: 'format_italic', tip: 'Italic', key: 73},
  strike: {type: 'toggle', cmd: 'strikeThrough', icon: 'strikethrough_s', tip: 'Strikethrough', key: 83},
  underline: {type: 'toggle', cmd: 'underline', icon: 'format_underlined', tip: 'Underline', key: 85},
  bullet: {type: 'toggle', cmd: 'insertUnorderedList', icon: 'format_list_bulleted', tip: 'Bullet style list'},
  number: {type: 'toggle', cmd: 'insertOrderedList', icon: 'format_list_numbered', tip: 'Numbered style list'},
  subscript: {type: 'toggle', cmd: 'subscript', icon: 'vertical_align_bottom', tip: 'Subscript'},
  superscript: {type: 'toggle', cmd: 'superscript', icon: 'vertical_align_top', tip: 'Superscript'},
  link: {type: 'toggle', cmd: 'link', icon: 'link', tip: 'Link', key: 76},

  quote: {type: 'toggle', test: 'BLOCKQUOTE', cmd: 'formatBlock', param: 'BLOCKQUOTE', icon: 'format_quote', tip: 'Quote', key: 81},
  left: {type: 'toggle', cmd: 'justifyLeft', icon: 'format_align_left', tip: 'Align to left'},
  center: {type: 'toggle', cmd: 'justifyCenter', icon: 'format_align_center', tip: 'Align to center'},
  right: {type: 'toggle', cmd: 'justifyRight', icon: 'format_align_right', tip: 'Align to right'},
  justify: {type: 'toggle', cmd: 'justifyFull', icon: 'format_align_justify', tip: 'Justify'},

  // run
  print: {type: 'run', cmd: 'print', icon: 'print', tip: 'Print'},
  outdent: {type: 'run', disable: vm => vm.caret && !vm.caret.can('outdent'), cmd: 'outdent', icon: 'format_indent_decrease', tip: 'Decrease indentation'},
  indent: {type: 'run', disable: vm => vm.caret && !vm.caret.can('indent'), cmd: 'indent', icon: 'format_indent_increase', tip: 'Increase indentation'},
  highlight: {type: 'run', cmd: 'hiliteColor', param: '#D4FF00', icon: 'format_color_text', tip: 'Highlight'}, // no IE
  removeFormat: {type: 'run', cmd: 'removeFormat', icon: 'format_clear', tip: 'Remove formatting'},
  hr: {type: 'run', cmd: 'insertHorizontalRule', icon: 'remove', tip: 'Horizontal line'},
  undo: {type: 'run', cmd: 'undo', icon: 'undo', tip: 'Undo', key: 90},
  redo: {type: 'run', cmd: 'redo', icon: 'redo', tip: 'Redo', key: 89},

  h1: {type: 'toggle', cmd: 'formatBlock', param: 'H1', icon: 'format_size', tip: 'Title H1'},
  h2: {type: 'toggle', cmd: 'formatBlock', param: 'H2', icon: 'format_size', tip: 'Title H2'},
  h3: {type: 'toggle', cmd: 'formatBlock', param: 'H3', icon: 'format_size', tip: 'Title H3'},
  h4: {type: 'toggle', cmd: 'formatBlock', param: 'H4', icon: 'format_size', tip: 'Title H4'},
  h5: {type: 'toggle', cmd: 'formatBlock', param: 'H5', icon: 'format_size', tip: 'Title H5'},
  h6: {type: 'toggle', cmd: 'formatBlock', param: 'H6', icon: 'format_size', tip: 'Title H6'},
  p: {type: 'toggle', cmd: 'formatBlock', param: 'DIV', icon: 'format_size', tip: 'Paragraph'},
  code: {type: 'toggle', cmd: 'formatBlock', param: 'PRE', icon: 'code', tip: 'Code'},

  'size-1': {type: 'toggle', cmd: 'fontSize', param: '1', icon: 'filter_1', tip: 'Very small'},
  'size-2': {type: 'toggle', cmd: 'fontSize', param: '2', icon: 'filter_2', tip: 'A bit small'},
  'size-3': {type: 'toggle', cmd: 'fontSize', param: '3', icon: 'filter_3', tip: 'Normal'},
  'size-4': {type: 'toggle', cmd: 'fontSize', param: '4', icon: 'filter_4', tip: 'Medium-large'},
  'size-5': {type: 'toggle', cmd: 'fontSize', param: '5', icon: 'filter_5', tip: 'Big'},
  'size-6': {type: 'toggle', cmd: 'fontSize', param: '6', icon: 'filter_6', tip: 'Very big'},
  'size-7': {type: 'toggle', cmd: 'fontSize', param: '7', icon: 'filter_7', tip: 'Maximum'}

  /*
  link: {cmd: 'link', icon: 'link', tip: 'Link', key: 76},

  font_arial: {cmd: 'fontname', param: 'Arial', icon: 'font_download', tip: 'Arial'},
  font_arial_black: {cmd: 'fontname', param: 'Arial Black', icon: 'font_download', tip: 'Arial Black'},
  font_courier_new: {cmd: 'fontname', param: 'Courier New', icon: 'font_download', tip: 'Courier New'},
  font_times_new_roman: {cmd: 'fontname', param: 'Times New Roman', icon: 'font_download', tip: 'Times New Roman'},

  div: {cmd: 'formatBlock', param: 'DIV', icon: 'format_size', tip: 'DIV'},

  heading: {cmd: 'heading', icon: 'format_size', tip: 'Heading', key: 72},
  */
}
