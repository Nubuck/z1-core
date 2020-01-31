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
            data: t.match({
              _: () => props.data,
              [ctx.event.dataLoadComplete]: () =>
                t.merge(
                  props.data,
                  {
                    machines: t.atOr(
                      props.data.machines,
                      'next.data.machines',
                      props
                    ),
                  },
                  props.event
                ),
              [ctx.event.dataChange]: () => {
                const entity = t.at('next.entity', props)
                const change = t.at('next.change', props)
                const machines = t.at('data.machines', props)
                if (t.eq('machine', entity)) {
                  const machine = t.at('next.machine', props)
                  return t.merge(props.data, {
                    machines: t.match({
                      _: () => machines,
                      created: () => t.append(machine, machines),
                      patched: () => {
                        return t.update(
                          t.findIndex(
                            current => t.eq(current._id, machine._id),
                            machines
                          ),
                          machine,
                          machines
                        )
                      },
                    })(change)(),
                  })
                }
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
                        logins: t.match({
                          _: () => machine.logins,
                          patched: () => {
                            const loginIndex = t.findIndex(
                              current => t.eq(current._id, login._id),
                              logins
                            )
                            return t.update(loginIndex, login, logins)
                          },
                          created: () => t.append(login, logins),
                        })(change)(),
                      }),
                    machines
                  ),
                })
              },
            })(props.event)(),
            error: t.atOr(null, 'next.error', props),
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
          const machineCreated$ = rx.fromEvent(
            props.api.service('machines'),
            'created'
          )
          const loginPatched$ = rx.fromEvent(
            props.api.service('machine-logins'),
            'patched'
          )
          const loginCreated$ = rx.fromEvent(
            props.api.service('machine-logins'),
            'created'
          )
          return loginPatched$.pipe(
            rx.merge(
              machineCreated$.pipe(
                rx.map(machine => ({
                  machine,
                  change: 'created',
                  entity: 'machine',
                }))
              ),
              loginCreated$.pipe(
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
            rx.map(login =>
              props.mutators.dataChange(
                t.eq('created', t.at('change', login))
                  ? login
                  : { login, change: 'patched', entity: 'login' }
              )
            )
          )
        },
      }
    },
    ui(ctx) {
      return props => {
        const items = t.atOr([], 'state.data.machines', props)
        return (
          <ctx.Page
            key="machines"
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{ name: 'laptop', size: '3xl', color: 'blue-500' }}
                  label={{
                    fontWeight: 'bold',
                    text: 'Machines',
                    fontSize: 'xl',
                  }}
                  margin={{ bottom: 4 }}
                />
                <ctx.VList
                  items={items}
                  rowHeight={({ index }) => {
                    const item = items[index]
                    if (t.isNil(item)) {
                      return 50
                    }
                    return 50 + 70 * t.len(item.logins || [])
                  }}
                  render={(machine, rowProps) => {
                    return (
                      <ctx.ListItem
                        key={rowProps.key}
                        style={rowProps.style}
                        avatar={{ icon: 'laptop' }}
                        title={{
                          label: `${machine.manufacturer} - ${machine.model} - ${machine.serialnumber}`,
                        }}
                        stamp={{
                          label: {
                            text: ctx
                              .dateFn(machine.updatedAt)
                              .format('YYYY MM-DD HH:mm:ss A'),
                            fontSize: 'xs',
                          },
                        }}
                        nested={
                          <ctx.MapIndexed
                            items={machine.logins || []}
                            render={(login, index) => {
                              return (
                                <ctx.ListItem
                                  key={`nested_${index}`}
                                  avatar={{ icon: 'user', size: 'xs' }}
                                  title={{
                                    label: {
                                      text: `${login.hostname} - ${login.username}`,
                                      fontSize: 'sm',
                                      margin: { bottom: 2 },
                                    },
                                  }}
                                  subtitle={{
                                    icon: { name: 'power-off', size: 'md' },
                                    label: {
                                      text: login.status,
                                      fontSize: 'xs',
                                    },
                                    color: t.eq(login.status, 'online')
                                      ? 'green-500'
                                      : 'red-500',
                                  }}
                                  stamp={{
                                    label: {
                                      text: ctx
                                        .dateFn(login.updatedAt)
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
                                  padding={{ left: 1, top: 2 }}
                                  width="full"
                                />
                              )
                            }}
                          />
                        }
                      />
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
