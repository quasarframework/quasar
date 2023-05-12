const { resolve } = require('node:path');

module.exports = {
  parserOptions: {
    project: resolve(__dirname, './tsconfig.json'),
  },

  overrides: [
    {
      files: ['custom-service-worker.ts'],

      env: {
        serviceworker: true,
      },
    },
  ],
};
