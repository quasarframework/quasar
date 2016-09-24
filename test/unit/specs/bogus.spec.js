import Vue from 'vue'

describe('bogus.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      template: '<div>Bogus</div>'
    }).$mount()
    expect(vm.$el.textContent).toContain('Bogus')
  })
})
