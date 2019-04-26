const config = require('./wdio.shared.conf').config

config.port = 9515

//
// If you have trouble getting all important capabilities together, check out the
// Sauce Labs platform configurator - a great tool to configure your capabilities:
// https://docs.saucelabs.com/reference/platforms-configurator
//
config.capabilities = [
	{
		browserName: 'chrome',
		chromeOptions: {
			binary: './dist/electron-mat/Quasar App-linux-x64/Quasar App',
			args: [ '--no-sandbox', '--headless' ]
		}
	}]

exports.config = config
