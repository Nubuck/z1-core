import React from 'react'
import z from '@z1/lib-feature-box-server'

export const body = z.fn((t, a) => (ctx) => {
  return (props) => {
    const textStyle = {
      color: props.color,
      backgroundColor: 'rgb(16, 19, 26)',
      fontFamily: 'Arial',
      fontSize: '18px',
      paddingLeft: '35px',
      paddingRight: '35px',
    }
    const isArray = t.isType(props.mailBody, 'array')
    return (
      <ctx.Table width="100%">
        <ctx.TBody key="Email-Body">
          {isArray
            ? t.mapIndexed((child, index) => {
                return (
                  <React.Fragment key={`child-${index}`}>
                    <ctx.TR>
                      <ctx.TD align="left" style={textStyle}>
                        {child}
                      </ctx.TD>
                    </ctx.TR>
                  </React.Fragment>
                )
              }, props.mailBody)
            : props.mailBody}
        </ctx.TBody>
      </ctx.Table>
    )
  }
})

export default body
