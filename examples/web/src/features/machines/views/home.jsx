import React from 'react'
import mx from '@z1/lib-feature-macros'

// main
export const home = mx.fn((t, a, rx) =>
  mx.view.create('home', {
    state(ctx) {
      return {
        initial: {
          data: {
            machines: [],
          },
        },
        data(props) {
          return {
            status: props.status,
            error: t.atOr(null, 'next.error', props),
            data: t.runMatch({
              _: () => props.data,
              [ctx.event.dataLoadComplete]: () =>
                t.merge(props.data, {
                  machines: t.atOr(
                    props.data.machines,
                    'next.data.machines',
                    props
                  ),
                }),
              [ctx.event.dataChange]: () => {
                // events from subscribe
                const change = t.at('next.change', props)
                const machines = t.at('data.machines', props)
                // machine events
                if (t.eq('machine', t.at('next.entity', props))) {
                  const machine = t.at('next.machine', props)
                  return t.merge(props.data, {
                    machines: t.runMatch({
                      _: () => machines,
                      created: () => t.append(machine, machines),
                      patched: () =>
                        t.update(
                          t.findIndex(
                            current => t.eq(current._id, machine._id),
                            machines
                          ),
                          machine,
                          machines
                        ),
                    })(change),
                  })
                }
                // login events
                const login = t.at('next.login', props)
                const machineIndex = t.findIndex(
                  machine => t.eq(machine._id, login.machineId),
                  machines
                )
                if (t.eq(machineIndex, -1)) {
                  return props.data
                }
                const logins = t.atOr(
                  [],
                  'logins',
                  machines[machineIndex] || {}
                )
                return t.merge(props.data, {
                  machines: t.adjust(
                    machineIndex,
                    machine =>
                      t.merge(machine, {
                        logins: t.runMatch({
                          _: () => machine.logins,
                          patched: () =>
                            t.update(
                              t.findIndex(
                                current => t.eq(current._id, login._id),
                                logins
                              ),
                              login,
                              logins
                            ),
                          created: () => t.append(login, logins),
                        })(change),
                      }),
                    machines
                  ),
                })
              },
            })(props.event),
          }
        },
        async load(props) {
          const [machErr, machines] = await a.of(
            props.api.service('machines').find({
              query: {
                $limit: 10000,
              },
            })
          )
          if (machErr) {
            return {
              status: props.status,
              data: {
                machines: [],
              },
              error: machErr,
            }
          }
          return {
            status: props.status,
            data: {
              machines: machines.data,
            },
            error: null,
          }
        },
        subscribe(props) {
          const loginService = props.api.service('machine-logins')
          const machineService = props.api.service('machines')
          return rx.fromEvent(loginService, 'patched').pipe(
            rx.merge(
              rx.fromEvent(machineService, 'created').pipe(
                rx.map(machine => ({
                  machine,
                  change: 'created',
                  entity: 'machine',
                }))
              ),
              rx.fromEvent(loginService, 'created').pipe(
                rx.map(machineOrlogin =>
                  t.eq('machine', t.at('entity', machineOrlogin))
                    ? machineOrlogin
                    : {
                        login: machineOrlogin,
                        change: 'created',
                        entity: 'login',
                      }
                )
              )
            ),
            rx.map(machineOrlogin =>
              props.mutators.dataChange(
                t.or(
                  t.eq('created', t.at('change', machineOrlogin)),
                  t.eq('machine', t.at('entity', machineOrlogin))
                )
                  ? machineOrlogin
                  : {
                      login: machineOrlogin,
                      change: 'patched',
                      entity: 'login',
                    }
              )
            )
          )
        },
      }
    },
    ui(ctx) {
      const loginIcon = t.match({
        _: 'user-astronaut',
        agent: 'user-secret',
        bot: 'robot',
        robot: 'robot',
        service: 'terminal',
        supervisor: 'user-shield',
      })
      const machineIcon = (distro = '') => {
        if (t.includes('windows', t.to.lowerCase(distro))) {
          return 'windows'
        }
        if (t.includes('apple', t.to.lowerCase(distro))) {
          return 'apple'
        }
        if (t.includes('linux', t.to.lowerCase(distro))) {
          return 'linux'
        }
        return 'laptop'
      }
      return props => {
        const machines = t.atOr([], 'state.data.machines', props)
        return (
          <ctx.Page
            key="machines"
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{ name: 'laptop', size: '3xl', color: 'blue-500' }}
                  label={{
                    text: 'Machines',
                    fontWeight: 'bold',
                    fontSize: 'xl',
                  }}
                  margin={{ bottom: 4 }}
                />
                <ctx.VList
                  items={machines}
                  rowHeight={({ index }) => {
                    const machine = machines[index]
                    if (t.isNil(machine)) {
                      return 50
                    }
                    return 70 * t.len(t.atOr([], 'logins', machine)) + 50
                  }}
                  render={(machine, rowProps) => {
                    return (
                      <ctx.ListItem
                        key={rowProps.key}
                        style={rowProps.style}
                        avatar={{
                          icon: machineIcon(machine.distro),
                          fill: 'solid',
                          color: 'blue-500',
                        }}
                        title={{
                          label: {
                            text: machine.alias,
                            fontSize: 'md',
                            margin: { bottom: 2 },
                          },
                          info: {
                            text: `${machine.distro} v${machine.release}`,
                            fontSize: 'sm',
                            color: 'gray-400',
                          },
                        }}
                        stamp={{
                          label: {
                            text: ctx
                              .dateFn(machine.updatedAt)
                              .format('YYYY MM-DD HH:mm:ss A'),
                            fontSize: 'xs',
                          },
                          margin: { bottom: 2 },
                        }}
                        buttons={[
                          {
                            icon: 'gear',
                            shape: 'circle',
                            fill: 'ghost-solid',
                            size: 'xs',
                            color: 'blue-500',
                          },
                        ]}
                        bgColor={[null, { hover: 'gray-800' }]}
                      >
                        <ctx.MapIndexed
                          items={t.atOr([], 'logins', machine)}
                          render={(login, index) => {
                            return (
                              <ctx.ListItem
                                key={`nested_login_${login._id}_${index}`}
                                avatar={{
                                  icon: loginIcon(login.role),
                                  size: 'xs',
                                  fill: 'solid',
                                  colors: {
                                    on: {
                                      bg: 'yellow-500',
                                      content: 'gray-900',
                                    },
                                  },
                                }}
                                title={{
                                  label: {
                                    text: login.role,
                                    fontSize: 'md',
                                    color: 'yellow-500',
                                    margin: { bottom: 2 },
                                  },
                                  info: {
                                    text: login.alias,
                                    fontSize: 'sm',
                                  },
                                }}
                                stamp={{
                                  icon: { name: 'power-off', size: 'md' },
                                  label: {
                                    text: login.status,
                                    fontSize: 'sm',
                                  },
                                  color: t.eq(login.status, 'online')
                                    ? 'green-500'
                                    : 'red-500',
                                  info: {
                                    // text: ctx
                                    //   .dateFn(login.updatedAt)
                                    //   .format('YYYY MM-DD HH:mm:ss A'),
                                    // fontSize: 'xs',
                                  },
                                  margin: { bottom: 2 },
                                }}
                                buttons={[
                                  {
                                    icon: 'gear',
                                    shape: 'circle',
                                    fill: 'ghost-solid',
                                    size: 'xs',
                                    color: 'blue-500',
                                  },
                                ]}
                                padding={{ left: 1, top: 2 }}
                                width="full"
                              />
                            )
                          }}
                        />
                      </ctx.ListItem>
                    )
                  }}
                />
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
