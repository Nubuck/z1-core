import { task } from '@z1/preset-task'
import { Sequelize } from '@z1/preset-feathers-server-sql'
import * as ApiBox from '@z1/lib-api-box-core'

// defs
export const operatorsAliases = {
  $eq: Sequelize.Op.eq,
  $ne: Sequelize.Op.ne,
  $gte: Sequelize.Op.gte,
  $gt: Sequelize.Op.gt,
  $lte: Sequelize.Op.lte,
  $lt: Sequelize.Op.lt,
  $not: Sequelize.Op.not,
  $in: Sequelize.Op.in,
  $notIn: Sequelize.Op.notIn,
  $is: Sequelize.Op.is,
  $like: Sequelize.Op.like,
  $notLike: Sequelize.Op.notLike,
  $iLike: Sequelize.Op.iLike,
  $notILike: Sequelize.Op.notILike,
  $regexp: Sequelize.Op.regexp,
  $notRegexp: Sequelize.Op.notRegexp,
  $iRegexp: Sequelize.Op.iRegexp,
  $notIRegexp: Sequelize.Op.notIRegexp,
  $between: Sequelize.Op.between,
  $notBetween: Sequelize.Op.notBetween,
  $overlap: Sequelize.Op.overlap,
  $contains: Sequelize.Op.contains,
  $contained: Sequelize.Op.contained,
  $adjacent: Sequelize.Op.adjacent,
  $strictLeft: Sequelize.Op.strictLeft,
  $strictRight: Sequelize.Op.strictRight,
  $noExtendRight: Sequelize.Op.noExtendRight,
  $noExtendLeft: Sequelize.Op.noExtendLeft,
  $and: Sequelize.Op.and,
  $or: Sequelize.Op.or,
  $any: Sequelize.Op.any,
  $all: Sequelize.Op.all,
  $values: Sequelize.Op.values,
  $col: Sequelize.Op.col,
  $join: Sequelize.Op.join,
}

// main
const createModel = task(t => (name, props, options = {}) => define => {
  if (t.has('associate')(options)) {
    const model = define(name, props, t.omit(['associate'], options))
    model.associate = options.associate
    return model
  }
  return define(name, props, options)
})

const createDBConnection = task(t => app => {
  const db = app.get('db')
  const dbConfig = app.get(db.dialect)
  if (t.not(dbConfig)) {
    return null
  }
  const baseSQLProps = {
    logging: false,
    operatorsAliases,
    define: {
      freezeTableName: true,
    },
  }
  if (t.isType(dbConfig, 'Object')) {
    return new Sequelize(t.mergeAll([dbConfig, baseSQLProps, db]))
  } else {
    return new Sequelize(
      dbConfig,
      t.merge(baseSQLProps, { dialect: db.dialect })
    )
  }
})
