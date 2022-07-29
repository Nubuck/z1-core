# Z1 Preset Feathers Server SQL

Documentation under construction.

## Dependencies
 - [sequelize](https://sequelize.org/)
 - [sqlite3](https://github.com/mapbox/node-sqlite3)
 - [feathers-knex](https://github.com/feathersjs-ecosystem/feathers-knex)
 - [feathers-sequelize](https://github.com/feathersjs-ecosystem/feathers-sequelize)
 - [knex](https://knexjs.org/)
 - [mysql](https://github.com/mysqljs/mysql#readme)
 - [mysql2](https://github.com/sidorares/node-mysql2#readme)
 - [pg](https://github.com/brianc/node-postgres)
 - [pg-hstore](https://github.com/scarney81/pg-hstore)

## Usage

### Install

```
yarn add @z1/preset-feathers-server-sql
```

### Import
```JavaScript
import {  
  Knex,
  FeathersKnex,
  Sequelize,
  FeathersSequelize
} from '@z1/preset-feathers-server-sql'
```

### Example
```Javascript

var knex = Knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  }
});

app.use(`/${path}`, FeathersKnex(
  { Model, name, id, events, paginate })
)

const sequelize = new Sequelize('sqlite::memory:');

app.use(`/${path}`, FeathersSequelize(
  { Model, id, events, paginate })
)




```
