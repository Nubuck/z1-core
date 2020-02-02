// main
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
        ui: {
          [k.ui.placeholder]: 'File alias',
          [k.ui.disabled]: props.disabled,
        },
      }),
      f('ui', {
        title: 'File to upload',
        type: k.string,
        format: k.format.dataUrl,
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
            files: [],
          },
          form: {
            upload: {
              data: {},
              ui: uploadForm({ disabled: false }),
            },
          },
        },
        data(props) {
          return {
            status: props.status,
            data: t.runMatch({
              _: props.data,
              [ctx.event.dataLoadComplete]: () => {
                return {
                  files: t.atOr([], 'next.data.files', props),
                }
              },
            })(props.event),
            error: props.error,
          }
        },
        async load(props) {
          const [filesErr, files] = await a.of(
            props.api.find('bucket-registry').find({
              query: {
                $limit: 10000,
              },
            })
          )
          if (filesErr) {
            return {
              status: props.status,
              data: {
                files: [],
              },
              error: filesErr,
            }
          }
          return {
            status: props.status,
            data: {
              files: files.data,
            },
            error: null,
          }
        },
        form(props) {
          return t.runMatch({
            _: null,
            [ctx.event.formTransmit]: () => {
              return {
                upload: {
                  data: t.atOr({}, 'next.formData', props),
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
          return {
            status: props.status,
            data,
            error: null,
          }
        },
      }
    },
    ui(ctx) {
      return props => {
        return (
          <ctx.Page
            key="cloud-storage"
            render={() => (
              <React.Fragment>
                <ctx.Row>
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
                    margin={{ bottom: 4 }}
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
                    loading={t.eq(status, ctx.status.loading)}
                  />
                </ctx.Row>
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
