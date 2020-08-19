export default {
  isoName: 'pt-br',
  nativeName: 'Português (BR)',
  label: {
    clear: 'Limpar',
    ok: 'OK',
    cancel: 'Cancelar',
    close: 'Fechar',
    set: 'Escolher',
    select: 'Selecionar',
    reset: 'Redefinir',
    remove: 'Remover',
    update: 'Atualizar',
    create: 'Criar',
    search: 'Buscar',
    filter: 'Filtrar',
    refresh: 'Recarregar'
  },
  date: {
    days: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
    daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
    monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dias'
  },
  table: {
    noData: 'Sem dados disponíveis',
    noResults: 'Nenhum dado correspondente encontrado',
    loading: 'Carregando...',
    selectedRecords: function (rows) {
      return rows > 0
        ? rows + ' registro' + (rows === 1 ? ' selecionado' : 's selecionados') + '.'
        : 'Nenhum registro selecionado.'
    },
    recordsPerPage: 'Registros por página:',
    allRows: 'Todos',
    pagination: function (start, end, total) {
      return start + '-' + end + ' de ' + total
    },
    columns: 'Colunas'
  },
  editor: {
    url: 'URL',
    bold: 'Negrito',
    italic: 'Itálico',
    strikethrough: 'Riscado',
    underline: 'Sublinhado',
    unorderedList: 'Lista não-ordenada',
    orderedList: 'Lista ordenada',
    subscript: 'Subscrito',
    superscript: 'Sobrescrito',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'Tela cheia',
    quote: 'Citação',
    left: 'Alinhado à esquerda',
    center: 'Alinhado ao centro',
    right: 'Alinhado à direita',
    justify: 'Justificado',
    print: 'Imprimir',
    outdent: 'Diminuir indentação',
    indent: 'Aumentar indentação',
    removeFormat: 'Remover formatação',
    formatting: 'Formatação',
    fontSize: 'Tamanho de fonte',
    align: 'Alinhar',
    hr: 'Inserir divisória horizontal',
    undo: 'Desfazer',
    redo: 'Refazer',
    heading1: 'Cabeçalho 1',
    heading2: 'Cabeçalho 2',
    heading3: 'Cabeçalho 3',
    heading4: 'Cabeçalho 4',
    heading5: 'Cabeçalho 5',
    heading6: 'Cabeçalho 6',
    paragraph: 'Parágrafo',
    code: 'Código',
    size1: 'Muito pequeno',
    size2: 'Pequeno',
    size3: 'Normal',
    size4: 'Médio',
    size5: 'Grande',
    size6: 'Enorme',
    size7: 'Máximo',
    defaultFont: 'Fonte padrão',
    viewSource: 'Exibir fonte'
  },
  tree: {
    noNodes: 'Sem nós disponíveis',
    noResults: 'Nenhum nó correspondente encontrado'
  }
}
