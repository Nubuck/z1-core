import { task } from '@z1/lib-feature-box-server-core'
import Strategy from 'passport-custom'

// const { Unprocessable, NotAuthenticated } = FeathersErrors

// strategy
export const machineAuthStrategy = task((t, a) => (app, { FeathersErrors }) => {
  const verifyMachine = async (req, done) => {
    const payloadErrorMsg =
      'Machine account authentication requires a hashId field'
    if (t.not(t.has('hashId')(req.body))) {
      return done(new FeathersErrors.Unprocessable(payloadErrorMsg))
    }
    if (t.isZeroLen(req.body.hashId)) {
      return done(new FeathersErrors.Unprocessable(payloadErrorMsg))
    }
    const [findMachineError, findMachineResult] = await a.of(
      app.service('machines').find({
        query: {
          hashId: req.body.hashId,
        },
      })
    )
    if (findMachineError) {
      return done(findMachineError)
    }
    const invalidErrorMsg = 'Invalid Login'
    if (t.isNil(findMachineResult)) {
      return done(new FeathersErrors.NotAuthenticated(invalidErrorMsg))
    }
    if (t.eq(findMachineResult.total, 0)) {
      return done(new FeathersErrors.NotAuthenticated(invalidErrorMsg))
    }
    const machine = t.head(findMachineResult.data)
    return done(null, machine, { machineId: machine._id })
  }
  // register the strategy in the app.passport instance
  app.passport.use('machine', new Strategy(verifyMachine))
})

// hooks
export const machineAuthHooks = task(t => ({ common, auth }, config) => {
  return {
    before: {
      create: [
        common.when(
          common.isProvider('external'),
          common
            .when(
              // condition
              ctx => t.eq(t.pathOr(null, ['data', 'strategy'], ctx), 'machine'),
              // result true hooks
              auth.authenticate('machine')
            )
            .else(
              // result false hooks
              auth.authenticate(config.strategies || ['jwt', 'local'])
            )
        ),
      ],
      remove: [auth.authenticate('jwt')],
    },
  }
})
