const exec = require('child_process').execSync

function hasGit() {
  try {
    exec("git --version");
    return true;
  } catch (e) {
    return false;
  }
}

function hasProjectGit(cwd) {
  try {
    exec("git status", { stdio: "ignore", cwd });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports.initializeGit = function (cwd) {
  if (!hasGit()) {
    logger.warning(
      "Git is not present on the system, skipping repo initialization..."
    );
    return;
  }

  if (hasProjectGit(cwd)) {
    logger.warning(
      "The project already have an initialized Git repository, skipping repo initialization..."
    );
    return;
  }

  exec("git init", { cwd });
  exec("git add -A", { cwd });

  try {
    exec(
      "git commit -m 'Initialize the project 🚀' --no-verify",
      { cwd }
    );
  } catch (e) {
    logger.warning(
      "Skipped git commit because an error occurred, you will need to perform the initial commit yourself."
    );
  }
}