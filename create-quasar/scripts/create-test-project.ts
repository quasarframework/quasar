import { override } from 'prompts';

type ScriptType = 'js' | 'ts';
type AppEngine = 'vite' | 'webpack';
type PackageManager = 'yarn' | 'npm' | 'pnpm';

type CreateProjectOptions = {
  scriptType: ScriptType;
  appEngine: AppEngine;
  packageManager: PackageManager;
};

export async function createProject({ scriptType, appEngine, packageManager }: CreateProjectOptions) {
  // To bypass Corepack enforcing what's specified in the closest package.json file that has the 'packageManager' field
  process.env.COREPACK_ENABLE_STRICT = '0';

  override({
    projectType: 'app',
    projectFolder: 'test-project',
    overwrite: true,

    quasarVersion: 'v2',
    scriptType: scriptType,
    engine: appEngine,

    name: 'test-project',
    productName: 'Test Project',
    description: 'A test project',
    author: 'Quasar Team (info@quasar.dev)',

    // The defaults
    typescriptConfig: 'composition',
    css: 'scss',
    preset: ['lint'],
    lintConfig: 'prettier',

    packageManager,
  });

  await import('../index.js');
}

const args = process.argv.slice(2) as [ScriptType, AppEngine, PackageManager];

void createProject({
  scriptType: args[0],
  appEngine: args[1],
  packageManager: args[2],
})
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
