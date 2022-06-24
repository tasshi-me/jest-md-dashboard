# jest-md-dashboard

> Generating a pretty Markdown dashboard for Jest

## Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
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

## Contribution

We appreciate your help!

## License

- [MIT](LICENSE)
