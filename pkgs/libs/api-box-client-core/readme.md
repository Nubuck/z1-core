# Z1 Lib Api Box Client Core

Feathers service in a macro

Documentation under construction.

## Usage

Install

```
yarn add @z1/lib-api-box-client-core
```

Import

```JavaScript

import api from '@z1/lib-api-box-client-core'

const api = api({ path: `endpointURL` })

```

### Configuration

- `path`: string (required)
- `options`: { } IO socket options (optional)
- `timeout`: number (optional) IO Socket timeout if call fails
- `storage`: Authentication client storage (default: `localStorage` if available, `MemoryStorage` otherwise)
- `auth`: [config](optional)
- `configure`: [callback function](optional)

[config]: https://docs.feathersjs.com/api/authentication/client.html#configuration
[callback function]: https://docs.feathersjs.com/api/application.html#configure-callback
