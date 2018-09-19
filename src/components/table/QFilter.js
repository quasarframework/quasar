import QItem from '../list/QItem'
import QInput from '../input/QInput'
import QSelect from '../select/QSelect'
import QAutocomplete from '../autocomplete/QAutocomplete'

export default {
  name: 'QFilter',
  props: {
    props: Object
  },
  methods: {
    renderFilter (h, component, on) {
      return h(
        component, {
          ref: `filter`,
          props: this.props.col.filter.props,
          on: on
        }
      )
    },
    onChangeGeneralCb (value) {
      this.props.col.filter.props.value = value
      this.props.filter[this.props.col.name] = value
      this.$emit('filter:change', this.props.col)
    }
  },
  render (h) {
    let filter
    switch (this.props.col.filter.type) {
      case 'input':
        if (!this.props.col.filter.defaultValue) {
          this.props.col.filter.defaultValue = ''
        }
        if (!this.props.col.filter.props.value) {
          this.$set(this.props.col.filter.props, 'value', this.props.col.filter.defaultValue)
        }
        filter = this.renderFilter(h, QInput, {
          change: this.onChangeGeneralCb
        })
        break
      case 'select':
        if (!this.props.col.filter.defaultValue) {
          this.props.col.filter.defaultValue = []
        }
        if (!this.props.col.filter.props.value) {
          this.$set(this.props.col.filter.props, 'value', this.props.col.filter.defaultValue)
        }
        filter = this.renderFilter(h, QSelect, {
          change: this.onChangeGeneralCb
        })
        break
      case 'autocomplete':
        if (!this.props.col.filter.defaultValue) {
          this.props.col.filter.defaultValue = []
        }
        if (!this.props.col.filter.props.value) {
          this.$set(this.props.col.filter.props, 'value', this.props.col.filter.defaultValue)
        }
        filter = this.renderFilter(h, QAutocomplete, {
          change: this.onChangeGeneralCb
        })
        break
      case 'component':
        if (!this.props.col.filter.props.value) {
          this.$set(this.props.col.filter.props, 'value', this.props.col.filter.defaultValue)
        }
        filter = this.renderFilter(h, this.props.col.filter.component, {
          change: this.onChangeGeneralCb
        })
        break
    }
    return h(
      QItem, {},
      [filter])
  }
}
