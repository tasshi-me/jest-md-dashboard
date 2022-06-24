# jest-md-dashboard

[![npm version](https://badge.fury.io/js/jest-md-dashboard.svg)](https://badge.fury.io/js/jest-md-dashboard)
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

Run jest and the markdown output is printed to stdout.

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

| Name    | Type     | Default           | Description                                                                        |
| ------- | -------- | ----------------- | ---------------------------------------------------------------------------------- |
| `title` | `string` | `Tests Dashboard` | The title of a dashboard.<br>It will be printed at the top of the markdown output. |

## Contribution

We appreciate your help!

## License

- [MIT](LICENSE)
