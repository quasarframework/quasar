import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ionicons',
  outputTargets: [
    {
      type: 'dist',
      empty: false
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      copy: [
        {
          src: './components/test/*.svg',
          dest: './assets/'
        }
      ],
      empty: false
    }
  ]
};
