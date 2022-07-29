import { task } from '@z1/preset-task'

// main
export const channel = task(t => ({
  config: channelList => app => {
    if (typeof app.channel !== 'function') {
      // If no real-time functionality has been configured just return
      return
    }

    app.on('connection', connection => {
      // On a new real-time connection, add it to the anonymous channel
      app.channel('anonymous').join(connection)
    })

    app.on('disconnect', connection => {
      // Do something on disconnect here
      // app.channel('anonymous').leave(connection)
    })

    app.on('login', (authResult, { connection }) => {
      // connection can be undefined if there is no
      // real-time connection, e.g. when logging in via REST
      if (connection) {
        // Obtain the logged in user from the connection
        // const user = connection.user;

        // The connection is no longer anonymous, remove it
        app.channel('anonymous').leave(connection)

        // Add it to the authenticated user channel
        app.channel('authenticated').join(connection)

        // Channels can be named anything and joined on any condition

        // E.g. to send real-time events only to admins use
        // if(user.isAdmin) { app.channel('admins').join(connection); }

        // If the user has joined e.g. chat rooms
        // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(channel));

        // Easily organize users by email and userid for things like messaging
        // app.channel(`emails/${user.email}`).join(channel);
        // app.channel(`userIds/$(user.id}`).join(channel);
      }
    })

    // eslint-disable-next-line no-unused-vars
    app.publish((data, hook) => {
      // Here you can add event publishers to channels set up in `channels.js`
      // To publish only for a specific event use `app.publish(eventname, () => {})`
      // e.g. to publish all service events to all authenticated users use
      return app.channel('authenticated')
    })

    // NOTE: Temp solution
    t.forEach(channel => {
      channel(app)
    }, channelList || [])
  },
}))
