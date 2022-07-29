import { Sequelize } from '@z1/preset-feathers-server-sql'
import { task } from '@z1/lib-api-box-core'

// export const operatorsAliases = {
//   $eq: Sequelize.Op.eq,
//   $ne: Sequelize.Op.ne,
//   $gte: Sequelize.Op.gte,
//   $gt: Sequelize.Op.gt,
//   $lte: Sequelize.Op.lte,
//   $lt: Sequelize.Op.lt,
//   $not: Sequelize.Op.not,
//   $in: Sequelize.Op.in,
//   $notIn: Sequelize.Op.notIn,
//   $is: Sequelize.Op.is,
//   $like: Sequelize.Op.like,
//   $notLike: Sequelize.Op.notLike,
//   $iLike: Sequelize.Op.iLike,
//   $notILike: Sequelize.Op.notILike,
//   $regexp: Sequelize.Op.regexp,
//   $notRegexp: Sequelize.Op.notRegexp,
//   $iRegexp: Sequelize.Op.iRegexp,
//   $notIRegexp: Sequelize.Op.notIRegexp,
//   $between: Sequelize.Op.between,
//   $notBetween: Sequelize.Op.notBetween,
//   $overlap: Sequelize.Op.overlap,
//   $contains: Sequelize.Op.contains,
//   $contained: Sequelize.Op.contained,
//   $adjacent: Sequelize.Op.adjacent,
//   $strictLeft: Sequelize.Op.strictLeft,
//   $strictRight: Sequelize.Op.strictRight,
//   $noExtendRight: Sequelize.Op.noExtendRight,
//   $noExtendLeft: Sequelize.Op.noExtendLeft,
//   $and: Sequelize.Op.and,
//   $or: Sequelize.Op.or,
//   $any: Sequelize.Op.any,
//   $all: Sequelize.Op.all,
//   $values: Sequelize.Op.values,
//   $col: Sequelize.Op.col,
//   $join: Sequelize.Op.join,
// }

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

export const createDBConnection = task(t => app => {
  const dbTools = app.get('dbTools')
  const dbConfig = dbTools.dbConfig('sequelize')
  if (t.isNil(dbConfig)) {
    return null
  }
  const baseSQLProps = {
    logging: false,
    operatorsAliases,
    define: {
      freezeTableName: true,
    },
  }
  return new Sequelize(t.mergeAll([dbConfig, baseSQLProps]))
})
