// core
import feathers from '@feathersjs/feathers'
import feathersIO from '@feathersjs/socketio-client'
import feathersAuth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

// exports
export const Feathers = feathers
export const FeathersIO = feathersIO
export const FeathersAuth = feathersAuth
export const IO = io
// export const LocalForage = localForage