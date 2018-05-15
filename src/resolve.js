// @flow

const npa = require("npm-package-arg");
const path = require("path");
const crypto = require("crypto");

type NpaResult = {
  type: "git" | "tag" | "version" | "range" | "file" | "directory" | "remote",
  registry: boolean,
  name: ?string,
  raw: string,
  fetchSpec: ?string,
  saveSpec: ?string
};

export type LocalPackage = {
  type: "local",
  name: string,
  path: string
};

export type InstallPackage = {
  type: "install",
  name: string,
  spec: string,
  path: string
};

export type Package = LocalPackage | InstallPackage;

function getSpec(args: NpaResult): string {
  if (args.registry && args.fetchSpec) {
    return args.fetchSpec;
  } else if (args.saveSpec) {
    return args.saveSpec;
  }

  throw new Error("Unable to find package spec");
}

function extensionForPath(p: string): string {
  const ext = path.extname(p);

  if (ext === "") {
    return "";
  } else {
    return extensionForPath(path.basename(p, ext)) + ext;
  }
}

function readPackageName(p: string): string {
  try {
    const pkg = require(path.join(p, "package.json"));
    return pkg.name;
  } catch (err) {
    throw new Error(`Unable to load local package with path: ${p}`);
  }
}

function createResolver(basePath: string) {
  return function resolve(pattern: string): Package {
    const args: NpaResult = npa(pattern);

    let name = args.name;

    if (
      args.type === "directory" &&
      args.raw.indexOf("file:") === -1 &&
      args.fetchSpec
    ) {
      return {
        type: "local",
        name: readPackageName(args.fetchSpec),
        path: args.raw
      };
    } else if (
      typeof name === "undefined" &&
      (args.type === "file" || args.type === "remote" || args.type === "git")
    ) {
      const ext = extensionForPath(pattern);
      name = path.basename(pattern, ext);
    } else if (
      typeof name === "undefined" &&
      args.type === "directory" &&
      args.fetchSpec
    ) {
      name = readPackageName(args.fetchSpec);
    } else if (typeof name === "undefined" || name === null) {
      throw new Error(`Unable to resolve name from pattern ${pattern}`);
    }

    return {
      type: "install",
      name: name,
      spec: getSpec(args),
      path: path.join(basePath, "node_modules", name)
    };
  };
}

module.exports = createResolver;
