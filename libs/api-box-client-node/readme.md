# Z1 Lib Api Box Client Client Node

Feathers service in a macro

Documentation under construction.

## Usage

### Install

```
yarn add @z1/lib-api-box-client-node
```

### Import

```JavaScript

import Api from '@z1/lib-api-box-client-node'

const api = Api({
  storageOptions: {
    dir:`endpointURL`
  }
})

```

### Configuration

- `storageOptions`: object (optional)

```JavaScript
const storageOptions = {
  dir: ``, //(required)
  ttl: number > 0, //(optional)
  logging: () => { /* external logging fn */ } //(optional)
}

```
