const { resolve } = require('path');
module.exports = {
  parserOptions: {
    project: resolve(__dirname, './tsconfig.json'),
  },

  env: { 
    serviceworker: true,
  },
};
