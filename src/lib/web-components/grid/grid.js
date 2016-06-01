'use strict';

var
  template = require('raw!./grid.html'),
  tableTemplate = require('raw!./grid-table.html'),
  defaultRowsPerPage = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '15', value: 15},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
    {label: 'No pagination', value: 0}
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

function getColumnsFieldArray(columns) {
  return columns.map(function(column) {
    return column.field;
  });
}

Vue.filter('gridShowSelected', function(data, filter, selectionMode, singleSelection) {
  if (!filter || selectionMode === 'none') {
    return data;
  }

  if (selectionMode === 'single') {
    return singleSelection;
  }

  return data.filter(function(row) {
    return row.__selected;
  });
});

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
    },
    sortable: {
      type: Boolean,
      default: true,
      coerce: function(value) {
        return value ? true : false;
      }
    },
    noDataLabel: {
      type: String,
      default: 'No data to display.'
    },
    idProperty: String,
    selectionMode: {
      type: String,
      default: 'none',
      coerce: function(value) {
        return value === 'single' || value === 'multiple' ? value : 'none';
      }
    },
    selectionActions: Array
  },
  data: function() {
    return {
      searchQuery: '',
      showOnlySelected: false,
      singleSelection: []
    };
  },
  watch: {
    searchQuery: function() {
      this.$refs.table.page = 1;
    },
    showOnlySelected: function() {
      this.$refs.table.page = 1;
    }
  },
  events: {
    'toggle-selection': function() {
      this.showOnlySelected = !this.showOnlySelected;
    },
    'filter': function(value) {
      this.searchQuery = value;
    },
    'set-single-selection': function(value) {
      this.singleSelection = value;
    }
  }
});

Vue.component('grid-table', {
  template: tableTemplate,
  props: ['data', 'columns', 'rowsPerPage', 'sortable', 'noDataLabel', 'idProperty', 'selectionMode', 'selectionActions'],
  data: function() {
    var rowsPerPage = this.rowsPerPage;
    var chosenColumns = this.getChosenColumn();

    return {
      page: 1,
      rowsPerPageOptions: getRowsPerPageOption(rowsPerPage),
      sortField: '',
      sortOrder: 1,
      chosenColumnsModel: chosenColumns,
      singleSelectedRow: null,
      searchQuery: '',
      controls: '',
      showOnlySelected: false
    };
  },
  computed: {
    rowsNumber: function() {
      return this.data.length;
    },
    pagesNumber: function() {
      return Math.ceil(this.data.length / this.rowsPerPage);
    },
    chosenColumnsOptions: function() {
      return this.columns.map(function(column) {
        return {
          label: column.label,
          value: column.field
        };
      });
    },
    computedRowsPerPage: function() {
      return this.rowsPerPage ? this.rowsPerPage : Infinity;
    },
    rowOffset: function() {
      return this.rowsPerPage * (this.page - 1);
    },
    selectedRows: function() {
      if (this.selectionMode === 'single') {
        return this.singleSelectedRow ? [this.singleSelectedRow] : [];
      }
      return this.data.filter(function(row) {
        return row.__selected === true;
      });
    },
    actionsModel: function() {
      var index = -1;

      return this.selectionActions.map(function(item) {
        return {
          label: item.label,
          value: ++index
        };
      });
    }
  },
  watch: {
    rowsPerPage: function(value) {
      this.page = 1;
    },
    chosenColumnsModel: function(options) {
      for (var i = 0; i < this.columns.length; i++) {
        this.columns.$set(i, $.extend({}, this.columns[i], {
          hidden: !options.includes(this.columns[i].field)
        }));
      }
    },
    searchQuery: function(value) {
      this.$dispatch('filter', value);
    },
    showOnlySelected: function(value) {
      this.$dispatch('toggle-selection');
    },
    singleSelectedRow: function(value) {
      this.$dispatch('set-single-selection', [value]);
    }
  },
  methods: {
    goToPageByOffset: function(pageOffset) {
      this.page = Math.min(this.pagesNumber, Math.max(1, this.page + pageOffset));
    },
    sortBy: function(field) {
      if (!this.sortable) {
        return;
      }

      // if sort field got changed
      if (this.sortField !== field) {
        this.sortOrder = 1;
        this.sortField = field;
        return;
      }

      // else we sort on same field
      if (this.sortOrder === -1) {
        this.sortField = '';
      }
      else {
        this.sortOrder = -1;
      }
    },
    getChosenColumn: function() {
      return this.columns.filter(function(column) {
        return column.hidden !== true;
      }).map(function(column) {
        return column.field;
      });
    },
    clearSelection: function() {
      if (this.selectionMode === 'single') {
        this.singleSelectedRow = null;
      }
      else {
        this.data.forEach(function(row) {
          if (row.hasOwnProperty('__selected')) {
            row.__selected = false;
          }
        });
      }

      this.showOnlySelected = false;
    },
    clearFilter: function() {
      this.searchQuery = '';
      this.controls = '';
    },
    toggleControls: function(mode) {
      this.controls = this.controls === mode ? '' : mode;
    },
    chooseAction: function() {
      var
        options = this.actionsModel,
        selectedRows = this.selectedRows,
        actions = this.selectionActions
        ;

      if (selectedRows.length === 0) {
        return;
      }

      quasar.dialog({
        title: 'Actions',
        message: 'Apply action for the ' + selectedRows.length + ' selected row(s).',
        radios: options,
        buttons: [
          'Cancel',
          {
            label: 'Apply',
            handler: function(data) {
              actions[data].handler(selectedRows);
            }
          }
        ]
      });
    }
  }
});
