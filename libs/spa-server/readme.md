# Z1 Lib SPA Server

Documentation under construction.

## Usage

Install

```
yarn add @z1/lib-spa-server
```

Usage

```JavaScript

import { createAppServer } from '@z1/lib-spa-server'

const app = createAppServer({ appFolderName: 'site' })
app.listen(3030, () =>
  console.log('SPA server running on http://localhost:3030')
)

```
