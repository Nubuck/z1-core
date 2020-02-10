import React from 'react'
import mx from '@z1/lib-feature-macros'

// parts
import { aliasForm, machineModal } from './parts'

// main
export const login = mx.fn((t, a) =>
  mx.view.create('login', {
    state(ctx) {
      const forms = {
        login: {
          entity: 'login',
          ui: aliasForm(ctx, 'login'),
        },
      }
      return {
        initial: ctx.macro.initial(
          {
            url: null,
            login: null,
            files: [],
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
                entity: 'url',
                data: props.api.url,
              },
              {
                entity: 'login',
                method: props.api
                  .service('machine-logins')
                  .get(props.params.detail, {
                    query: { includeMachine: true },
                  }),
              },
              {
                entity: 'files',
                method: props.api.service('bucket-registry').find({
                  query: {
                    includeAuthors: true,
                    createdBy: props.params.detail,
                    $sort: {
                      updatedAt: -1,
                    },
                    $limit: 10000,
                  },
                }),
                resultAt: 'data',
              },
            ],
            props
          )
        },
        subscribe(props) {
          return ctx.macro.subscribe([
            {
              id: '_id',
              entity: 'login',
              service: props.api.service('machine-logins'),
              events: ['patched'],
              mutator: props.mutators.dataChange,
              filter: login => t.eq(props.params.detail, t.at('_id', login)),
            },
            {
              id: '_id',
              entity: 'files',
              service: props.api.service('bucket-registry'),
              events: ['created', 'patched', 'removed'],
              mutator: props.mutators.dataChange,
              filter: file =>
                t.eq(props.params.detail, t.at('createdBy', file)),
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
                form: 'login',
                method: data =>
                  t.isNil(data._id)
                    ? null
                    : props.api
                        .service('machine-logins')
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
        const online = t.eq('online', t.at('state.data.login.status', props))
        const osIcon = ctx.icons.machine(
          t.atOr('', 'state.data.login.machine.type', props)
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
                    icon={{
                      name: 'user-astronaut',
                      size: '3xl',
                      color: 'blue-500',
                    }}
                    label={{
                      text: 'Machine Login Profile',
                      fontWeight: 'bold',
                      fontSize: 'xl',
                    }}
                  />
                  <ctx.Spacer />
                  <ctx.IconLabel
                    display="inline-flex"
                    margin={{ right: 3 }}
                    color={online ? 'green-500' : 'gray-500'}
                    slots={{
                      label: {
                        padding: {
                          left: 2,
                        },
                      },
                    }}
                    icon={{
                      name: 'power-off',
                      size: '2xl',
                    }}
                    label={{
                      text: t.atOr('', 'state.data.login.status', props),
                      fontWeight: online ? 'medium' : 'light',
                      fontSize: 'lg',
                      letterSpacing: 'wide',
                    }}
                  />
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
                        active: 'login',
                        id: t.at('state.data.login._id', props),
                        title: {
                          icon: {
                            name: 'user-circle',
                            color: 'blue-500',
                            fontSize: '2xl',
                          },
                          label: {
                            text: 'Machine Login',
                            color: 'blue-500',
                            fontSize: 'lg',
                          },
                        },
                        text:
                          'Enter an alias for this login below to continue.',
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
                        text: t.atOr('', 'state.data.login.alias', props),
                        fontSize: 'lg',
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
                        name: ctx.icons.login(
                          t.atOr('', 'state.data.login.role', props)
                        ),
                        size: '2xl',
                        color: 'yellow-500',
                      }}
                      label={{
                        text: 'role',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.login.role', props),
                        fontSize: 'lg',
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
                        text: 'host name',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.login.hostname', props),
                        fontSize: 'lg',
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
                        text: 'user name',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr('', 'state.data.login.username', props),
                        fontSize: 'lg',
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
                              t.atOr(null, 'state.data.login.updatedAt', props)
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
                            t.atOr(null, 'state.data.login.createdAt', props)
                          )
                          .format('YYYY MM DD HH:mm:ss A'),
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 6 }}
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
                        color: 'blue-500',
                      }}
                      label={{
                        text: 'machine alias',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: t.atOr(
                          '',
                          'state.data.login.machine.alias',
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
                        color: 'blue-500',
                      }}
                      label={{
                        text: 'machine',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: `${t.atOr(
                          '',
                          'state.data.login.machine.manufacturer',
                          props
                        )} ${t.atOr(
                          '',
                          'state.data.login.machine.model',
                          props
                        )} ${t.atOr(
                          '',
                          'state.data.login.machine.serialnumber',
                          props
                        )} `,
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
                        text: 'os',
                        fontSize: 'sm',
                        letterSpacing: 'wide',
                        color: 'gray-500',
                      }}
                      info={{
                        text: `${t.atOr(
                          '',
                          'state.data.login.machine.distro',
                          props
                        )} ${t.atOr(
                          '',
                          'state.data.login.machine.release',
                          props
                        )} ${t.atOr(
                          '',
                          'state.data.login.machine.arch',
                          props
                        )} `,
                        fontSize: 'md',
                        letterSpacing: 'wide',
                      }}
                      margin={{ bottom: 3 }}
                    />
                  </ctx.Col>
                  <ctx.Col xs={12} md={6} x="left">
                    <ctx.When
                      is={t.notZeroLen(t.atOr([], 'state.data.files', props))}
                      render={() => (
                        <ctx.IconLabel
                          margin={{ bottom: 4 }}
                          slots={{
                            label: {
                              padding: { left: 2 },
                            },
                          }}
                          icon={{
                            name: 'cloud-upload-alt',
                            size: '2xl',
                            color: 'blue-500',
                          }}
                          label={{
                            text: `${t.atOr(
                              '',
                              'state.data.login.alias',
                              props
                            )} File Uploads`,
                            fontWeight: 'medium',
                            fontSize: 'lg',
                          }}
                        />
                      )}
                    />
                    <ctx.VList
                      key="file-list"
                      items={t.atOr([], 'state.data.files', props)}
                      rowHeight={80}
                      noRowsRenderer={() => (
                        <ctx.IconLabel
                          width="full"
                          padding={3}
                          flexDirection="col"
                          color="gray-500"
                          slots={{
                            icon: {
                              x: 'center',
                              margin: { bottom: 3 },
                            },
                            label: {
                              x: 'center',
                            },
                          }}
                          icon={{
                            name: 'folder-open',
                            size: '4xl',
                          }}
                          label={{
                            text: 'This login has no File Uploads',
                            fontWeight: 'medium',
                            fontSize: 'lg',
                          }}
                        />
                      )}
                      render={(file, rowProps) => {
                        const hasAlias = t.notNil(file.alias)
                        const fileIcon = ctx.icons.file(file.ext)
                        return (
                          <ctx.ListItem
                            key={rowProps.key}
                            style={rowProps.style}
                            borderRadius="sm"
                            margin={{ bottom: 1 }}
                            transition="bg"
                            slots={{
                              main: {
                                padding: { x: 3, y: 2 },
                                bgColor: ['gray-800', { hover: 'gray-700' }],
                              },
                              title: {
                                justifyContent: 'between',
                              },
                            }}
                            avatar={{
                              icon: fileIcon.name,
                              size: 'md',
                              fill: 'ghost',
                              color: fileIcon.color,
                            }}
                            caption={{
                              label: {
                                text: file.ext,
                                fontSize: 'xs',
                                fontWeight: 'light',
                                letterSpacing: 'wide',
                                color: 'gray-300',
                              },
                            }}
                            title={{
                              slots: {
                                label: {
                                  display: 'flex',
                                  margin: { top: 1 },
                                  y: 'center',
                                },
                              },
                              label: hasAlias
                                ? {
                                    text: file.alias,
                                    display: 'flex',
                                    flexDirection: 'col',
                                    fontSize: 'md',
                                    fontWeight: 'medium',
                                    margin: { right: 2, left: 0 },
                                  }
                                : null,
                              info: {
                                text: file.originalName,
                                display: 'flex',
                                flexDirection: 'col',
                                y: 'center',
                                x: 'center',
                                fontSize: hasAlias ? 'sm' : 'md',
                                fontWeight: hasAlias ? 'light' : 'nornal',
                                letterSpacing: 'wide',
                                color: hasAlias ? 'gray-300' : null,
                                margin: { left: 0 },
                              },
                            }}
                            stamp={{
                              icon: 'clock',
                              label: {
                                text: ctx
                                  .dateFn()
                                  .to(ctx.dateFn(file.updatedAt)),
                                fontSize: 'xs',
                                fontWeight: 'light',
                              },
                              margin: { bottom: 2 },
                            }}
                            status={{
                              label: {
                                text: ctx.bytes(file.size),
                                fontSize: 'sm',
                                fontWeight: 'medium',
                              },
                              color: 'gray-300',
                            }}
                            buttons={[
                              {
                                icon: 'download',
                                shape: 'circle',
                                fill: 'ghost-solid',
                                size: 'xs',
                                color: 'blue-500',
                                as: 'a',
                                href: `${t.at(
                                  'state.data.url',
                                  props
                                )}/bucket-content/${file.fileId}`,
                                target: '_blank',
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
