const config = require('./wdio.shared.conf').config

config.port = 4723

//
// If you have trouble getting all important capabilities together, check out the
// Sauce Labs platform configurator - a great tool to configure your capabilities:
// https://docs.saucelabs.com/reference/platforms-configurator
//
config.capabilities = [
	{
		browserName: '',
		// 'Android' or 'iOS'
		platformName: 'Android',
		// The version of the Android or iOS system
		platformVersion: '9',
		// For Android, Appium uses the first device it finds using "adb devices". So, this
		// string simply needs to be non-empty.
		// For iOS, this must exactly match the device name as seen in Xcode.
		deviceName: 'any',
		// Where to find the .apk or .ipa file to install on the device. The exact location
		// of the file may change depending on your Cordova version.
		app: './src-cordova/platforms/android/app/build/outputs/apk/debug/app-debug.apk',
		// By default, Appium runs tests in the native context. By setting autoWebview to
		// true, it runs our tests in the Cordova context.
		autoWebview: true,
		// When set to true, it will not show permission dialogs, but instead grant all
		// permissions automatically.
		autoGrantPermissions: true
	}]

config.appium = {
	command: 'appium',
	args: {
		address: '127.0.0.1',
		port: 4723
	}
}

exports.config = config

