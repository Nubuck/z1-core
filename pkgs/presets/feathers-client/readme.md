# Z1 Preset Feathers Client

Can be used in both node and electron.

## Dependencies

- [@feathersjs/feathers](https://feathersjs.com/)
- [@feathersjs/socketio-client](https://github.com/feathersjs/feathers/tree/dove/packages/socketio)
- [@feathersjs/authentication-client](https://github.com/feathersjs/feathers/tree/dove/packages/authentication-client)
- [socket.io-client](https://socket.io/docs/v3/client-api/index.html)

## Usage

### Install

```
yarn add @z1/preset-feathers-client
```

### Import
```JavaScript
import {  
  Feathers,
  FeathersIO,
  FeathersAuth,
  IO
} from '@z1/preset-feathers-client'

```

### Example
```Javascript
// Feathers
const app = Feathers();

// FeathersIO
app.configure(FeathersIO());

// FeathersAuth
const authentication = new FeathersAuth.AuthenticationService(app)
authentication.register('jwt', new FeathersAuth.JWTStrategy())

// IO
const socket = IO("http://localhost:3035", {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123"
  }
});
```
