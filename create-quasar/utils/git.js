const exec = require('child_process').execSync

module.exports.hasGit = function () {
  try {
    exec("git --version");
    return true;
  } catch (e) {
    return false;
  }
}

module.exports.hasProjectGit = function (cwd) {
  try {
    exec("git status", { stdio: "ignore", cwd });
    return true;
  } catch (e) {
    return false;
  }
}