# Z1 Lib SPA Server

Documentation under construction.

## Usage

Install

```
yarn add @z1/lib-spa-server
```

Usage

```JavaScript

import spa from '@z1/lib-spa-server'

const app = spa({ sitePath: 'site' })
app.listen(3030, () =>
  console.log('SPA server running on http://localhost:3030')
)

```
