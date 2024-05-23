# Z1 conventions


```
/apps
  - /[app name]
    - /[platform: web | server | desktop | mobile | cli | universal]
      - /src
        - /features
        - /parts
        - main.(js | ts)


```

## server features
```
/[feature name]
  - /parts
    - /[part name]
      - models.(js | ts)
      - services.(js | ts)
      - lifecycle.(js | ts)
  - main.(js | ts)

```

## web features
```
/[feature name]
  - /parts
    - /universal
    - /state
    - /ui
  - /views
    - /[view name]
      - /state
        - data.(js | ts)
        - form.(js | ts)
        - load.(js | ts)
        - modal.(js | ts)
        - transmit.(js | ts)
        - subcribe.(js | ts)
      - /ui
        - [component name].(jsx | tsx)
        - layout.(jsx | tsx)
      - main.(js | ts)
  - main.(js | ts)
```

## web complex view
```
/[view name]
  - /parts
    - [part name]
      - /state
        - data.(js | ts)
        - form.(js | ts)
        - load.(js | ts)
        - modal.(js | ts)
        - transmit.(js | ts)
        - subcribe.(js | ts)
      - /ui
        - [component name].(jsx | tsx)
        - layout.(jsx | tsx)
  - main.(js | ts)
```