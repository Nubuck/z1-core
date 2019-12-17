const apiBox = {}

const account = apiBox.create({
  name: 'account',
  models(m) {
    return [
      m(['nedb', 'user']),
      m(['sequelize', 'user'], lib => ({})),
      m(['knex', 'user'], async db => {}),
    ]
  },
  services(s, h) {
    return [
      s(['nedb', 'users'], m => ({ Model: m.uesr }), {
        hooks: {
          before: {},
        },
      }),
      s(
        ['sequelize', 'users'],
        m => ({
          Model: m.users,
        }),
        {}
      ),
      s(['knex', 'users'], { name: 'user' }, {}),
    ]
  },
  lifecycle: {},
})

const accountComp = apiBox.compose({ name: 'accountComp' }, [
  {
    models(m) {
      return [m(['nedb', 'user'])]
    },
    services(s, h) {
      return [
        s(['nedb', 'users'], m => ({ Model: m.uesr }), {
          hooks: {
            before: {},
          },
        }),
      ]
    },
    lifecycle: {},
  },
  {
    models(m) {
      return [m(['sequelize', 'user'], lib => ({}))]
    },
    services(s, h) {
      return [
        s(
          ['sequelize', 'users'],
          m => ({
            Model: m.users,
          }),
          {}
        ),
      ]
    },
    lifecycle: {},
  },
  {
    models(m) {
      return [m(['knex', 'user'], async db => {})]
    },
    services(s, h) {
      return [s(['knex', 'users'], { name: 'user' }, {})]
    },
    lifecycle: {},
  },
])

const boxes = apiBox.combine([account, accountComp])

// const api = apiBox.api.create({})



// let app = apiBox.server.app.create({
//   boxes,
//   namespace: 'api',
// })

// if (module.hot) {
//   module.hot.accept(['.'], () => {
//     app = apiBox.server.app.reload(app, { boxes })
//   })
// }

// let app = apiBox.server.api.create({
//   boxes,
//   namespace:'api'
// })

// let server = apiBox.server.api.run(app)

// if (module.hot) {
//   module.hot.accept(['.'], () => {
//     app = apiBox.server.api.reload(app, { boxes })
//   })
// }
