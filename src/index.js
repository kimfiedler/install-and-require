// @flow

const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const createResolver = require("./resolve");
const yarn = require("./yarn");

import type { Package } from "./resolve";

function createPackage(basePath: string, packages: Array<Package>) {
  const dependencies = packages.reduce((result, pkg) => {
    if (pkg.type === "local") {
      return result;
    }

    result[pkg.name] = pkg.spec;

    return result;
  }, {});

  const pkg = {
    name: "install-and-require",
    private: true,
    version: "1.0.0",
    dependencies
  };

  fs.writeFileSync(
    path.join(basePath, "package.json"),
    JSON.stringify(pkg, null, 2)
  );
}

function installAndRequire<T>(
  packages: Array<string>,
  basePath: string,
  clean: boolean = false
): Array<T> {
  const resolve = createResolver(basePath);

  const resolved = packages.map(resolve);
  const packageMissing = resolved.some(
    pkg => !fs.pathExistsSync(pkg.path) && pkg.type !== "local"
  );

  if (clean) {
    rimraf.sync(path.join(basePath, "node_modules"));
  }

  if (clean || packageMissing) {
    createPackage(basePath, resolved);
    yarn(basePath, "install", "--no-lockfile");
  }

  const modules = resolved.map(pkg => {
    const mod = require(pkg.path);

    return mod;
  });

  return modules;
}

type InstalledPackage = {
  name: string,
  path: string,
  version: string,
  installed: true
};

type NotInstalledPackage = {
  name: string,
  installed: false
};

type PackageVersion = InstalledPackage | NotInstalledPackage;

function readPackageVersion(p: string): string {
  try {
    const pkg = require(path.join(p, "package.json"));
    return pkg.version;
  } catch (err) {
    throw new Error(`Unable to load local package with path: ${p}`);
  }
}

function listInstalled(
  packages: Array<string>,
  basePath: string
): Array<PackageVersion> {
  const resolve = createResolver(basePath);

  return packages.map(resolve).map(pkg => {
    try {
      const version = readPackageVersion(pkg.path);
      return {
        name: pkg.name,
        path: pkg.path,
        version: version,
        installed: true
      };
    } catch (err) {
      return {
        name: pkg.name,
        installed: false
      };
    }
  });
}

module.exports = {
  installAndRequire,
  listInstalled
};
