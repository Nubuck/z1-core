import React from 'react'
import z from '@z1/lib-feature-box-server'

export const header = z.fn((t, a) => (ctx) => {
  return (props) => {
    const style = {
      color: props.color,
      fontWeight: 'bold',
      backgroundColor: 'rgb(16, 19, 26)',
      fontFamily: 'Arial',
      padding: '20px',
    }
    return (
      <ctx.Table width="100%" height="120">
        <ctx.TBody key="email-header">
          <ctx.TR>
            <ctx.TD>
              <ctx.EmptySpace height={50} />

              {/* Text area, could be another component, i.e. HeroText */}
              <ctx.Table width="100%">
                <ctx.TBody key="email-header-logo">
                  <ctx.TR>
                    <ctx.TD align="center" style={style}>
                      {/* <img
                        height="120"
                        style={{
                          display: 'block',
                          maxHeight: '120px',
                        }}
                        src="https://spacepencil.co.uk/static/media/Roboteur-v2-white.9ec99d89.png"
                      /> */}
                    </ctx.TD>
                  </ctx.TR>
                </ctx.TBody>
              </ctx.Table>
            </ctx.TD>
          </ctx.TR>
        </ctx.TBody>
      </ctx.Table>
    )
  }
})

export default header
