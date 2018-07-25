export default {
  lang: 'ko-kr',
  label: {
    clear: '초기화',
    ok: '확인',
    cancel: '취소',
    close: '닫기',
    set: '설정',
    select: '선택',
    reset: '초기화',
    remove: '삭제',
    update: '업데이트',
    create: '생성',
    search: '검색',
    filter: '필터',
    refresh: '새로 고침'
  },
  date: {
    days: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
    daysShort: '일_월_화_수_목_금_토'.split('_'),
    months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false
  },
  pullToRefresh: {
    pull: '당겨서 새로 고침',
    release: '놓아서 새로 고침',
    refresh: '새로 고치는 중...'
  },
  table: {
    noData: '데이터가 없습니다.',
    noResults: '결과가 없습니다.',
    loading: '로드 중...',
    selectedRecords: function (rows) {
      return rows > 0
        ? rows + ' 개가 선택 되었습니다.'
        : '선택된 항목이 없습니다.'
    },
    recordsPerPage: '페이지 당 개수:',
    allRows: '전체',
    pagination: function (start, end, total) {
      return total + ' 중 ' + start + '-' + end
    },
    columns: '열'
  },
  editor: {
    url: 'URL',
    bold: '굵게',
    italic: '이탤릭',
    strikethrough: '취소선',
    underline: '밑줄',
    unorderedList: '정렬되지 않은 목록',
    orderedList: '순서 목록',
    subscript: '아래 첨자',
    superscript: '위 첨자',
    hyperlink: '링크',
    toggleFullscreen: '전체 화면',
    quote: '따옴표',
    left: '왼쪽 정렬',
    center: '가운데 정렬',
    right: '오른쪽 정렬',
    justify: '정렬',
    print: '출력',
    outdent: '들여 쓰기 감소',
    indent: '들여 쓰기 증가',
    removeFormat: '포맷팅 제거',
    formatting: '포맷팅',
    fontSize: '폰트 크기',
    align: '정렬',
    hr: '가로 룰 삽입',
    undo: '되돌리기',
    redo: '다시 하기',
    header1: '헤더 1',
    header2: '헤더 2',
    header3: '헤더 3',
    header4: '헤더 4',
    header5: '헤더 5',
    header6: '헤더 6',
    paragraph: '절',
    code: '코드',
    size1: '아주 작음',
    size2: '작음',
    size3: '보통',
    size4: '약간 크게',
    size5: '크게',
    size6: '아주 크게',
    size7: '최대',
    defaultFont: '기본 폰트'
  },
  tree: {
    noNodes: '가능한 항목이 없습니다',
    noResults: '항목을 찾을 수 없습니다'
  }
}
