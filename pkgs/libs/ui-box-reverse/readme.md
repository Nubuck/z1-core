# Z1 Lib UI Box Reverse

Documentation under construction.

## Usage

Install

```
yarn add @z1/lib-ui-box-reverse
```

Import

```JavaScript

import { toBox } from '@z1/lib-ui-box-reverse'

const boxProps = toBox('block border-blue-500 sm:inline-block')
/*
Outputs:
{
  display: ['block', { sm: 'inline-block' }],
  borderColor: 'blue-500'
}
*/

```
