import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// parts
export const aliasForm = mx.fn(t => (ctx, entity) => props =>
  sc.form.create((f, k) =>
    f({ type: k.object }, [
      f('alias', {
        title: `${t.to.sentenceCase(entity)} Alias`,
        type: k.string,
        required: true,
        ui: {
          [k.ui.placeholder]: `Enter an alias for this ${t.to.lowerCase(
            entity
          )}`,
          [k.ui.disabled]: t.eq(ctx.status.loading, t.at('status', props)),
        },
      }),
    ])
  )
)
export const machineModal = mx.fn(t => ctx => {
  function MachineModal(props) {
    const active = t.atOr('machine', 'state.modal.active', props)
    return (
      <ctx.Modal
        title={t.at('state.modal.title', props)}
        open={t.atOr(false, 'state.modal.open', props)}
        onClose={() => props.mutations.modalChange({ open: false })}
        slots={{
          buttons: {
            x: 'center',
          },
        }}
      >
        <ctx.IconLabel
          slots={{
            label: { x: 'center' },
          }}
          label={{
            text: t.atOr('Edit', 'state.modal.content.text', props),
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
              message={t.atOr('Operation failed', 'state.error.message', props)}
              color="orange-500"
              margin={{ top: 3 }}
              x="center"
            />
          )}
        />
        <ctx.Form
          schema={t.path(['state', 'form', active, 'ui', 'schema'], props)}
          uiSchema={t.path(['state', 'form', active, 'ui', 'uiSchema'], props)}
          formData={t.path(['state', 'form', active, 'data'], props)}
          onSubmit={payload =>
            props.mutations.formTransmit({
              active,
              data: payload.formData,
            })
          }
          x="center"
        >
          <ctx.Match
            value={active}
            render={{
              machine: () => {
                const machine = t.pathOr(
                  {},
                  ['state', 'form', active, 'data'],
                  props
                )
                const noAlias = t.isNil(machine.alias)
                const machineIcon = ctx.icons.machine(machine.type)
                const machineName = `${machine.manufacturer} model: ${machine.model} serial: ${machine.serialnumber}`
                return (
                  <ctx.IconLabel
                    alignSelf="start"
                    margin={{ y: 1 }}
                    icon={{
                      name: machineIcon,
                      size: '4xl',
                      color: 'blue-500',
                    }}
                    label={{
                      text: t.atOr(machineName, 'alias', machine),
                      fontSize: 'md',
                      margin: noAlias ? { left: 2 } : { left: 2, bottom: 1 },
                    }}
                    info={{
                      text: noAlias
                        ? `${machine.distro} v${machine.release} ${machine.arch}`
                        : machineName,
                      fontSize: 'sm',
                      color: 'gray-400',
                      margin: { left: 2 },
                    }}
                  />
                )
              },
              login: () => {
                const login = t.pathOr(
                  {},
                  ['state', 'form', active, 'data'],
                  props
                )
                const noAlias = t.isNil(login.alias)
                const loginIcon = ctx.icons.login(login.role)
                const loginName = `host: ${login.hostname} user: ${login.username}`
                return (
                  <ctx.IconLabel
                    alignSelf="start"
                    margin={{ y: 1 }}
                    icon={{
                      name: loginIcon,
                      size: '4xl',
                      color: 'yellow-500',
                    }}
                    caption={{
                      text: login.role,
                    }}
                    label={{
                      text: t.atOr(loginName, 'alias', login),
                      fontSize: noAlias ? 'md' : 'lg',
                      margin: noAlias ? { left: 2 } : { left: 2, bottom: 1 },
                    }}
                    info={
                      noAlias
                        ? null
                        : {
                            text: loginName,
                            fontSize: 'sm',
                            color: 'gray-400',
                            margin: { left: 2 },
                          }
                    }
                  />
                )
              },
            }}
          />
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
              loading={t.eq(ctx.status.loading, t.at('state.status', props))}
            />
          </ctx.Row>
        </ctx.Form>
      </ctx.Modal>
    )
  }
  MachineModal.displayName = 'MachineModal'
  return MachineModal
})
