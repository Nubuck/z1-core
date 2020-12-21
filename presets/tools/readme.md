# Z1 Preset Tools

Documentation under construction.

## Dependencies
 - [fs-jetpack](https://github.com/szwacz/fs-jetpack)
 - [execa](https://github.com/sindresorhus/execa#readme)

## Usage

### Install
```
yarn add @z1/preset-tools
```

### Import
```JavaScript
import tx from '@z1/preset-tools'
```

### Example
```Javascript
const dirPath = tx.fs.path(path, '.roboteur')

const result = await tx.execa(
        command,
        arguments,
        opts
      )
```
