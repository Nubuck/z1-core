import React from 'react'
import mx from '@z1/lib-feature-macros'

// parts
import { aliasForm, machineModal } from './parts'

// main
export const profile = mx.fn((t, a) =>
  mx.view.create('profile', {
    state(ctx) {
      const forms = {
        machine: {
          entity: 'machine',
          ui: aliasForm(ctx, 'machine'),
        },
      }
      return {
        initial: ctx.macro.initial(
          {
            machine: null,
          },
          forms
        ),
        data(props) {
          return ctx.macro.data(props)
        },
        async load(props) {
          return await ctx.macro.load(
            [
              {
                entity: 'machine',
                method: props.api.service('machines').get(props.params.detail),
              },
            ],
            props
          )
        },
        subscribe(props) {
          const mutator = t.at('mutators.dataChange', props)
          return ctx.macro.subscribe([
            {
              id: '_id',
              entity: 'machine',
              service: props.api.service('machines'),
              events: ['patched'],
              mutator,
              filter: machine =>
                t.eq(props.params.detail, t.at('_id', machine)),
            },
            {
              id: '_id',
              parent: 'machineId',
              entity: 'machine.logins',
              service: props.api.service('machine-logins'),
              events: ['created', 'patched'],
              mutator,
              filter: login => t.eq(props.params.detail, t.at('machineId', login)),
            },
          ])
        },
        form(props) {
          return ctx.macro.form(forms, props)
        },
        async transmit(props) {
          return await ctx.macro.transmit(
            [
              {
                form: 'machine',
                method: data =>
                  t.isNil(data._id)
                    ? null
                    : props.api
                        .service('machines')
                        .patch(data._id, t.pick(['alias'], data)),
              },
            ],
            props
          )
        },
        modal(props) {
          return ctx.macro.modal({ autoClose: true }, props)
        },
      }
    },
    ui(ctx) {
      const MachineModal = machineModal(ctx)
      return props => {
        const status = t.at('state.status', props)
        const osIcon = ctx.icons.machine(
          t.atOr('', 'state.data.machine.type', props)
        )
        return (
          <ctx.Page
            key="machine-profile"
            loading={t.includes(status, [ctx.status.init, ctx.status.waiting])}
            render={() => (
              <React.Fragment>
                <ctx.Row key="title-bar" margin={{ bottom: 4 }}>
                  <ctx.IconLabel
                    slots={{
                      label: {
                        padding: { left: 2 },
                      },
                    }}
                    icon={{ name: 'laptop', size: '3xl', color: 'blue-500' }}
                    label={{
                      text: 'Machine Profile',
                      fontWeight: 'bold',
                      fontSize: 'xl',
                    }}
                  />
                  <ctx.Spacer />
                  <ctx.Button
                    icon="gear"
                    size="xs"
                    shape="circle"
                    fill="outline"
                    colors={{
                      off: 'blue-500',
                      on: {
                        bg: 'yellow-500',
                        border: 'yellow-500',
                        content: 'gray-900',
                      },
                    }}
                    onClick={() =>
                      props.mutations.modalChange({
                        open: true,
                        active: 'machine',
                        id: t.at('state.data.machine._id', props),
                        title: {
                          icon: {
                            icon: ctx.icons.machine(
                              t.at('state.data.machine.type', props)
                            ),
                            color: 'blue-500',
                            fontSize: '2xl',
                          },
                          label: {
                            text: 'Machine',
                            color: 'blue-500',
                            fontSize: 'lg',
                          },
                        },
                        text:
                          'Enter an alias for this machine below to continue.',
                      })
                    }
                  />
                </ctx.Row>
                <ctx.Row flex={1}>
                  <ctx.Col xs={12} md={6} x="left">
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'id-card',
                        size: '2xl',
                        color: 'yellow-500',
                      }}
                      label={{
                        text: 'alias',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.machine.alias', props),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'id-card',
                        size: '2xl',
                        color: 'yellow-500',
                      }}
                      label={{
                        text: 'hardware uuid',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr(
                          '',
                          'state.data.machine.hardwareuuid',
                          props
                        ),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'laptop',
                        size: '2xl',
                        color: 'yellow-500',
                      }}
                      label={{
                        text: 'manufacturer',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr(
                          '',
                          'state.data.machine.manufacturer',
                          props
                        ),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'laptop',
                        size: '2xl',
                        color: 'yellow-500',
                      }}
                      label={{
                        text: 'model',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.machine.model', props),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'laptop',
                        size: '2xl',
                        color: 'yellow-500',
                      }}
                      label={{
                        text: 'serialnumber',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr(
                          '',
                          'state.data.machine.serialnumber',
                          props
                        ),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'microchip',
                        size: '2xl',
                        color: 'yellow-500',
                      }}
                      label={{
                        text: 'cpus',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.machine.cpus', props),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: osIcon,
                        size: '2xl',
                        color: 'blue-500',
                      }}
                      label={{
                        text: 'distro',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.machine.distro', props),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: osIcon,
                        size: '2xl',
                        color: 'blue-500',
                      }}
                      label={{
                        text: 'release',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.machine.release', props),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: osIcon,
                        size: '2xl',
                        color: 'blue-500',
                      }}
                      label={{
                        text: 'arch',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.machine.arch', props),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: osIcon,
                        size: '2xl',
                        color: 'blue-500',
                      }}
                      label={{
                        text: 'os serial number',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr(
                          '',
                          'state.data.machine.hostSerialnumber',
                          props
                        ),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'business-time',
                        size: '2xl',
                      }}
                      label={{
                        text: 'Time zone',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.machine.timezone', props),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'calendar-check',
                        size: '2xl',
                      }}
                      label={{
                        text: 'last updated',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: ctx
                          .dateFn()
                          .to(
                            ctx.dateFn(
                              t.atOr(
                                null,
                                'state.data.machine.updatedAt',
                                props
                              )
                            )
                          ),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                    <ctx.IconLabel
                      display="inline-flex"
                      slots={{
                        label: {
                          padding: {
                            left: 2,
                          },
                        },
                      }}
                      icon={{
                        name: 'calendar-plus',
                        size: '2xl',
                      }}
                      label={{
                        text: 'created',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: ctx
                          .dateFn(
                            t.atOr(null, 'state.data.machine.createdAt', props)
                          )
                          .format('YYYY MM DD HH:mm:ss A'),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                  </ctx.Col>
                  <ctx.Col xs={12} md={6} x="left">
                    <ctx.IconLabel
                      margin={{ bottom: 4 }}
                      slots={{
                        label: {
                          padding: { left: 2 },
                        },
                      }}
                      icon={{
                        name: 'user-astronaut',
                        size: '2xl',
                        color: 'blue-500',
                      }}
                      label={{
                        text: `${t.atOr(
                          '',
                          'state.data.login.alias',
                          props
                        )} Account Logins`,
                        fontWeight: 'medium',
                        fontSize: 'lg',
                      }}
                    />
                    <ctx.MapIndexed
                      items={t.atOr([], 'state.data.machine.logins', props)}
                      render={(login, index) => {
                        const online = t.eq('online', login.status)
                        return (
                          <ctx.ListItem
                            key={`nested_login_${login._id}_${index}`}
                            width="full"
                            transition="bg"
                            margin={{ bottom: 1 }}
                            slots={{
                              main: {
                                padding: { x: 3, y: 2 },
                                bgColor: ['gray-800', { hover: 'gray-700' }],
                              },
                            }}
                            avatar={{
                              icon: ctx.icons.login(login.role),
                              size: 'md',
                              fill: 'ghost',
                              color: 'yellow-500',
                            }}
                            title={{
                              label: {
                                text: login.alias,
                                fontSize: 'md',
                                fontWeight: 'light',
                                letterSpacing: 'wider',
                                margin: { bottom: 2 },
                              },
                              info: {
                                text: login.role,
                                fontSize: 'sm',
                                fontWeight: 'medium',
                                letterSpacing: 'wide',
                                color: 'yellow-500',
                              },
                            }}
                            stamp={{
                              icon: 'clock',
                              label: {
                                text: ctx
                                  .dateFn()
                                  .to(ctx.dateFn(login.updatedAt)),
                                fontSize: 'xs',
                                fontWeight: 'light',
                              },
                              margin: { bottom: 2 },
                            }}
                            status={{
                              icon: { name: 'power-off', size: 'lg' },
                              label: {
                                text: login.status,
                                fontSize: 'sm',
                                fontWeight: online ? 'medium' : 'light',
                                letterSpacing: 'wide',
                              },
                              color: online ? 'green-500' : 'gray-500',
                            }}
                            buttons={[
                              {
                                icon: 'arrow-circle-right',
                                shape: 'circle',
                                fill: 'ghost-solid',
                                size: 'xs',
                                color: 'blue-500',
                                margin: { left: 1 },
                                as: ctx.Link,
                                to: `/machines/login/${login._id}`,
                              },
                            ]}
                          />
                        )
                      }}
                    />
                  </ctx.Col>
                </ctx.Row>
                <MachineModal key="view-modal" {...props} />
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
