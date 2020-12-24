# Z1 Preset Feathers Server Nedb

Documentation under construction.

## Dependencies

- [nedb](https://github.com/louischatriot/nedb#creatingloading-a-database)
- [featers-nedb](https://github.com/feathersjs-ecosystem/feathers-nedb)

## Usage

### Install

```
yarn add @z1/preset-feathers-server-nedb
```

### Import
```JavaScript

import {  
  Nedb,
  FeathersNedb
} from '@z1/preset-feathers-server-nedb'

```

### Example
```Javascript

const model = new Nedb(options)

app.use(`${path}`, FeathersNedb({ Model, id, events, paginate }))

```
