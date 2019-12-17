// core
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import socketIO from '@feathersjs/socketio'
import errors from '@feathersjs/errors'
import config from '@feathersjs/configuration'

// auth
import auth from '@feathersjs/authentication'
import authLocal from '@feathersjs/authentication-local'
import authO from '@feathersjs/authentication-oauth'

// eco-system + plus
import { Logger } from './logger'
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
export const FeathersAuthLocal = authLocal
export const FeathersOAuth = authO
export const FeathersLogger = Logger
export const FeathersCommonHooks = commonHooks
export const FeathersAuthHooks = authHooks
export const Cors = cors
export const Compression = compression
export const Winston = winston

// helpers
export function plug(factory) {
  return function() {
    const app = this
    factory(app)
  }
}
