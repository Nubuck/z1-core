# Z1 conventions


```
/apps
  - /[app name]
    - /[platform: web | server | desktop | mobile | cli | universal]
      - /src
        - /features
        - /parts
        - main


```

## server
```
/[feature name]
  - /parts
    - /[part name]
      - models
      - services
      - lifecycle
  - main

```

## web
```
/[feature name]
  - /parts
    - universal
    - state
    - ui
  - /views
    - /[view name]
      - /state
        - data
        - form
        - load
        - modal
        - transmit
        - sub
      - /ui
        - [component name]
        - layout
      - main
  - main
```