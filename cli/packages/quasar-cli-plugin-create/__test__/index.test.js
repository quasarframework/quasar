describe('@quasar/cli-plugin-create', () => {
  it('has help', () => {
    process.argv.push('--help');
    jest.spyOn(process, 'exit').mockImplementationOnce(() => {
      throw new Error('process.exit() was called.')
    });
    expect(() => {
      const QuasarPluginCreate = require('../index')
      let qpCreate = new QuasarPluginCreate({init:false, auto:false, sliceAt: 8})
      qpCreate.start()
    }).toThrow('process.exit() was called.');

    expect(process.exit).toHaveBeenCalledWith(0);
  })

})
