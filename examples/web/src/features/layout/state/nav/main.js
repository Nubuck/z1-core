import z from '@z1/lib-feature-box'
import sc from '@z1/lib-ui-schema'

// parts
import {
  navMode,
  navStatus,
  navSize,
  calcPrimaryLeft,
  calcSecondaryLeft,
  calcBodyLeft,
  calcBodySpacing,
  calcPageLeft,
} from './parts'

// main
export const nav = z.fn(t =>
  z.state.create('nav', {
    intial: {
      title: '',
      status: navStatus.init,
      mode: navMode.primary,
      schema: {},
      matched: null,
      width: 0,
      size: 'xs',
      primary: {
        width: navSize.primary,
        items: {},
        actions: {},
        left: 0,
        bottom: 0,
      },
      secondary: {
        width: navSize.secondary,
        items: {},
        left: 0,
        bottom: 0,
      },
      body: {
        height: navSize.body,
        items: {},
        actions: {},
        left: 0,
        navLeft: 0,
        top: 0,
        bottom: 0,
      },
      page: {
        status: navStatus.closed,
        width: navSize.page,
        items: {},
        left: 0,
        top: 0,
        bottom: 0,
      },
    },
    mutations(m) {
      return [
        m('schemaRegister', (state, action) => {
          return state
        }),
        m('schemaRemove', (state, action) => {
          return state
        }),
        m('schemaChange', (state, action) => {
          return state
        }),
        m('navChange', (state, action) => {
          return state
        }),
        m('navMatch', (state, action) => {
          return state
        }),
        m('navToggle', (state, action) => {
          return state
        }),
      ]
    },
    effects(fx, box) {
      return [
        fx(
          ['screen/RESIZE', box.actions.navToggleStatus],
          (ctx, dispatch, done) => {
            done()
          }
        ),
        fx([t.globrex('*/ROUTING/*').regex, z.routing.actions.notFound], (ctx, dispatch, done)=>{
          // sc.nav.findItem(path, schema)
          done()
        })
      ]
    },
    afterInit(ctx) {
      return []
    },
  })
)
