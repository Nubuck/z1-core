import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// main
export const home = mx.fn(t =>
  mx.view.create('home', {
    state(ctx) {
      const forms = {
        upload: {
          entity: null,
          ui: props =>
            sc.form.create((f, k) =>
              f({ type: k.object }, [
                f('uri', {
                  title: 'File to upload',
                  type: k.string,
                  format: k.format.dataUrl,
                  required: true,
                  ui: {
                    [k.ui.placeholder]: 'Select the file to upload',
                    [k.ui.disabled]: t.eq(
                      ctx.status.loading,
                      t.at('status', props)
                    ),
                  },
                }),
                f('alias', {
                  title: 'File Alias',
                  type: k.string,
                  required: true,
                  ui: {
                    [k.ui.placeholder]: 'Enter an alias for this file',
                    [k.ui.disabled]: t.eq(
                      ctx.status.loading,
                      t.at('status', props)
                    ),
                  },
                }),
              ])
            ),
        },
        file: {
          entity: 'files',
          ui: props =>
            sc.form.create((f, k) =>
              f({ type: k.object }, [
                f('alias', {
                  title: 'File Alias',
                  type: k.string,
                  required: true,
                  ui: {
                    [k.ui.placeholder]: 'Enter an alias for this file',
                    [k.ui.disabled]: t.eq(
                      ctx.status.loading,
                      t.at('status', props)
                    ),
                  },
                }),
              ])
            ),
        },
      }
      return {
        initial: ctx.macro.initial(
          {
            url: null,
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
                entity: 'files',
                method: props.api.service('bucket-registry').find({
                  query: {
                    includeAuthors: true,
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
              entity: 'files',
              service: props.api.service('bucket-registry'),
              events: ['created', 'patched', 'removed'],
              mutator: props.mutators.dataChange,
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
                form: 'upload',
                method: data => props.api.upload(data),
              },
              {
                form: 'file',
                method: data =>
                  t.isNil(data._id)
                    ? null
                    : props.api
                        .service('bucket-registry')
                        .patch(data._id, t.pick(['alias'], data), {
                          query: { includeAuthors: true },
                        }),
              },
              {
                form: 'remove',
                dataAt: 'modal.id',
                method: id =>
                  t.isNil(id)
                    ? null
                    : props.api.service('bucket-storage').remove(id),
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
      const creatorProps = (creator = {}) =>
        t.runMatch({
          _: () => ({ name: 'Unknown', icon: 'user' }),
          user: () => ({
            name: `${t.atOr('Unknown', 'name', creator)} ${t.atOr(
              '',
              'surname',
              creator
            )}`,
            icon: 'user-circle',
          }),
          machine: () => ({
            name: t.atOr('Unknown', 'alias', creator),
            icon: ctx.icons.login(creator.role),
          }),
        })(t.atOr('user', 'type', creator))
      return props => {
        const status = t.at('state.status', props)
        const fileUpload = () =>
          props.mutations.modalChange({
            open: true,
            active: 'upload',
            title: {
              icon: {
                name: 'cloud-upload',
                color: 'blue-500',
                fontSize: '2xl',
              },
              label: {
                text: 'File Upload',
                color: 'blue-500',
                fontSize: 'lg',
              },
            },
          })
        return (
          <ctx.Page
            key="cloud-storage"
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
                      name: 'cloud-upload-alt',
                      size: '3xl',
                      color: 'blue-500',
                    }}
                    label={{
                      text: 'Cloud Storage',
                      fontWeight: 'bold',
                      fontSize: 'xl',
                    }}
                  />
                  <ctx.Spacer />
                  <ctx.Button
                    label={{ text: 'upload', fontWeight: 'medium' }}
                    icon="upload"
                    size="xs"
                    shape="pill"
                    fill="outline"
                    colors={{
                      off: 'blue-500',
                      on: {
                        bg: 'yellow-500',
                        border: 'yellow-500',
                        content: 'gray-900',
                      },
                    }}
                    height={8}
                    onClick={fileUpload}
                  />
                </ctx.Row>
                <ctx.VList
                  key="file-list"
                  items={t.atOr([], 'state.data.files', props)}
                  rowHeight={80}
                  noRowsRenderer={() => (
                    <ctx.IconLabel
                      width="full"
                      padding={3}
                      flexDirection="col"
                      color={['gray-500', { hover: 'yellow-500' }]}
                      cursor="pointer"
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
                        text: 'There are currently no File Uploads',
                        fontWeight: 'medium',
                        fontSize: 'lg',
                        margin: { bottom: 3 },
                      }}
                      info={{
                        text: 'Be the first to upload a file',
                        fontWeight: 'light',
                        fontSize: 'lg',
                      }}
                      onClick={fileUpload}
                    />
                  )}
                  render={(file, rowProps) => {
                    const creator = creatorProps(t.atOr({}, 'creator', file))
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
                              flexDirection: 'row',
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
                            alignSelf: 'stretch',
                            fontSize: hasAlias ? 'sm' : 'md',
                            fontWeight: hasAlias ? 'light' : 'nornal',
                            letterSpacing: 'wide',
                            color: hasAlias ? 'gray-300' : null,
                            margin: { left: 0 },
                          },
                        }}
                        subtitle={{
                          icon: {
                            name: creator.icon,
                            size: 'xl',
                            color: 'gray-500',
                          },
                          label: {
                            text: creator.name,
                            fontSize: 'xs',
                            letterSpacing: 'wide',
                            margin: { left: 2 },
                            color: 'gray-400',
                          },
                          info: {
                            text: 'creator',
                            fontSize: 'xs',
                            letterSpacing: 'wide',
                            margin: { left: 2 },
                            color: 'gray-500',
                          },
                        }}
                        stamp={{
                          icon: 'clock',
                          label: {
                            text: ctx.dateFn().to(ctx.dateFn(file.updatedAt)),
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
                          {
                            icon: 'gear',
                            shape: 'circle',
                            fill: 'ghost-solid',
                            size: 'xs',
                            color: 'blue-500',
                            margin: { left: 1 },
                            disabled: t.eq(
                              ctx.status.loading,
                              t.at('state.status', props)
                            ),
                            onClick: () =>
                              props.mutations.modalChange({
                                open: true,
                                active: 'file',
                                title: {
                                  icon: {
                                    name: 'gear',
                                    color: 'blue-500',
                                    fontSize: '2xl',
                                  },
                                  label: {
                                    text: 'Edit file',
                                    color: 'blue-500',
                                    fontSize: 'lg',
                                  },
                                },
                                id: file._id,
                              }),
                          },
                          {
                            icon: 'trash',
                            shape: 'circle',
                            fill: 'ghost-solid',
                            size: 'xs',
                            color: 'red-500',
                            margin: { left: 1 },
                            disabled: t.eq(
                              ctx.status.loading,
                              t.at('state.status', props)
                            ),
                            onClick: () =>
                              props.mutations.modalChange({
                                open: true,
                                active: 'remove',
                                id: file.fileId,
                                title: {
                                  icon: {
                                    name: 'trash',
                                    color: 'red-500',
                                    fontSize: '2xl',
                                  },
                                  label: {
                                    text: 'Remove file',
                                    color: 'red-500',
                                    fontSize: 'lg',
                                  },
                                },
                                name: file.originalName,
                              }),
                          },
                        ]}
                      />
                    )
                  }}
                />
                <ctx.Modal
                  key="view-modal"
                  title={t.at('state.modal.title', props)}
                  open={t.atOr(false, 'state.modal.open', props)}
                  onClose={() => props.mutations.modalChange({ open: false })}
                  slots={{
                    buttons: {
                      x: 'center',
                    },
                  }}
                  buttons={t.runMatch({
                    _: () => [],
                    remove: () => [
                      {
                        label: { text: 'Cancel' },
                        fill: 'ghost-solid',
                        size: 'sm',
                        color: 'blue-500',
                        margin: { right: 2 },
                        height: 10,
                        disabled: t.eq(
                          ctx.status.loading,
                          t.at('state.status', props)
                        ),
                        onClick: () =>
                          props.mutations.modalChange({ open: false }),
                      },
                      {
                        reverse: true,
                        icon: 'check-circle',
                        label: { text: 'Confirm' },
                        fill: 'outline',
                        size: 'sm',
                        colors: {
                          off: { content: 'red-500', border: 'red-500' },
                          on: {
                            bg: 'green-500',
                            border: 'green-500',
                            content: 'white',
                          },
                        },
                        height: 10,
                        loading: t.eq(
                          ctx.status.loading,
                          t.at('state.status', props)
                        ),
                        onClick: () =>
                          props.mutations.formTransmit({
                            active: 'remove',
                            id: t.at('state.modal.id', props),
                          }),
                      },
                    ],
                  })(t.atOr('upload', 'state.modal.active', props))}
                >
                  <ctx.Match
                    value={t.atOr('upload', 'state.modal.active', props)}
                    render={{
                      _: () => {
                        const active = t.atOr(
                          'upload',
                          'state.modal.active',
                          props
                        )
                        return (
                          <React.Fragment>
                            <ctx.IconLabel
                              slots={{
                                label: { x: 'center' },
                              }}
                              label={{
                                text: t.eq('upload', active)
                                  ? 'Select a file to upload and enter your file alias below to continue.'
                                  : 'Enter your file alias below to continue.',
                                fontSize: 'lg',
                                fontWeight: 'medium',
                                letterSpacing: 'wide',
                              }}
                            />
                            <ctx.When
                              is={t.notNil(props.state.error)}
                              render={() => (
                                <ctx.Alert
                                  icon="exclamation-triangle"
                                  message={t.atOr(
                                    'Operation failed',
                                    'state.error.message',
                                    props
                                  )}
                                  color="orange-500"
                                  margin={{ top: 3 }}
                                  x="center"
                                />
                              )}
                            />
                            <ctx.Form
                              schema={t.path(
                                ['state', 'form', active, 'ui', 'schema'],
                                props
                              )}
                              uiSchema={t.path(
                                ['state', 'form', active, 'ui', 'uiSchema'],
                                props
                              )}
                              formData={t.path(
                                ['state', 'form', active, 'data'],
                                props
                              )}
                              onSubmit={payload =>
                                props.mutations.formTransmit({
                                  active,
                                  data: payload.formData,
                                })
                              }
                              x="center"
                            >
                              <ctx.When
                                is={t.eq('file', active)}
                                render={() => {
                                  const file = t.pathOr(
                                    {},
                                    ['state', 'form', active, 'data'],
                                    props
                                  )
                                  const noAlias = t.isNil(file.alias)
                                  const fileIcon = ctx.icons.file(file.ext)
                                  return (
                                    <ctx.IconLabel
                                      alignSelf="start"
                                      margin={{ y: 1 }}
                                      icon={{
                                        name: fileIcon.name,
                                        size: '4xl',
                                        color: fileIcon.color,
                                      }}
                                      label={{
                                        text: t.atOr(
                                          file.originalName,
                                          'alias',
                                          file
                                        ),
                                        fontSize: noAlias ? 'md' : 'lg',
                                        margin: noAlias ? null : { bottom: 1 },
                                      }}
                                      info={
                                        noAlias
                                          ? null
                                          : {
                                              text: file.originalName,
                                              fontSize: 'sm',
                                              color: 'gray-400',
                                            }
                                      }
                                    />
                                  )
                                }}
                              />
                              <ctx.Row
                                x="center"
                                y="center"
                                margin={{ top: 3 }}
                              >
                                <ctx.Button
                                  reverse
                                  label="Continue"
                                  icon="arrow-circle-right"
                                  type="submit"
                                  size="md"
                                  shape="pill"
                                  fill="outline"
                                  colors={{ on: 'blue-500', off: 'yellow-500' }}
                                  loading={t.eq(
                                    ctx.status.loading,
                                    t.at('state.status', props)
                                  )}
                                />
                              </ctx.Row>
                            </ctx.Form>
                          </React.Fragment>
                        )
                      },
                      remove: () => {
                        return (
                          <ctx.IconLabel
                            flexDirection="col"
                            margin={{ bottom: 3 }}
                            slots={{
                              icon: {
                                x: 'center',
                                y: 'center',
                                flexDirection: 'row',
                                margin: { bottom: 3 },
                              },
                              label: { x: 'center', y: 'center' },
                            }}
                            icon={{
                              name: 'exclamation-triangle',
                              size: '4xl',
                              color: 'red-500',
                            }}
                            caption={{
                              text: `Are you sure?`,
                              fontSize: 'lg',
                              fontWeight: 'medium',
                              letterSpacing: 'wide',
                              margin: { left: 2 },
                            }}
                            label={{
                              dangerouslySetInnerHTML: {
                                __html: `<span>
                                You are about to remove the file
                                <span class="font-bold px-1 break-all text-red-500">
                                ${t.atOr('', 'state.modal.content.name', props)}
                                </span>
                                which cannot be undone.
                                </span>
                                <br/>
                                <span>Please confirm below to continue</span>`,
                              },
                              fontSize: 'md',
                              fontWeight: 'light',
                              letterSpacing: 'wide',
                              wordBreak: 'words',
                              textAlignX: 'center',
                              flexDirection: 'col',
                            }}
                          />
                        )
                      },
                    }}
                  />
                </ctx.Modal>
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
