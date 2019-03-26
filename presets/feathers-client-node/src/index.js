// core
import feathers from '@feathersjs/feathers'
import feathersIO from './feathers-socketio'
import feathersAuth from '@feathersjs/authentication-client'
const io = require('socket.io-client')

// exports
export const Feathers = feathers
export const FeathersIO = feathersIO
export const FeathersAuth = feathersAuth
export const IO = io
// export const LocalForage = localForage