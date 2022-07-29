import React from 'react'
import z from '@z1/lib-feature-box-server'
import { Table, TBody, TR, TD, A } from 'oy-vey'

// ui
import layout from './layouts'
import { modules } from './modules'

const ctx = {
  Table,
  TBody,
  TR,
  TD,
  A,
}

const Mail = z.fn((t, a) => (props) => {
  const EmptySpace = modules.emptySpace(ctx)

  // New context
  const ectx = t.merge(ctx, { EmptySpace })

  // components
  const Layout = layout(ectx)
  const Header = modules.header(ectx)
  const Body = modules.body(ectx)
  const Footer = modules.footer(ectx)

  const linkExist = t.allOf([
    t.notNil(props.verifyLink),
    t.notEmpty(props.verifyLink),
  ])

  return (
    <Layout>
      <Header color="'#134ac0'" />
      <Body color="#EAECED" {...props} />

      {linkExist ? <Footer color="#ecc94b" {...props} /> : null}
    </Layout>
  )
})

export default Mail
