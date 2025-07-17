# Running glob library tests

## Setup

1. **Check Node.js version**

```sh
node --version
# should show somewhat latest version
```

2. Update node.js needed

```sh
mise install node@24.4.1
mise use node@24.4.1
```

> Note: I wanted to use the latest available Node version (24.4.1) because `node:fs` glob functionality is experimental and I wanted to get the most of it as it's evolving rapidly.

3. Install dependencies

```sh
pnpm install
```

## Run Tests

1. Build project

```
pnpm build
```

2. Run tests

```sh
node dist/tests/asterisk.js
```


