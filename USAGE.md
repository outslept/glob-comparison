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


