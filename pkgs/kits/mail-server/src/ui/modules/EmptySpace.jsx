import React from 'react'
import z from '@z1/lib-feature-box-server'

export const emptySpace = z.fn((t, a) => (ctx) => {
  return (props) => {
    const style = {
      lineHeight: `${props.height}px`,
      fontSize: '1px',
      msoLineHeightRule: 'exactly',
    }
    return (
      <ctx.Table width="100%">
        <ctx.TBody key="email-emptyspace">
          <ctx.TR>
            <ctx.TD
              width="100%"
              height={`${props.height}px`}
              style={style}
              dangerouslySetInnerHTML={{ __html: '&nbsp;' }}
            />
          </ctx.TR>
        </ctx.TBody>
      </ctx.Table>
    )
  }
})
emptySpace.defaultProps = {
  height: '16',
}
export default emptySpace
