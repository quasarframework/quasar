module.exports = (wallaby) => {
	process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true

	const compiler = wallaby.compilers.babel()

	return {
		files: [
			'bin/*',
			'lib/*',
			'jest.config.js',
			'package.json'
		],

		tests: ['test/functional/*.spec.js'],

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
