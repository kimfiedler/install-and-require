# install-and-require

Given a list of dependencies and a path this function will install the dependencies (if they are missing) and require them and return the modules.

## Usage

```js
// myapp.config.js

const { installAndRequire } = require("install-and-require");

const [somePkg, someOtherPkg] = installAndRequire(
  ["some-pkg", "some-other-pkg"],
  "~/.myapp/packages"
);
```

## API

Function signatures (with Flow type annotation):

```js
function installAndRequire<T>(
  packages: Array<string>,
  basePath: string,
  clean: boolean = false
): Array<T>

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

function listInstalled(
  packages: Array<string>,
  basePath: string
): Array<PackageVersion>
```
