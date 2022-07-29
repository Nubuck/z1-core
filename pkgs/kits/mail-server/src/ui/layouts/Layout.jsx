import React from 'react'
import z from '@z1/lib-feature-box-server'

export const Layout = z.fn((t, a) => (ctx) => {
  return (props) => {
    return (
      <ctx.Table
        width="800"
        align="center"
        style={{
          WebkitTextSizeAdjust: '100%',
          msTextSizeAdjust: '100%',
          msoTableLspace: '0pt',
          msoTableRspace: '0pt',
          borderCollapse: 'collapse',
          margin: '0px auto',
        }}
      >
        <ctx.TBody key="email-layout">
          <ctx.TR>
            <ctx.TD align="center">
              {/* Centered column */}
              <ctx.Table
                width="800"
                align="center"
                style={{
                  WebkitTextSizeAdjust: '100%',
                  msTextSizeAdjust: '100%',
                  msoTableLspace: '0pt',
                  msoTableRspace: '0pt',
                  borderCollapse: 'collapse',
                  margin: '0px auto',
                }}
              >
                <ctx.TBody key="email-children">
                  <ctx.TR>
                    <ctx.TD>{props.children}</ctx.TD>
                  </ctx.TR>
                </ctx.TBody>
              </ctx.Table>
            </ctx.TD>
          </ctx.TR>

          <ctx.TR>
            <ctx.TD
              align="center"
              style={{ backgroundColor: 'rgb(16, 19, 26)' }}
            >
              {/* We don't care to run validation on this img tag, so leave as is. */}
              <img
                src="https://spacepencil.co.uk/static/media/banner10.bf6b1165.png"
                height="150px"
                style={{ display: 'block' }}
              />
            </ctx.TD>
          </ctx.TR>
        </ctx.TBody>
      </ctx.Table>
    )
  }
})
export default Layout
