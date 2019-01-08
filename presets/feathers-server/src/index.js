// core
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import socketIO from '@feathersjs/socketio'
import errors from '@feathersjs/errors'
import config from '@feathersjs/configuration'

// auth
import auth from '@feathersjs/authentication'
import authJWT from '@feathersjs/authentication-jwt'
import authLocal from '@feathersjs/authentication-local'

// db
import sequelize from 'sequelize'
import feathersSequelize from 'feathers-sequelize'

// eco-system + plus
import logger from 'feathers-logger'
import commonHooks from 'feathers-hooks-common'
import authHooks from 'feathers-authentication-hooks'

// other
import cors from 'cors'
import compression from 'compression'
import winston from 'winston'

//exports
export const Feathers = feathers
export const FeathersExpress = express
export const FeathersSocketIO = socketIO
export const FeathersErrors = errors
export const FeathersConfig = config
export const FeathersAuth = auth
export const FeathersAuthJWT = authJWT
export const FeathersAuthLocal = authLocal
export const Sequelize = sequelize
export const FeathersSequelize = feathersSequelize
export const FeathersLogger = logger
export const FeathersCommonHooks = commonHooks
export const FeathersAuthHooks = authHooks
export const Cors = cors
export const Compression = compression
export const Winston = winston

// helpers
export function plug(factory) {
  return function () {
    const app = this
    factory(app)
  }
}