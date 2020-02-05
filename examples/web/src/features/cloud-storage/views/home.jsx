import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// parts
const uploadForm = props =>
  sc.form.create((f, k) =>
    f({ type: k.object }, [
      f('alias', {
        title: 'File Alias',
        type: k.string,
        required: true,
        ui: {
          [k.ui.placeholder]: 'File alias',
          [k.ui.disabled]: props.disabled,
        },
      }),
      f('uri', {
        title: 'File to upload',
        type: k.string,
        format: k.format.dataUrl,
        required: true,
        ui: {
          [k.ui.placeholder]: 'Select the file to upload',
          [k.ui.disabled]: props.disabled,
        },
      }),
    ])
  )

// main
export const home = mx.fn((t, a, rx) =>
  mx.view.create('home', {
    state(ctx) {
      return {
        initial: {
          data: {
            url: null,
            files: [],
          },
          form: {
            upload: {
              data: {},
              ui: uploadForm({ disabled: false }),
            },
          },
          modal: {
            open: false,
            title: { icon: 'upload', label: 'File Upload' },
          },
        },
        data(props) {
          return {
            status: props.status,
            data: t.runMatch({
              _: () => props.data,
              [ctx.event.dataLoadComplete]: () => {
                return {
                  url: t.atOr('/api', 'next.data.url', props),
                  files: t.atOr([], 'next.data.files', props),
                }
              },
              [ctx.event.dataChange]: () => {
                const change = t.at('next.change', props)
                const file = t.at('next.file', props)
                const files = t.at('data.files', props)
                if (t.or(t.isNil(change), t.isNil(file))) {
                  return props.data
                }
                return t.runMatch({
                  _: () => props.data,
                  created: () =>
                    t.merge(props.data, {
                      files: t.append(file, files),
                    }),
                  patched: () =>
                    t.merge(props.data, {
                      files: t.update(
                        t.findIndex(
                          current => t.eq(current._id, file._id),
                          files
                        ),
                        file,
                        files
                      ),
                    }),
                  removed: () =>
                    t.merge(props.data, {
                      files: t.filter(
                        current => t.not(t.eq(current._id, file._id)),
                        files
                      ),
                    }),
                })(change)
              },
            })(props.event),
            error: t.runMatch({
              _: () => props.error,
              [ctx.event.dataLoadComplete]: () =>
                t.atOr(null, 'next.error', props),
              [ctx.event.formTransmitComplete]: () =>
                t.atOr(null, 'next.error', props),
            })(props.event),
          }
        },
        async load(props) {
          const [filesErr, files] = await a.of(
            props.api.service('bucket-registry').find({
              query: {
                includeAuthors: true,
                $limit: 10000,
              },
            })
          )
          if (filesErr) {
            return {
              status: props.status,
              data: {
                url: props.api.url,
                files: [],
              },
              error: filesErr,
            }
          }
          return {
            status: props.status,
            data: {
              url: props.api.url,
              files: files.data,
            },
            error: null,
          }
        },
        subscribe(props) {
          const bucketService = props.api.service('bucket-registry')
          return rx.fromEvent(bucketService, 'created').pipe(
            rx.merge(
              rx.fromEvent(bucketService, 'patched').pipe(
                rx.map(file => ({
                  file,
                  change: 'patched',
                }))
              ),
              rx.fromEvent(bucketService, 'removed').pipe(
                rx.map(file =>
                  t.eq('patched', t.at('change', file))
                    ? file
                    : {
                        file,
                        change: 'removed',
                      }
                )
              )
            ),
            rx.map(file =>
              props.mutators.dataChange(
                t.not(t.has('file')(file)) ? { file, change: 'created' } : file
              )
            )
          )
        },
        form(props) {
          return t.runMatch({
            _: null,
            [ctx.event.formTransmit]: () => {
              return {
                upload: {
                  data: t.atOr({}, 'next.data', props),
                  ui: uploadForm({ disabled: true }),
                },
              }
            },
            [ctx.event.formTransmitComplete]: () => {
              const error = t.at('next.error', props)
              return {
                upload: {
                  data: t.notNil(error)
                    ? t.atOr({}, 'form.upload.data', props)
                    : {},
                  ui: uploadForm({ disabled: false }),
                },
              }
            },
          })(props.event)
        },
        async transmit(props) {
          const data = t.at('form.upload.data', props)
          const [bucketErr] = await a.of(props.api.upload(data))
          if (bucketErr) {
            return {
              status: ctx.status.fail,
              data,
              error: bucketErr,
            }
          }
          return {
            status: props.status,
            data: {},
            error: null,
          }
        },
        modal(props) {
          return t.runMatch({
            _: () => props.modal,
            [ctx.event.modalChange]: () => {
              return t.merge(props.modal, {
                open: t.atOr(false, 'next.open', props),
              })
            },
            [ctx.event.formTransmitComplete]: () => {
              const error = t.at('next.error', props)
              return t.merge(props.modal, {
                open: t.notNil(error),
              })
            },
          })(props.event)
        },
      }
    },
    ui(ctx) {
      const creatorProps = (creator = {}) =>
        t.runMatch({
          user: () => ({
            name: `${t.atOr('Unknown', 'name', creator)} ${t.atOr(
              '',
              'surname',
              creator
            )}`,
            icon: 'user-plus',
          }),
          machine: () => ({
            name: t.atOr('Unknown', 'alias', creator),
            icon: ctx.icons.login(creator.role),
          }),
          _: () => ({ name: 'Unknown', icon: 'user' }),
        })(t.atOr('user', 'type', creator))
      return props => {
        return (
          <ctx.Page
            key="cloud-storage"
            render={() => (
              <React.Fragment>
                <ctx.Row key="title-bar" margin={{ bottom: 4 }}>
                  <ctx.IconLabel
                    icon={{
                      name: 'cloud-upload-alt',
                      size: '3xl',
                      color: 'blue-500',
                    }}
                    label={{
                      fontWeight: 'bold',
                      text: 'Cloud Storage',
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
                    loading={t.eq(status, ctx.status.loading)}
                    onClick={() =>
                      props.mutations.modalChange({
                        open: true,
                        modal: 'upload',
                      })
                    }
                  />
                </ctx.Row>
                <ctx.VList
                  items={t.atOr([], 'state.data.files', props)}
                  rowHeight={79}
                  render={(file, rowProps) => {
                    const creator = creatorProps(t.atOr({}, 'creator', file))
                    const hasAlias = t.notNil(file.alias)
                    return (
                      <ctx.ListItem
                        key={rowProps.key}
                        style={rowProps.style}
                        borderRadius="sm"
                        className="transition-bg"
                        margin={{ bottom: 1 }}
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
                          icon: ctx.icons.file(file.ext),
                          size: 'md',
                          fill: 'ghost',
                          color: 'blue-500',
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
                          icon: { name: creator.icon, size: 'xl' },
                          label: {
                            text: creator.name,
                            fontSize: 'sm',
                            letterSpacing: 'wide',
                            margin: { left: 2 },
                          },
                          color: 'gray-500',
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
                            onClick: () =>
                              props.mutations.modalChange({
                                open: true,
                                modal: 'file',
                                id: file._id,
                              }),
                          },
                          {
                            icon: 'trash',
                            shape: 'circle',
                            fill: 'ghost-solid',
                            size: 'xs',
                            color: 'red-500',
                            onClick: () =>
                              props.mutations.modalChange({
                                open: true,
                                modal: 'remove',
                                id: file._id,
                                name: file.originalName,
                              }),
                          },
                        ]}
                      />
                    )
                  }}
                />
                <ctx.Modal
                  title={{
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
                  }}
                  open={t.atOr(false, 'state.modal.open', props)}
                  onClose={() => props.mutations.modalChange({ open: false })}
                >
                  <ctx.IconLabel
                    slots={{
                      label: { x: 'center' },
                    }}
                    label={{
                      text:
                        'Enter your file alias below and select a file to upload to continue.',
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
                          'Upload failed',
                          'state.error.message',
                          props
                        )}
                        color="orange-500"
                        margin={{ top: 5 }}
                        x="center"
                      />
                    )}
                  />
                  <ctx.Form
                    schema={t.at('state.form.upload.ui.schema', props)}
                    uiSchema={t.at('state.form.upload.ui.uiSchema', props)}
                    formData={t.at('state.form.upload.data', props)}
                    onSubmit={payload =>
                      props.mutations.formTransmit({
                        data: payload.formData,
                      })
                    }
                    x="center"
                  >
                    <ctx.Row x="center" y="center" margin={{ top: 3 }}>
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
                          t.at('state.status', props),
                          ctx.status.loading
                        )}
                      />
                    </ctx.Row>
                  </ctx.Form>
                </ctx.Modal>
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
