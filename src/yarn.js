// @flow

const spawn = require("cross-spawn");
const path = require("path");

const yarnPath = path.join(__dirname, "..", "bundle", "yarn-1.6.0.js");

function yarn(cwd: string, ...args: string[]) {
  const proc = spawn.sync(process.execPath, [yarnPath, ...args], {
    cwd,
    stdio: "inherit"
  });

  return proc;
}

module.exports = yarn;
