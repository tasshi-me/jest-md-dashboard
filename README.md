# jest-md-dashboard

[![npm version](https://badge.fury.io/js/jest-md-dashboard.svg)](https://badge.fury.io/js/jest-md-dashboard)
[![test](https://github.com/mshrtsr/jest-md-dashboard/actions/workflows/test.yml/badge.svg)](https://github.com/mshrtsr/jest-md-dashboard/actions/workflows/test.yml)
[![lint](https://github.com/mshrtsr/jest-md-dashboard/actions/workflows/lint.yml/badge.svg)](https://github.com/mshrtsr/jest-md-dashboard/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Generating a pretty Markdown dashboard for Jest

## Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
- [Options](#Options)
- [Contribution](#Contribution)
- [License](#License)

## Installation

### npm

```shell
npm install -D jest-md-dashboard
```

### yarn

```shell
yarn add -D jest-md-dashboard
```

## Usage

Add `reporters` field in `jest.config.js`.

```js
const config = {
  reporters: ["jest-md-dashboard"],
};
module.exports = config;
```

Run jest and the markdown dashboard is generated to `test-dashboard.md`.

### With options

```js
const config = {
  reporters: [
    [
      "jest-md-dashboard",
      {
        title: "My Dashboard",
      },
    ],
  ],
};
module.exports = config;
```

### Separate config

If you want to separate jest config, e.g. print dashboard only on CI,
create `jest.print-dashboard.js`.

```js
// Inherit jest.config.js
const baseConfig = require("./jest.config.js");

const config = {
  ...baseConfig,
  reporters: ["jest-md-dashboard"],
};
module.exports = config;
```

And then, run jest with `--config` option.

```shell
jest --config=./jest.print-dashboard.js
```

## Options

| Name               | Type     | Default             | Description                                                                                                                                                                                                                                             |
| ------------------ | -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`            | `string` | `"Test Dashboard"`  | The title of a dashboard.<br>It will be printed at the top of the markdown output.                                                                                                                                                                      |
| `outputPath`       | `string` | `test-dashboard.md` | The file path to output dashboard. If you want to output to stdout, specify `-`.                                                                                                                                                                        |
| `permalinkBaseUrl` | `string` | `undefined`         | Override baseUrl of permalink. Specify if generated permalinks are incorrect.<br>URL must have trailing slash.<br>e.g. `https://github.com/mshrtsr/jest-md-dashboard/blob/` <br>See [Permalink generation](#Permalink generation) for more information. |

## Permalink generation

jest-md-dashboard generates permalink to test files on GitHub (or other services) by default.

jest-md-dashboard tries to find git information from the following sources.

1. `permalinkBaseUrl` option
2. (on GitHub Actions) environment variables
3. (in git repository) git config

### `permalinkBaseUrl` option

If `permalinkBaseUrl` is specified on jest config, jest-md-dashboard generates permalink using it.

### on GitHub Actions

If you run jest on GitHub Actions, jest-md-dashboard generates permalink using the following environment variables.

- `$GITHUB_ACTIONS`
- `$GITHUB_SERVER_URL`
- `$GITHUB_REPOSITORY`
- `$GITHUB_SHA`
- `$GITHUB_WORKSPACE`

### in git repository

If jest runs in a git repository, jest-md-dashboard generates permalink using git config of the local repository.

## Contribution

We appreciate your help!

## License

- [MIT](LICENSE)
