import a from 'src/a'

describe('a module', () => {
  it('should return string', () => {
    expect(a('text')).toEqual('text-wow!')
  })
})
