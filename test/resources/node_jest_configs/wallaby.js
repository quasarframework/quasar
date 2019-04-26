module.exports = (wallaby) => {
	process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true

	const compiler = wallaby.compilers.babel({ presets: [['@quasar/app', { modules: 'commonjs' }]] })

	return {
		files: [
			'src/*',
			'jest.config.js',
			'package.json'
		],

		tests: ['test/__tests__/*.spec.js'],

		env: {
			type: 'node',
			runner: 'node'
		},

		compilers: {
			'**/*.js': compiler,
		},

		setup: function (wallaby) {
			const jestConfig = require('./package').jest || require('./jest.config')
			jestConfig.transform = {}
			wallaby.testFramework.configure(jestConfig)
		},

		testFramework: 'jest',
		debug: true
	}
}
