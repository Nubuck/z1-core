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
                      <ui.Avatar
                        as={ui.Link}
                        to="/"
                        icon="superpowers"
                        size="lg"
                        fill="solid"
                        color="green-500"
                        fontWeight="bold"
                        margin={{ y: 3 }}
                      />

                      <ui.MapIndexed
                        items={t.to.pairs(props.nav.primary.items)}
                        render={([navKey, navItem], index) => {
                          const elProps = t.omit(
                            ['slot', 'label'],
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
                      <ui.When
                        is={t.notEmpty(props.nav.primary.actions)}
                        render={() => <ui.Spacer />}
                      />
                      <ui.MapIndexed
                        items={t.to.pairs(props.nav.primary.actions)}
                        render={([navKey, navItem], index) => {
                          const elProps = t.omit(
                            ['slot', 'label'],
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
                  render={() => (
                    <ui.HStack
                      key="page-nav"
                      x="left"
                      y="center"
                      box={{
                        position: 'fixed',
                        pin: [
                          { bottom: true, right: true },
                          { lg: { top: true, right: true } },
                        ],
                        zIndex: 30,
                      }}
                      style={t.pick(['height', 'left'], props.nav.body)}
                    >
                      <ui.When
                        is={t.and(
                          t.isEmpty(props.nav.primary.items),
                          t.isEmpty(props.nav.primary.actions)
                        )}
                        render={() => (
                          <ui.Avatar
                            as={ui.Link}
                            to="/"
                            icon="superpowers"
                            size="lg"
                            fill="solid"
                            color="green-500"
                            fontWeight="bold"
                            margin={{ x: 3 }}
                          />
                        )}
                      />
                      <ui.MapIndexed
                        items={t.to.pairs(props.nav.body.items)}
                        render={([navKey, navItem], index) => {
                          const elProps = t.omit(['slot'], navItem.options)
                          return (
                            <ui.IconLabel
                              key={`${navKey}_${index}`}
                              as={ui.NavLink}
                              to={navItem.path}
                              size="xl"
                              box={{
                                padding: { x: 3 },
                              }}
                              {...elProps}
                            />
                          )
                        }}
                      />
                      <ui.When
                        is={t.notEmpty(props.nav.body.actions)}
                        render={() => <ui.Spacer />}
                      />
                      <ui.MapIndexed
                        items={t.to.pairs(props.nav.body.actions)}
                        render={([navKey, navItem], index) => {
                          const elProps = t.omit(['slot'], navItem.options)
                          return (
                            <ui.IconLabel
                              key={`${navKey}_${index}`}
                              as={ui.NavLink}
                              to={navItem.path}
                              size="xl"
                              color={[null, { hover: 'green-500' }]}
                              box={{
                                padding: { x: 3 },
                              }}
                              {...elProps}
                            />
                          )
                        }}
                      />
                    </ui.HStack>
                  )}
                />
                <ui.When
                  is={t.notEmpty(props.nav.page.items)}
                  render={() => (
                    <ui.HStack
                      key="page-nav-secondary"
                      box={{
                        position: 'fixed',
                        zIndex: 20,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                      }}
                      className="scroll-hide"
                      style={t.pick(
                        ['width', 'top', 'left', 'bottom'],
                        props.nav.page
                      )}
                    >
                      <ui.MapIndexed
                        items={t.to.pairs(props.nav.page.items)}
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
                    </ui.HStack>
                  )}
                />
                <ui.VStack
                  key="body"
                  box={{
                    position: 'relative',
                    flex: 1,
                    width: 'full',
                    zIndex: 0,
                  }}
                  style={{
                    paddingLeft: props.nav.body.left,
                    paddingTop: props.nav.body.top,
                    paddingBottom: props.nav.body.bottom,
                  }}
                >
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
