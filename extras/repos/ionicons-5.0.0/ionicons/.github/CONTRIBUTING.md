# Contributing

Thanks for your interest in contributing to Ionicons! :tada:


## Contributing Etiquette

Please see our [Contributor Code of Conduct](./CODE_OF_CONDUCT.md) for information on our rules of conduct.


## Creating an Issue

* If you have a question about using Ionicons, please ask on the [Ionic Forum](http://forum.ionicframework.com/) or in the [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/) group.

* It is required that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

* The issue list of this repository is exclusively for bug reports and feature requests. Non-conforming issues will be closed immediately.

* If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported](https://github.com/ionic-team/ionicons/issues?utf8=%E2%9C%93&q=is%3Aissue). You can search through existing issues to see if there is a similar one reported. Include closed issues as it may have been closed with a solution.

* Next, [create a new issue](https://github.com/ionic-team/ionicons/issues/new/choose) that thoroughly explains the problem.


## Creating a Pull Request

* We appreciate you taking the time to contribute! Before submitting a pull request, we ask that you please [create an issue](#creating-an-issue) that explains the bug or feature request and let us know that you plan on creating a pull request for it. If an issue already exists, please comment on that issue letting us know you would like to submit a pull request for it. This helps us to keep track of the pull request and make sure there isn't duplicated effort.

* Looking for an issue to fix? Make sure to look through our issues with the [help wanted](https://github.com/ionic-team/ionicons/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) label!


### Setup

1. [Download the installer](https://nodejs.org/) for the LTS version of Node.js. This is the best way to also [install npm](https://blog.npmjs.org/post/85484771375/how-to-install-npm#_=_).
2. Fork this repository.
3. Clone your fork.
4. Create a new branch from master for your change.
5. Run `npm install` from the root directory to install dependencies for this package.
6. Run `npm run build` to perform a first time build.
7. [Modify the Icon Component](#modifying-components) if desired.
8. Or, modify and [preview the site](#preview-site).


#### Modifying Components

1. Navigate to the `src/components/` directory and open the `icon` component to modify.
2. Make any changes to the icon component and then [preview-changes](#preview-component-changes).


#### Preview Component Changes

1. Run `npm start` from the root directory to start a local version of the icon test.
2. Modify the icon test as needed in the `index.html` file.


<!-- #### Building Changes

TODO -->


### Submit Pull Request

1. [Create a new pull request](https://github.com/ionic-team/ionicons/compare) with the `master` branch as the `base`. You may need to click on `compare across forks` to find your changes.
2. See the [Creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) GitHub help article for more information.
3. Please fill out the Pull Request template to the best of your ability and include any issues that are related.


## License

By contributing your code to the ionic-team/ionicons GitHub Repository, you agree to license your contribution under the MIT license.
