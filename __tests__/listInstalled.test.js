// @flow

const { installAndRequire, listInstalled } = require("../src");
const tmp = require("tmp");
const path = require("path");
const fs = require("fs-extra");
const invariant = require("invariant");

test("not installed", () => {
  const installed = listInstalled(["update-exported-object"], __dirname);
  expect(installed.length).toBe(1);
  expect(installed[0].installed).toBeFalsy();
  expect(installed[0].name).toBe("update-exported-object");
});

test("installed", done => {
  tmp.dir({ unsafeCleanup: true }, (err, p, cleanup) => {
    if (err) throw err;

    installAndRequire(["update-exported-object@1.0.0"], p);
    const checkPath = path.join(
      p,
      "node_modules",
      "update-exported-object",
      "package.json"
    );

    expect(fs.pathExistsSync(checkPath)).toBe(true);
    const installed = listInstalled(["update-exported-object"], p);
    expect(installed.length).toBe(1);
    const pkg = installed[0];
    invariant(pkg.installed === true, "expected package to be installed");
    expect(pkg.name).toBe("update-exported-object");
    expect(pkg.version).toBe("1.0.0");

    cleanup();
    done();
  });
});
