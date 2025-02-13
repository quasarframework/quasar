declare module 'eslint-plugin-vue' {
  import type { TSESLint } from '@typescript-eslint/utils';

  const configs: {
    'flat/recommended': TSESLint.FlatConfig.ConfigArray;
  };
  const plugin: {
    configs: typeof configs;
  };
  export default plugin;
}

declare module 'eslint-config-prettier' {
  import type { TSESLint } from '@typescript-eslint/utils';

  const config: TSESLint.FlatConfig.Config;
  export default config;
}
