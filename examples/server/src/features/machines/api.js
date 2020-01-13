import zbx from '@z1/lib-feature-box-server'

export const api = zbx.api.create('machines', [
  {
    models(m) {
      m(['nedb', 'machines'])
      m(['sequelize', 'machines_sql'], (define, T) =>
        define({
          name: {
            type: T.STRING,
          },
        }, {})
      )
    },
    services(s, h) {
      s(
        ['nedb', 'machines'],
        { modelName: 'machines' },
        {
          hooks: {
            before: {
              all: [h.auth.authenticate('jwt')],
            },
          },
        }
      )
      s(
        ['sequelize', 'machines-sql'],
        { modelName: 'machines_sql' },
        {
          hooks: {
            before: {
              all: [h.auth.authenticate('jwt')],
            },
          },
        }
      )
    },
    lifecycle:{
      onSync(app){
        app.log('Machines booted')
      }
    }
  },
])
