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
            t.eq(props.account.authStatus, 'init'),
            t.eq(props.account.authStatus, 'auth-waiting')
          )
            ? 'waiting'
            : 'view'
        }
        render={{
          waiting() {
            return (
              <ui.Col x="center" y="center" flex={1}>
                <ui.Spinner size="lg" color={t.atOr('white', 'color', props)} />
              </ui.Col>
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
                  render={() => {
                    const navClosed = t.eq(props.nav.status, 'closed')
                    const spacing = navClosed ? { x: 3 } : { y: 3 }
                    return (
                      <ui.Stack
                        key="primary-nav"
                        direction={navClosed ? 'horizontal' : 'vertical'}
                        x={navClosed ? 'left' : 'center'}
                        y={navClosed ? 'center' : 'top'}
                        box={{
                          position: 'fixed',
                          pin: navClosed
                            ? {
                                top: false,
                                bottom: true,
                                left: true,
                                right: true,
                              }
                            : { top: true, bottom: true, left: true },
                          zIndex: 30,
                          overflowY: navClosed ? 'hidden' : 'auto',
                          overflowX: navClosed ? 'auto' : 'hidden',
                          padding: navClosed ? { x: 3 } : { bottom: 3 },
                        }}
                        className="scrollbar-hide"
                        style={
                          navClosed
                            ? {}
                            : t.pick(
                                ['width', 'left', 'bottom'],
                                props.nav.primary
                              )
                        }
                      >
                        <ui.Avatar
                          as={ui.Link}
                          to="/"
                          icon="superpowers"
                          size="lg"
                          fill="ghost-solid"
                          color="blue-500"
                          fontWeight="bold"
                          margin={navClosed ? null : { y: 2 }}
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
                                color={[null, { hover: 'blue-500' }]}
                                padding={spacing}
                                activeClassName="text-yellow-500"
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
                            const icon = t.atOr({}, 'icon', elProps)
                            const nextProps = t.mergeAll([
                              t.omit(['action', 'to'], elProps),
                              {
                                icon: t.merge(
                                  { size: '3xl' },
                                  t.isType(icon, 'string')
                                    ? { name: icon }
                                    : icon
                                ),
                              },
                              t.notNil(t.at('action.type', elProps))
                                ? {
                                    as: 'button',
                                    onClick() {
                                      props.dispatch(elProps.action)
                                    },
                                    cursor: 'pointer',
                                  }
                                : {
                                    as: ui.NavLink,
                                    to: navItem.path,
                                    activeClassName: 'text-yellow-500',
                                  },
                            ])
                            return (
                              <ui.IconLabel
                                key={`${navKey}_${index}`}
                                size="xl"
                                color={[null, { hover: 'blue-500' }]}
                                padding={spacing}
                                {...nextProps}
                              />
                            )
                          }}
                        />
                      </ui.Stack>
                    )
                  }}
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
                      className="scrollbar-hide"
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
                              activeClassName="text-yellow-500"
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
                        padding: [{ x: 3 }, { lg: { x: 4 } }],
                      }}
                      style={t.pick(['height', 'left'], props.nav.body)}
                    >
                      <ui.When
                        is={t.and(
                          t.isEmpty(props.nav.primary.items),
                          t.isEmpty(props.nav.primary.actions)
                        )}
                        render={() => (
                          <ui.Row
                            y="center"
                            flex="none"
                            as={ui.Link}
                            to="/"
                            color={['blue-500', { hover: 'yellow-500' }]}
                          >
                            <ui.Avatar
                              icon="superpowers"
                              size="lg"
                              fill="ghost"
                              fontWeight="bold"
                              cursor="pointer"
                            />
                            <ui.Col
                              y="center"
                              fontWeight="light"
                              fontSize="xl"
                              letterSpacing='wider'
                              className="transition-colors"
                            >
                              Z1 System
                            </ui.Col>
                          </ui.Row>
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
                              color={[null, { hover: 'blue-500' }]}
                              padding={{ x: 3 }}
                              activeClassName="text-yellow-500"
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
                              color={[null, { hover: 'blue-500' }]}
                              padding={{ x: 3 }}
                              activeClassName="text-yellow-500"
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
                      className="scrollbar-hide"
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
                              activeClassName="text-yellow-500"
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
