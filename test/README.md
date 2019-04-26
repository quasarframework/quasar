# TESTING QUASAR CORE [WIP]

**Head's Up!**

We are explicitly soliciting feedback and support writing and improving these tests. Please get in touch if you want to contribute!!!


For the time being, this section of the monorepo serves to collect the design decisions and document that plethora of testing needs that this repository has, from generated tests to code coverage servers and CI. Because of the way that the packages interact, some types of integration testing and e2e can be ignored. It is assumed that all packages will at some point have a 100% unit-test coverage.

Because of the scopes involved, it is a design decision that each package has its own testing harnesses instead of a global one. 

In the near future, this specific package `test` will collect all the test results and instrument them in a way the complete suite can be tested at one time. Ideally, this will become part of the CI pipeline.


## PACKAGES

The following table is a like a shopping list of what is needed [-/x] and where we stand [0-9]

| package           | unit  | integration | e2e   | ci   |
|-------------------|-------|-------------|-------|------|
| cli               | x/0   | -/-         | x/1   | -/-  |
| app               | x/0   | -/-         | x/1   | -/-  |
| babel-preset-app  | x/0   | -/-         | x/-   | -/-  |
| docs              | x/1   | -/-         | x/-   | x/-  |
| extras            | x/0   | x/-         | x/-   | -/-  |
| quasar            | x/1   | x/8         | x/-   | -/-  |


## Current state of this project (in flux, not canonical, just commentary)

CLI
- copy of ancient quasar-cli v0.6
  - using mocha => must change to jest
  - must update to current state of the code
  - need build tests
  
DOCS
- integration of quasar/testing app-extensions
  - jest (with coverage)
  - webdriver
  - security
    - forthcoming OWASP ZAP integration

QUASAR
- matyas code generation from the api (rigged to the real api)
  - goal: use the API to generate both VUE files and tests as a method of reducing cognitive load for handwriting tests. Instrument the coverage to detect where custom tests need to be written
- dennythecoder's work from v0.15
  - goal: place custom tests next to their components
- sauce-labs attached to /dev

TEST
- instrument all tests, create reports and fail/pass CI

## Contributing
Thanks for your interest in contributing. Before you start getting involved in testing, here are some ground rules for all pull requests about testing:

- no modifying core, only instrumentation
- all applications must continue to run and build as before
- if you generate tests, do not commit them
- if you modify generated tests, clone the spawn and make it clear that you have done so

## License

Copyright (c) 2015-present Razvan Stoenescu, Daniel Thompson-Yvetot et. al.

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
