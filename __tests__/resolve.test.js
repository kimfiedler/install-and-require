// @flow

const createResolver = require("../src/resolve");
const invariant = require("invariant");
const path = require("path");

test("a file", () => {
  const resolve = createResolver(__dirname);
  const pkg = resolve("file:../pkg.tar.gz");
  expect(pkg.name).toBe("pkg");
  invariant(pkg.type === "install", "unexpected type");
  expect(pkg.spec).toBe("file:../pkg.tar.gz");
});

test("a directory", () => {
  const resolve = createResolver(__dirname);
  const pkg = resolve("file:__tests__/fixtures/mypkg");
  expect(pkg.name).toBe("mypkg");
  invariant(pkg.type === "install", "unexpected type");
  expect(pkg.spec).toBe("file:__tests__/fixtures/mypkg");
});

test("a local directory", () => {
  const resolve = createResolver(__dirname);
  const pkg = resolve(path.join(__dirname, "fixtures", "mypkg"));
  expect(pkg.type).toBe("local");
  expect(pkg.name).toBe("mypkg");
});

test("a github repo", () => {
  const resolve = createResolver(__dirname);
  const pkg = resolve("github:kimfiedler/update-exported-object");
  invariant(pkg.type === "install", "unexpected type");
  expect(pkg.name).toBe("update-exported-object");
  expect(pkg.spec).toBe("github:kimfiedler/update-exported-object");
});

test("a package", () => {
  const resolve = createResolver(__dirname);
  const pkg = resolve("npm-package-arg");
  expect(pkg.name).toBe("npm-package-arg");
  invariant(pkg.type === "install", "unexpected type");
  expect(pkg.spec).toBe("latest");
});

test("a specific version of package", () => {
  const resolve = createResolver(__dirname);
  const pkg = resolve("npm-package-arg@2.0.0");
  expect(pkg.name).toBe("npm-package-arg");
  invariant(pkg.type === "install", "unexpected type");
  expect(pkg.spec).toBe("2.0.0");
});

test("a range version of package", () => {
  const resolve = createResolver(__dirname);
  const pkg = resolve("npm-package-arg@^2.0.0");
  expect(pkg.name).toBe("npm-package-arg");
  invariant(pkg.type === "install", "unexpected type");
  expect(pkg.spec).toBe("^2.0.0");
});

test("a remote url", () => {
  const resolve = createResolver(__dirname);
  const pkg = resolve("https://something.com/package.tar.gz");
  invariant(pkg.type === "install", "unexpected type");
  expect(pkg.name).toBe("package");
  expect(pkg.spec).toBe("https://something.com/package.tar.gz");
});
