// @flow

const { installAndRequire } = require("../src");
const tmp = require("tmp");
const path = require("path");
const fs = require("fs-extra");

test("install from repository", done => {
  tmp.dir({ unsafeCleanup: true }, (err, p, cleanup) => {
    if (err) throw err;

    installAndRequire(["update-exported-object"], p);
    const checkPath = path.join(
      p,
      "node_modules",
      "update-exported-object",
      "package.json"
    );

    expect(fs.pathExistsSync(checkPath)).toBe(true);

    cleanup();
    done();
  });
});

test("install from folder", done => {
  tmp.dir({ unsafeCleanup: true }, (err, p, cleanup) => {
    if (err) throw err;

    const pkgPath = path.join(__dirname, "fixtures", "mypkg");
    const mods = installAndRequire(["file:" + pkgPath], p);
    const checkPath = path.join(p, "node_modules", "mypkg", "package.json");

    expect(fs.pathExistsSync(checkPath)).toBe(true);
    expect(mods[0]).toEqual("hello");

    cleanup();
    done();
  });
});

test("require from local", done => {
  tmp.dir({ unsafeCleanup: true }, (err, p, cleanup) => {
    if (err) throw err;

    const pkgPath = path.join(__dirname, "fixtures", "mypkg");
    const mods = installAndRequire([pkgPath], p);
    const checkPath = path.join(p, "node_modules", "mypkg", "package.json");

    expect(fs.pathExistsSync(checkPath)).toBe(false);
    expect(mods[0]).toEqual("hello");

    cleanup();
    done();
  });
});
