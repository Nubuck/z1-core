import fn from '@z1/preset-task'
import os from 'os'
import sysInfo from 'systeminformation'
import hasha from 'hasha'

// parts
export const hashCtx = fn((t) => async (ctx) => {
  const hashVals = t.values(ctx)
  const hashData = t.replace(
    /\s/g,
    '',
    t.tags.oneLineInlineLists`
    ${t.mapIndexed(
      (val, index) =>
        `${t.to.constantCase(val)}${
          t.eq(t.len(hashVals) - 1, index) ? '' : '_'
        }`,
      hashVals
    )}
  `
  )
  return await hasha(hashData, { algorithm: 'sha1' })
})

// main
const account = fn((t) => async ({ role, system }) => {
  const systemInfo = await sysInfo.system()
  let hardwareuuid = systemInfo.uuid
  if (t.noLen(hardwareuuid || '')) {
    const uuid = await sysInfo.uuid()
    const macs = uuid.macs || []
    hardwareuuid = `${uuid.os}${
      t.ofType('array', macs)
        ? t.replace(' ', '', t.tags.oneLineInlineLists`${macs}`)
        : macs
    }`
  }
  const machCtx = {
    hardwareuuid: t.to.lowerCase(hardwareuuid),
    serialnumber: systemInfo.serial,
    manufacturer: systemInfo.manufacturer,
    model: systemInfo.model,
  }
  // const machineHashId = await hashCtx(machCtx)
  const machineHashId = t.to.snakeCase(machCtx.hardwareuuid)
  const userCtx = {
    hardwareuuid: machCtx.hardwareuuid,
    hostname: os.hostname(),
    username: t.to.lowerCase(os.userInfo().username),
    role,
  }
  // const hashId = await hashCtx(userCtx)
  const hashId = t.to.snakeCase(
    `${userCtx.hardwareuuid}_${userCtx.role}_${userCtx.hostname}_${userCtx.username}`
  )
  const login = t.merge(t.omit(['hardwareuuid'], userCtx), {
    machineHashId,
    hashId,
    version: process.env.npm_package_version,
  })
  if (t.eq(system, true)) {
    const cpuInfo = await sysInfo.cpu()
    const timeInfo = await sysInfo.time()
    const hardwareCtx = {
      cpus: cpuInfo.physicalCores,
      cores: cpuInfo.cores,
      timezone: timeInfo.timezone,
    }
    const osInfo = await sysInfo.osInfo()
    const osCtx = {
      type: os.type(),
      platform: os.platform(),
      release: osInfo.release,
      arch: osInfo.arch,
      distro: osInfo.distro,
      hostSerialnumber: osInfo.serial,
    }
    return {
      machine: t.mergeAll([
        machCtx,
        hardwareCtx,
        osCtx,
        { hashId: machineHashId },
      ]),
      login,
    }
  }
  return {
    machine: t.mergeAll([machCtx, { hashId: machineHashId }]),
    login,
  }
})

const system = fn((t) => async (machine) => {
  const cpuInfo = await sysInfo.cpu()
  const timeInfo = await sysInfo.time()
  const hardwareCtx = {
    cpus: cpuInfo.physicalCores,
    cores: cpuInfo.cores,
    timezone: timeInfo.timezone,
  }
  const osInfo = await sysInfo.osInfo()
  const osCtx = {
    type: os.type(),
    platform: os.platform(),
    release: osInfo.release,
    arch: osInfo.arch,
    distro: osInfo.distro,
    hostSerialnumber: osInfo.serial,
  }
  return t.mergeAll([t.isNil(machine) ? {} : machine, hardwareCtx, osCtx])
})

export const machine = { account, system }

// state macro
const authStatus = {
  init: 'init',
  waiting: 'auth-waiting',
  loading: 'auth-loading',
  success: 'auth-success',
  fail: 'auth-fail',
}

export const accountState = fn((t, a) => (boxName, props = {}) => {
  const apiAt = t.atOr('api', 'apiAt', props)
  const machineAt = t.atOr('machine', 'machineAt', props)
  const role = t.atOr('machine', 'role', props)
  return {
    initial: {
      connected: false,
      status: authStatus.init,
      error: null,
      user: null,
    },
    mutations(m) {
      return [
        m(['boot'], (state, action) => {
          return t.merge(state, action.payload)
        }),
        m(['connection'], (state, action) => {
          return t.merge(state, { connected: action.payload || false })
        }),
        m('authenticate', (state) => {
          return t.merge(state, {
            status: authStatus.waiting,
            error: null,
          })
        }),
        m('authenticateComplete', (state, action) => {
          return t.merge(state, action.payload)
        }),
      ]
    },
    effects(fx, box) {
      return [
        fx(
          [box.actions.boot, box.actions.connection],
          (ctx, dispatch, done) => {
            const account = t.at(boxName, ctx.getState())
            if (
              t.or(
                t.not(account.connected),
                t.and(
                  t.eq(account.status, authStatus.success),
                  t.eq(account.connected, true)
                )
              )
            ) {
              // log.debug(t.not(account.connected) ? 'disconnected' : 'skip auth')
              done()
            } else {
              // log.debug('auth')
              dispatch(box.mutators.authenticate())
              done()
            }
          }
        ),
        fx([box.actions.authenticate], async (ctx, dispatch, done) => {
          try {
            if (
              t.not(t.pathOr(false, [boxName, 'connected'], ctx.getState()))
            ) {
              // log.debug('auth not connected')
              dispatch(
                box.mutators.authenticateComplete({
                  status: authStatus.fail,
                  user: null,
                  error: new Error('Not connected'),
                })
              )
              done()
            } else {
              const api = t.at(apiAt, ctx)
              // log.debug('re-auth begin')
              const [reAuthErr, reAuthResult] = await a.of(
                api.authentication.reAuthenticate()
              )
              if (reAuthErr) {
                // log.debug(
                // 're-auth failed -> create local machine user begin'
                // )
                const machine = t.at(machineAt, ctx)
                const [accountErr, account] = await a.of(
                  machine.account({ role })
                )
                if (accountErr) {
                  // log.debug('create local machine account failed')
                  dispatch(
                    box.mutators.authenticateComplete({
                      status: authStatus.fail,
                      user: null,
                      error: accountErr,
                    })
                  )
                  done()
                } else {
                  // log.debug(
                  //   'create local machine account -> auth begin',
                  //   account
                  // )
                  const [authErr, authResult] = await a.of(
                    api.authenticate({
                      strategy: 'machine',
                      hashId: t.at('login.hashId', account),
                    })
                  )
                  if (authErr) {
                    // log.debug(
                    //   'auth failed -> create remote machine account with sysInfo begin'
                    // )
                    const [sysErr, machineWithSys] = await a.of(
                      machine.system(account.machine)
                    )
                    const nextAccount = t.and(
                      t.isNil(sysErr),
                      t.notNil(machineWithSys)
                    )
                      ? {
                          machine: machineWithSys,
                          login: account.login,
                        }
                      : account
                    if (sysErr) {
                      // log.debug('collecting system information failed', sysErr)
                    }
                    const [remoteErr, remote] = await a.of(
                      api.service('machine-account').create(nextAccount)
                    )
                    if (remoteErr) {
                      // log.debug('create remote machine account failed')
                      dispatch(
                        box.mutators.authenticateComplete({
                          status: authStatus.fail,
                          user: null,
                          error: remoteErr,
                        })
                      )
                      done()
                    } else {
                      // log.debug(
                      //   'create remote machine user success -> next auth begin',
                      //   remote
                      // )
                      const [nextAuthErr, nextAuthResult] = await a.of(
                        api.authenticate({
                          strategy: 'machine',
                          hashId: t.at('login.hashId', remote),
                        })
                      )
                      if (nextAuthErr) {
                        // log.debug('next auth failed')
                        dispatch(
                          box.mutators.authenticateComplete({
                            status: authStatus.fail,
                            user: null,
                            error: nextAuthErr,
                          })
                        )
                        done()
                      } else {
                        // log.debug('next auth success', nextAuthResult)
                        dispatch(
                          box.mutators.authenticateComplete({
                            status: authStatus.success,
                            user: t.at('user', nextAuthResult),
                            error: null,
                          })
                        )
                        done()
                      }
                    }
                  } else {
                    // log.debug('auth success', authResult)
                    dispatch(
                      box.mutators.authenticateComplete({
                        status: authStatus.success,
                        user: t.at('user', authResult),
                        error: null,
                      })
                    )
                    done()
                  }
                }
              } else {
                // log.debug('re-auth success')
                dispatch(
                  box.mutators.authenticateComplete({
                    status: authStatus.success,
                    user: t.at('user', reAuthResult),
                    error: null,
                  })
                )
                done()
              }
            }
          } catch (e) {
            // log.debug('AUTH ERR', e)
            dispatch(
              box.mutators.authenticateComplete({
                status: authStatus.fail,
                user: null,
                error: e,
              })
            )
            done()
          }
        }),
      ]
    },
    onInit(ctx) {
      ctx.dispatch(ctx.mutators.boot())
      const api = t.at(apiAt, ctx)
      api.io.on('connect', () => {
        ctx.dispatch(ctx.mutators.connection(true))
      })
      api.io.on('disconnect', () => {
        ctx.dispatch(ctx.mutators.connection(false))
      })
    },
  }
})
