#!/bin/bash

if [ -n CIRCLECI ]
then
  karma start --single-run
else
  karma start --single-run && cat ./coverage/coverage.json | ./node_modules/codecov.io/bin/codecov.io.js
fi
