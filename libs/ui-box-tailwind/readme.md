# Z1 Lib UI Box Tailwind

Documentation under construction.

## Usage

Install

```
yarn add @z1/lib-ui-box-tailwind
```

Import

```JavaScript

import { toCss, uiBox } from '@z1/lib-ui-box-tailwind'

const classNames = toCss({
  display: ['block', { sm: 'inline-block' }],
  borderColor: 'blue-500'
})
/*
Outputs:
block border-blue-500 sm:inline-block
*/

```
