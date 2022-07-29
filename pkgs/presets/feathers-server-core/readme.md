# Z1 Preset Feathers Server Core

Documentation under construction.

## Dependencies

- [@feathersjs/feathers](https://feathersjs.com/)
- [@feathersjs/express](https://github.com/feathersjs/feathers/tree/dove/packages/express)
- [@feathersjs/socketio](https://github.com/feathersjs/feathers/tree/dove/packages/socketio)
- [@feathersjs/errors](https://github.com/feathersjs/feathers/tree/dove/packages/errors)
- [@feathersjs/configuration](https://github.com/feathersjs/feathers/tree/dove/packages/configuration)
- [@feathersjs/authentication](https://github.com/feathersjs/feathers/tree/dove/packages/authentication)
- [@feathersjs/authentication-local](https://github.com/feathersjs/feathers/tree/dove/packages/authentication-local)
- [@feathersjs/authentication-oauth](https://github.com/feathersjs/feathers/tree/dove/packages/authentication-oauth)
- [feathers-hooks-common](https://github.com/feathersjs-ecosystem/feathers-hooks-common#readme)
- [feathers-authentication-hooks](https://github.com/feathersjs-ecosystem/feathers-authentication-hooks)
- [cors](https://github.com/expressjs/cors#readme)
- [compression](https://github.com/expressjs/compression#readme)
- [winston](https://github.com/winstonjs/winston)

## Usage

### Install

```
yarn add @z1/preset-feathers-server-core
```

### Import
```JavaScript

import {  
  Feathers,
  FeathersExpress,
  FeathersSocketIO,
  FeathersErrors,
  FeathersConfig,
  FeathersAuth,
  FeathersAuthLocal,
  FeathersOAuth,
  FeathersLogger,
  FeathersCommonHooks,
  FeathersAuthHooks,
  Cors,
  Compression,
  Winston
} from '@z1/preset-feathers-server-core'

```

### Example
```Javascript

// Feathers
const app = Feathers();

// FeathersExpress
const app = FeathersExpress(Feathers());

// FeathersSocketIO
app.configure(FeathersSocketIO());

// FeathersConfig
app.configure(FeathersConfig())

// FeathersErrors
if(!condition)
  throw new FeathersErrors.NotFound('User does not exist');

if(!condition)
  throw new FeathersErrors.GeneralError(`${message}`);

// FeathersAuth

const authentication = new FeathersAuth.AuthenticationService(app)
authentication.register('jwt', new FeathersAuth.JWTStrategy())
authentication.register('local', new FeathersAuthLocal.LocalStrategy())
app.set('authenticationService', authentication)

// FeathersOAuth
app.configure(FeathersOAuth.expressOauth())


// FeathersLogger
app.configure(FeathersLogger())


// FeathersCommonHooks
const hooks = {
  before: {
    all: FeathersCommonHooks.cache(cacheMap)
  },
  after: {
    all: FeathersCommonHooks.cache(cacheMap)
  }
}

// FeathersAuthHooks
app.service('users').hooks({
  before: {
    all: [
      FeathersAuth.JWTStrategy(),
      FeathersAuthHooks.setField({
        from: 'params.user.id',
        as: 'params.query.id'
      })
    ]
  }
})

// Cors
app.use(Cors())

// Compression
app.use(Compression({ filter: Boolean }))

// Winston
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

const logger = Winston.createLogger({
  level: levels,
  levels: Winston.config.npm.levels,
  format: Winston.format.json,
  transports: Array,
  exitOnError: Boolean,
  silent: Boolean
});

```
