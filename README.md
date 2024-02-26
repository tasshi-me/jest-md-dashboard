# jest-md-dashboard

[![npm version](https://badge.fury.io/js/jest-md-dashboard.svg)](https://badge.fury.io/js/jest-md-dashboard)
[![codecov](https://codecov.io/gh/tasshi-me/jest-md-dashboard/branch/main/graph/badge.svg?token=K1X4K9S9UU)](https://codecov.io/gh/tasshi-me/jest-md-dashboard)
[![test](https://github.com/tasshi-me/jest-md-dashboard/actions/workflows/test.yml/badge.svg)](https://github.com/tasshi-me/jest-md-dashboard/actions/workflows/test.yml)
[![lint](https://github.com/tasshi-me/jest-md-dashboard/actions/workflows/lint.yml/badge.svg)](https://github.com/tasshi-me/jest-md-dashboard/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Generating a pretty Markdown dashboard for Jest

## Table of Contents

- [Example](#Example)
- [Installation](#Installation)
- [Usage](#Usage)
- [Options](#Options)
- [Contribution](#Contribution)
- [License](#License)

## Example

See https://github.com/tasshi-me/jest-md-dashboard/issues/20

## Installation

### npm

```shell
npm install -D jest-md-dashboard
```

### yarn

```shell
yarn add -D jest-md-dashboard
```

### pnpm

```shell
pnpm add -D jest-md-dashboard
```

## Usage

Add `reporters` field in `jest.config.js`.

```js
const config = {
  reporters: ["default", "jest-md-dashboard"],
};
module.exports = config;
```

Run jest and the dashboard is generated to `test-dashboard.md`.

### With [options](#Options)

```js
const config = {
  reporters: ["default", ["jest-md-dashboard", { title: "My Dashboard" }]],
};
module.exports = config;
```

## Options

| Name               | Type     | Default             | Description                                                                                 |
| ------------------ | -------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `title`            | `string` | `"Test Dashboard"`  | The title of a dashboard.<br>It will be printed at the top of the markdown output.          |
| `outputPath`       | `string` | `test-dashboard.md` | The file path to output dashboard.<br>If you want to output to stdout, specify `-`.         |
| `permalinkBaseUrl` | `string` | `undefined`         | Override baseUrl of permalink.<br>See [Permalink](#Permalink) section for more information. |

### Permalink

jest-md-dashboard generates permalink to test files on GitHub (or other services) by default.

It tries to find git information from the following sources.

1. `permalinkBaseUrl` option
2. (on GitHub Actions) environment variables
3. (in git repository) repository config

#### 1. `permalinkBaseUrl` option

If `permalinkBaseUrl` is specified on jest config, jest-md-dashboard generates permalink using it.

Specify this option when if generated permalinks are incorrect.

The URL must have a trailing slash.

e.g. `https://github.com/tasshi-me/jest-md-dashboard/blob/`

#### 2. Run on GitHub Actions

If jest runs on GitHub Actions, jest-md-dashboard refers to the the [environment variables](https://docs.github.com/ja/actions/learn-github-actions/environment-variables).

#### 3. Run in git repository

If jest runs in a git repository, jest-md-dashboard refers to the local repository config.

## Contribution

We appreciate your help!

## License

- [MIT](LICENSE)
