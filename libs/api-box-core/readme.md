# Z1 Lib Api Box Core

Documentation under construction.

## Usage

### Install

```JavaScript
yarn add @z1/lib-api-box-core
```
### Import

```JavaScript
import { apiBoxCore, task as Fn, fs as Fs } from '@z1/lib-api-box-core'


const apiBox = apiBoxCore(customExtensionFn())

const example = task((t, a) => {
  /*your task code here
  !Please look at the configuration section below */  
})

const fs = @z1/preset-task

```

### Configuration

- `task` now has additional [rxjs](https://rxjs-dev.firebaseapp.com/api?type=function) operators at your disposal.
  - [of](https://rxjs-dev.firebaseapp.com/api/index/function/of)
  - [fromEvent](https://rxjs-dev.firebaseapp.com/api/index/function/fromEvent)
  - [filter](https://rxjs-dev.firebaseapp.com/api/operators/filter)
  - [tap](https://rxjs-dev.firebaseapp.com/api/operators/tap)
  - [map](https://rxjs-dev.firebaseapp.com/api/operators/map)
  - [switchMap](https://rxjs-dev.firebaseapp.com/api/operators/switchMap)
  - [merge](https://rxjs-dev.firebaseapp.com/api/operators/merge)
  - [takeUntil](https://rxjs-dev.firebaseapp.com/api/operators/takeUntil)
  - [catchError](https://rxjs-dev.firebaseapp.com/api/operators/catchError)
