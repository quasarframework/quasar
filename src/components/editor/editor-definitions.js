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

  quote: {type: 'toggle', test: 'BLOCKQUOTE', cmd: 'formatBlock', param: 'BLOCKQUOTE', icon: 'format_quote', tip: 'Quote', key: 81},
  left: {type: 'toggle', cmd: 'justifyLeft', icon: 'format_align_left', tip: 'Align to left'},
  center: {type: 'toggle', cmd: 'justifyCenter', icon: 'format_align_center', tip: 'Align to center'},
  right: {type: 'toggle', cmd: 'justifyRight', icon: 'format_align_right', tip: 'Align to right'},
  justify: {type: 'toggle', cmd: 'justifyFull', icon: 'format_align_justify', tip: 'Justify'},

  // execute
  outdent: {type: 'execute', disable: vm => vm.caret && !vm.caret.can('outdent'), cmd: 'outdent', icon: 'format_indent_decrease', tip: 'Decrease indentation'},
  indent: {type: 'execute', disable: vm => vm.caret && !vm.caret.can('indent'), cmd: 'indent', icon: 'format_indent_increase', tip: 'Increase indentation'},
  highlight: {type: 'execute', cmd: 'hiliteColor', param: '#D4FF00', icon: 'format_color_text', tip: 'Highlight'}, // no IE
  removeFormat: {type: 'execute', cmd: 'removeFormat', icon: 'format_clear', tip: 'Remove formatting'},
  hr: {type: 'execute', cmd: 'insertHorizontalRule', icon: 'remove', tip: 'Horizontal line'},
  undo: {type: 'execute', cmd: 'undo', icon: 'undo', tip: 'Undo', key: 90},
  redo: {type: 'execute', cmd: 'redo', icon: 'redo', tip: 'Redo', key: 89},

  h1: {type: 'toggle', test: 'H1', cmd: 'formatBlock', param: 'H1', icon: 'format_size', tip: 'Heading H1'},
  h2: {type: 'toggle', test: 'H2', cmd: 'formatBlock', param: 'H2', icon: 'format_size', tip: 'Heading H2'},
  h3: {type: 'toggle', test: 'H3', cmd: 'formatBlock', param: 'H3', icon: 'format_size', tip: 'Heading H3'},
  h4: {type: 'toggle', test: 'H4', cmd: 'formatBlock', param: 'H4', icon: 'format_size', tip: 'Heading H4'},
  h5: {type: 'toggle', test: 'H5', cmd: 'formatBlock', param: 'H5', icon: 'format_size', tip: 'Heading H5'},
  h6: {type: 'toggle', test: 'H6', cmd: 'formatBlock', param: 'H6', icon: 'format_size', tip: 'Heading H6'},
  paragraph: {type: 'toggle', test: 'DIV', cmd: 'formatBlock', param: 'DIV', icon: 'format_size', tip: 'Paragraph'}

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
