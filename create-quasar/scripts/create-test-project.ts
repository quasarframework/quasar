import prompts from "prompts";

type ScriptType = "js" | "ts";
type AppEngine = "vite-2" | "webpack-4";
type PackageManager = "yarn" | "npm" | "pnpm";

type CreateProjectOptions = {
  scriptType: ScriptType;
  appEngine: AppEngine;
  packageManager: PackageManager;
};

export async function createProject({
  scriptType,
  appEngine,
  packageManager
}: CreateProjectOptions) {
  // To bypass Corepack enforcing what's specified in the closest package.json file that has the 'packageManager' field
  process.env.COREPACK_ENABLE_STRICT = "0";
  // See https://github.com/yarnpkg/yarn/issues/9015
  process.env.SKIP_YARN_COREPACK_CHECK = "1";
  // To alter the behavior to run correctly within this script
  process.env.CREATE_TEST_PROJECT_OVERRIDE = "true";

  prompts.override({
    projectType: "app",
    projectFolder: "test-project",
    overwrite: true,

    scriptType: scriptType,
    engine: appEngine,

    name: "test-project",
    productName: "Test Project",
    description: "A test project",
    author: "Quasar Team (info@quasar.dev)",

    // The defaults
    sfcStyle: "composition-setup",
    css: "scss",

    preset: ["eslint"],
    prettier: true,

    packageManager
  });

  // We are overriding .override() as every call overrides the previous overrides (too many overrides :D)
  // This way, we guarantee that even if we call prompts.override() in create-quasar code, our values remain
  prompts.override = () => {};
  // Remove all extra arguments to avoid interfering with the index.js script
  process.argv = process.argv.slice(0, 2);

  await import("../index.js");
}

const args = process.argv.slice(2) as [ScriptType, AppEngine, PackageManager];

void createProject({
  scriptType: args[0],
  appEngine: args[1],
  packageManager: args[2]
}).catch(error => {
  console.error(error);
  process.exit(1);
});
