'use strict';

var
  template = require('raw!./grid.html'),
  defaultRowsPerPage = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '15', value: 15},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100}
  ];

function getRowsPerPageOption(rowsPerPage) {
  if (defaultRowsPerPage.find(function(column) { return column.value === rowsPerPage; })) {
    return defaultRowsPerPage;
  }

  var options = defaultRowsPerPage.slice(0);

  options.unshift({
    label: '' + rowsPerPage,
    value: rowsPerPage
  });

  return options;
}

Vue.component('grid', {
  template: template,
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    rowsPerPage: {
      type: Number,
      default: 5
    }
  },
  data: function() {
    var rowsPerPage = this.rowsPerPage;

    return {
      page: 1,
      rowsPerPageOptions: getRowsPerPageOption(rowsPerPage)
    };
  },
  computed: {
    rowsNumber: function() {
      return this.data.length;
    },
    pagesNumber: function() {
      return Math.ceil(this.data.length / this.rowsPerPage);
    }
  },
  watch: {
    data: function() {
      this.page = 1;
    },
    rowsPerPage: function(value) {
      this.page = 1;
    }
  },
  methods: {
    goToPageByOffset: function(pageOffset) {
      this.page = Math.min(this.pagesNumber, Math.max(1, this.page + pageOffset));
    }
  }
});
