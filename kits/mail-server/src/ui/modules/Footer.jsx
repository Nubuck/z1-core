import React from 'react'
import z from '@z1/lib-feature-box-server'

export const footer = z.fn((t, a) => (ctx) => {
  return (props) => {
    const style = {
      color: props.color,
      backgroundColor: 'rgb(16, 19, 26)',
    }

    const spaceStyle = {
      lineHeight: '1px',
      fontSize: '1px',
    }
    return (
      <ctx.Table width="100%" style={style}>
        <ctx.TBody key="email-footer">
          <ctx.TR>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
          </ctx.TR>

          <ctx.TR align="center" width="100%">
            <ctx.TD height="1" width="20" style={spaceStyle}>
              &nbsp;
            </ctx.TD>

            <ctx.TD>
              <ctx.Table width="100%">
                <ctx.TBody key="email-footer-link">
                  <ctx.TR>
                    <ctx.TD align="center" style={{ fontFamily: 'Arial' }}>
                      <ctx.EmptySpace height="10" />

                      <ctx.A
                        style={{
                          color: props.color,
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          border: `2px solid ${props.color}`,
                          borderRadius: '5px',
                          padding: '5px',
                        }}
                        href={t.at('verifyLink', props)}
                      >
                        {props.linkText}
                      </ctx.A>

                      <ctx.EmptySpace height="10" />
                    </ctx.TD>
                  </ctx.TR>
                </ctx.TBody>
              </ctx.Table>
            </ctx.TD>

            <ctx.TD height="1" width="20" style={spaceStyle}>
              &nbsp;
            </ctx.TD>
          </ctx.TR>

          <ctx.TR>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
            <ctx.TD>
              <ctx.EmptySpace height="20" />
            </ctx.TD>
          </ctx.TR>
        </ctx.TBody>
      </ctx.Table>
    )
  }
})

export default footer
