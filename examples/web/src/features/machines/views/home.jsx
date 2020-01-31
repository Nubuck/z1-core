import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// main
export const home = mx.fn((t, a, rx) =>
  mx.view.create('home', {
    state() {
      const { types } = mx.view
      return {
        initial: {
          data: {
            machines: [],
          },
          form: {},
        },
        data(props) {
          console.log('Machines VIEW DATA', props)
          return {
            status: props.status,
            data: t.merge(props.data, {
              machines: t.atOr(
                props.data.machines,
                'next.data.machines',
                props
              ),
            }),
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
          console.log('SUBSCRIBE', t.keys(props))
          const patched$ = rx.fromEvent(
            props.api.service('machine-logins'),
            'patched'
          )
          const created$ = rx.fromEvent(
            props.api.service('machine-logins'),
            'created'
          )
          return patched$.pipe(
            rx.merge(
              created$.pipe(
                rx.map(created => ({
                  data: { item: created, event: 'created' },
                }))
              )
            ),
            rx.map(patchedOrCreated =>
              t.eq(t.at('data.event', patchedOrCreated), 'created')
                ? props.mutators.dataChange(patchedOrCreated)
                : props.mutators.dataChange({
                    data: { item: patchedOrCreated, event: 'patched' },
                  })
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
                    return 50 + 50 * t.len(item.logins)
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
                        stamp={{ label: machine.updatedAt }}
                        nested={
                          <ctx.MapIndexed
                            items={machine.logins}
                            render={(login, index) => {
                              return (
                                <ctx.ListItem
                                  key={`nested_${index}`}
                                  avatar={{ icon: 'user', size: 'xs' }}
                                  title={{
                                    label: {
                                      text: `${login.hostname} - ${login.username}`,
                                      fontSize: 'sm',
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
                                  stamp={{ label: login.updatedAt }}
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
