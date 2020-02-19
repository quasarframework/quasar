import fs from 'fs-extra';
import {join} from 'path';
import execa from 'execa';
import inquirer from 'inquirer';
import Listr, { ListrTask } from 'listr';
import semver from 'semver';


const rootDir = join(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');
const packageLockJsonPath = join(rootDir, 'package-lock.json');

const cmdArgs = process.argv.slice(2);
const isPublishRelease = cmdArgs.includes('--publish');
const isDryRun = cmdArgs.includes('--dry-run');
const isAnyBranch = cmdArgs.includes('--any-branch');
const isYolo = cmdArgs.includes('--yolo');

function runTasks(newVersion: string, releaseTag: string, isPublishRelease: boolean) {
  const pkg = readPkg();
  const tasks: ListrTask[] = [];

  tasks.push(
    {
      title: 'Check current branch',
      task: () => execa('git', ['symbolic-ref', '--short', 'HEAD']).then(({stdout}) => {
        if (stdout !== 'master') {
          if (isAnyBranch) {
            console.log(`Not on "master" branch, currently on "${stdout}".`);
          } else {
            throw new Error(`Not on "master" branch, currently on "${stdout}". Use --any-branch to publish anyway.`);
          }
        }
      })
    },
    {
      title: 'Check local working tree',
      task: () => execa('git', ['status', '--porcelain']).then(({stdout}) => {
        if (stdout !== '') {
          if (isYolo) {
            console.log('Unclean working tree.');
          } else {
            throw new Error('Unclean working tree. Commit or stash changes first.');
          }
        }
      })
    },
    {
      title: 'Check remote history',
      task: () => execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(({stdout}) => {
        if (stdout !== '0') {
          if (isAnyBranch) {
            console.log('Remote history differs.');
          } else {
            throw new Error('Remote history differs. Please pull changes.');
          }
        }
      })
    }
  );

  if (!isPublishRelease) {
    tasks.push(
      {
        title: `Set package.json version to ${newVersion}`,
        task: () => {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          packageJson.version = newVersion;
          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

          const packageLockJson = JSON.parse(fs.readFileSync(packageLockJsonPath, 'utf8'));
          packageLockJson.version = newVersion;
          fs.writeFileSync(packageLockJsonPath, JSON.stringify(packageLockJson, null, 2) + '\n');
        }
      },
      {
        title: `Build`,
        task: () => execa('npm', ['run', 'build'], { cwd: rootDir })
      },
      {
        title: 'Run tests',
        task: () => execa('npm', ['test'], { cwd: rootDir })
      },
      {
        title: `Generate Changelog`,
        task: () => execa('npm', ['run', 'changelog'], { cwd: rootDir }),
      }
    );
  }

  if (isPublishRelease) {
    tasks.push(
      {
        title: `Publish ionicons ${newVersion} (${releaseTag})`,
        task: () => {
          const args = ['publish'].concat(releaseTag ? ['--tag', releaseTag] : []);
          if (isDryRun) {
            console.log('[dry-run] npm', args.join(' '));
          } else {
            return execa('npm', args, { cwd: rootDir });
          }
        }
      },
      {
        title: 'Tagging the latest commit',
        task: () => {
          const args = ['tag', `v${newVersion}`];
          if (isDryRun) {
            console.log('[dry-run] git', args.join(' '));
          } else {
            return execa('git', args, { cwd: rootDir });
          }
        }
      },
      {
        title: 'Pushing to Github',
        task: () => {
          const args = ['push', '--follow-tags'];
          if (isDryRun) {
            console.log('[dry-run] git', args.join(' '));
          } else {
            return execa('git', args, { cwd: rootDir });
          }
        }
      }
    );
  }

  const listr = new Listr(tasks);

  listr.run()
    .then(() => {
      if (isPublishRelease) {
        console.log(`\n ${pkg.name} ${newVersion} published!! 🎉\n`);
      } else {
        console.log(`\n ${pkg.name} ${newVersion} prepared, check the diffs and commit 🕵️\n`);
      }
    })
    .catch(err => {
      console.error(err);
      process.exit(0);
    });
}


async function prepareUI() {
  const pkg = readPkg();
  const oldVersion = pkg.version;

  console.log(`\nPrepare to publish ${pkg.name} (currently ${oldVersion}) ${isDryRun ? '[dry-run]' : ''}\n`);

  const prompts = [
    {
      type: 'list',
      name: 'version',
      message: 'Select semver increment or specify new version',
      pageSize: SEMVER_INCREMENTS.length + 2,
      choices: SEMVER_INCREMENTS
        .map(inc => ({
          name: `${inc}   ${prettyVersionDiff(oldVersion, inc)}`,
          value: inc
        })),
      filter: (input: any) => isValidVersionInput(input) ? getNewVersion(oldVersion, input) : input
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (answers: any) => {
        return `Prepare release ${answers.version}. Continue?`;
      }
    }
  ];

  await inquirer
    .prompt(prompts)
    .then(answers => {
      if (answers.confirm){
        const newVersion = answers.version;
        return runTasks(newVersion, null, false);
      }
    })
    .catch(err => {
      console.error(err);
      process.exit(0);
    });
}


async function publishUI() {
  const pkg = readPkg();

  console.log(`\nPublish ${pkg.name} ${pkg.version} ${isDryRun ? '[dry-run]' : ''}\n`);

  const prompts = [
    {
      type: 'list',
      name: 'tag',
      message: 'How should this release version be tagged in npm?',
      choices: () => execa('npm', ['view', '--json', pkg.name, 'dist-tags'])
        .then(({stdout}) => {
          return Object.keys(JSON.parse(stdout))
            .map(tag => {
              return {
                name: tag,
                value: tag
              }
            });
        })
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (answers: any) => {
        return `Will publish ${pkg.name} ${pkg.version} and tag this release as "${answers.tag}". Continue?`;
      }
    }
  ];

  await inquirer
    .prompt(prompts)
    .then(answers => {
      if (answers.confirm){
        return runTasks(pkg.version, answers.tag, true);
      }
    })
    .catch(err => {
      console.error(err);
      process.exit(0);
    });
}


const SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
const PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease'];

const isValidVersion = (input: string) => Boolean(semver.valid(input));

const isValidVersionInput = (input: string) => SEMVER_INCREMENTS.indexOf(input) !== -1 || isValidVersion(input);

const isPrereleaseVersion = (version: string) => PRERELEASE_VERSIONS.indexOf(version) !== -1 || Boolean(semver.prerelease(version));

function getNewVersion(oldVersion: string, input: any): string {
  if (!isValidVersionInput(input)) {
    throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
  }

  return SEMVER_INCREMENTS.indexOf(input) === -1 ? input : semver.inc(oldVersion, input);
};

const readPkg = (): any => JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

function prettyVersionDiff(oldVersion: any, inc: any) {
  const newVersion = getNewVersion(oldVersion, inc).split('.');
  oldVersion = oldVersion.split('.');
  let firstVersionChange = false;
  const output = [];

  for (let i = 0; i < newVersion.length; i++) {
    if ((newVersion[i] !== oldVersion[i] && !firstVersionChange)) {
      output.push(newVersion[i]);
      firstVersionChange = true;
    } else if (newVersion[i].indexOf('-') >= 1) {
      let preVersion = [];
      preVersion = newVersion[i].split('-');
      output.push(`${preVersion[0]}-${preVersion[1]}`);
    } else {
      output.push(newVersion[i]);
    }
  }
  return output.join('.');
}


(async () => {
  try {
    if (isPublishRelease) {
      await publishUI();
    } else {
      await prepareUI();
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
