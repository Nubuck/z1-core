import React from 'react'
import z from '@z1/lib-feature-box'

// main
export const screen = z.fn(t => ({ ui, mutators }) => {
  return z.ui.connect(
    ['nav', 'location', 'account'],
    mutators
  )(props => {
    return (
      <ui.Match
        value={
          t.or(
            t.eq(props.account.status, 'init'),
            t.eq(props.account.status, 'auth-waiting')
          )
            ? 'waiting'
            : 'view'
        }
        render={{
          waiting() {
            return (
              <ui.Spinner
                size="lg"
                color={t.pathOr('white', ['color'], props)}
              />
            )
          },
          view() {
            return (
              <React.Fragment>
                <ui.When
                  is={t.or(
                    t.notEmpty(props.nav.primary.items),
                    t.notEmpty(props.nav.primary.actions)
                  )}
                  render={() => (
                    <ui.VStack
                      key="primary-nav"
                      x="center"
                      y="top"
                      box={{
                        position: 'fixed',
                        pin: { top: true, bottom: true, left: true },
                        zIndex: 30,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                      }}
                      className="scroll-hide"
                      style={t.pick(
                        ['width', 'left', 'bottom'],
                        props.nav.primary
                      )}
                    >
                      <ui.MapIndexed
                        items={t.to.pairs(props.nav.primary.items)}
                        render={([navKey, navItem], index) => {
                          const elProps = t.omit(
                            ['slot', 'text'],
                            navItem.options
                          )
                          return (
                            <ui.IconLabel
                              key={`${navKey}_${index}`}
                              as={ui.NavLink}
                              to={navItem.path}
                              size="xl"
                              {...elProps}
                            />
                          )
                        }}
                      />
                    </ui.VStack>
                  )}
                />
                <ui.When
                  is={t.notEmpty(props.nav.secondary.items)}
                  render={() => (
                    <ui.VStack
                      key="secondary-nav"
                      x="left"
                      y="top"
                      box={{
                        position: 'fixed',
                        pin: { top: true, bottom: true },
                        zIndex: 30,
                        shadow: ['2xl', { lg: 'none' }],
                        overflowY: 'auto',
                        overflowX: 'hidden',
                      }}
                      className="scroll-hide"
                      style={t.pick(
                        ['width', 'left', 'bottom'],
                        props.nav.secondary
                      )}
                    >
                      <ui.MapIndexed
                        items={t.to.pairs(props.nav.secondary.items)}
                        render={([navKey, navItem], index) => {
                          const elProps = t.omit(['slot'], navItem.options)
                          return (
                            <ui.IconLabel
                              key={`${navKey}_${index}`}
                              as={ui.NavLink}
                              to={navItem.path}
                              size="xl"
                              {...elProps}
                            />
                          )
                        }}
                      />
                    </ui.VStack>
                  )}
                />
                <ui.When
                  is={t.or(
                    t.notEmpty(props.nav.body.items),
                    t.notEmpty(props.nav.body.actions)
                  )}
                  render={() => <ui.HStack key="page-nav"></ui.HStack>}
                />
                <ui.When
                  is={t.notEmpty(props.nav.page.items)}
                  render={() => (
                    <ui.HStack key="page-nav-secondary"></ui.HStack>
                  )}
                />

                <ui.VStack key="body">
                  {z.routing.render(props.location.type, props.routing)}
                </ui.VStack>
              </React.Fragment>
            )
          },
        }}
      />
    )
  })
})
