// defs
export const defs = {
  container: {
    type: 'key',
    map: 'container',
  },
  // display
  hidden: {
    type: 'value',
    map: 'display',
  },
  block: {
    type: 'value',
    map: 'display',
  },
  inline: {
    type: 'value',
    map: 'display',
  },
  flex: {
    type: 'fork',
    map: [
      // display
      {
        key: 'flex',
        map: 'display',
        type: 'value',
      },
      // direction
      {
        key: 'row',
        map: 'flexDirection',
        type: 'value',
      },
      {
        key: 'col',
        map: 'flexDirection',
        type: 'value',
      },
      // wrap
      {
        key: 'no',
        map: 'flexWrap',
        type: 'value',
      },
      {
        key: 'wrap',
        map: 'flexWrap',
        type: 'value',
      },
      // flex
      {
        key: '1',
        map: 'flex',
        type: 'value',
      },
      {
        key: 'auto',
        map: 'flex',
        type: 'value',
      },
      {
        key: 'initial',
        map: 'flex',
        type: 'value',
      },
      {
        key: 'none',
        map: 'flex',
        type: 'value',
      },
      // grow
      {
        key: 'grow',
        map: 'flexGrow',
        type: 'value',
      },
      // shrink
      {
        key: 'shrink',
        map: 'flexShrink',
        type: 'value',
      },
    ],
  },
  table: {
    type: 'fork',
    map: [
      // display
      {
        key: 'table',
        map: 'display',
        type: 'value',
      },
      // layout
      {
        key: 'auto',
        map: 'tableLayout',
        type: 'value',
      },
      {
        key: 'fixed',
        map: 'tableLayout',
        type: 'value',
      },
    ],
  },
  // floats
  float: {
    type: 'key',
    map: 'float',
  },
  clearfix: {
    type: 'key',
    map: 'clearfix',
  },
  // media
  object: {
    type: 'fork',
    map: [
      // fit
      {
        key: 'contain',
        map: 'objectFit',
        type: 'value',
      },
      {
        key: 'cover',
        map: 'objectFit',
        type: 'value',
      },
      {
        key: 'fill',
        map: 'objectFit',
        type: 'value',
      },
      {
        key: 'none',
        map: 'objectFit',
        type: 'value',
      },
      {
        key: 'scale',
        map: 'objectFit',
        type: 'value',
      },
      // position
      {
        key: 'bottom',
        map: 'objectPosition',
        type: 'value',
      },
      {
        key: 'center',
        map: 'objectPosition',
        type: 'value',
      },
      {
        key: 'left',
        map: 'objectPosition',
        type: 'value',
      },
      {
        key: 'right',
        map: 'objectPosition',
        type: 'value',
      },
      {
        key: 'top',
        map: 'objectPosition',
        type: 'value',
      },
    ],
  },
  // overflow
  overflow: {
    type: 'fork',
    map: [
      {
        key: 'auto',
        map: 'overflow',
        type: 'value',
      },
      {
        key: 'hidden',
        map: 'overflow',
        type: 'value',
      },
      {
        key: 'visible',
        map: 'overflow',
        type: 'value',
      },
      {
        key: 'scroll',
        map: 'overflow',
        type: 'value',
      },
      {
        key: 'x',
        map: 'overflowX',
        type: 'key',
      },
      {
        key: 'y',
        map: 'overflowX',
        type: 'key',
      },
    ],
  },
  scrolling: {
    type: 'value',
    map: 'scrolling',
  },
  // position
  static: {
    type: 'value',
    map: 'position',
  },
  fixed: {
    type: 'value',
    map: 'position',
  },
  absolute: {
    type: 'value',
    map: 'position',
  },
  relative: {
    type: 'value',
    map: 'position',
  },
  sticky: {
    type: 'value',
    map: 'position',
  },
  // inset
  inset: {
    type: 'fork',
    map: [
      {
        key: 'auto',
        map: 'inset',
        type: 'value',
      },
      {
        key: '0',
        map: 'inset',
        type: 'value',
      },
      {
        key: 'x',
        map: 'insetX',
        type: 'value',
      },
      {
        key: 'y',
        map: 'insetY',
        type: 'value',
      },
    ],
  },
  // pin
  top: {
    type: 'key',
    map: 'pin',
    key: 'top',
  },
  right: {
    type: 'key',
    map: 'pin',
    key: 'right',
  },
  bottom: {
    type: 'key',
    map: 'pin',
    key: 'bottom',
  },
  left: {
    type: 'key',
    map: 'pin',
    key: 'left',
  },
  // visibility
  visible: {
    type: 'key',
    map: 'visible',
  },
  invisible: {
    type: 'key',
    map: 'invisible',
  },
  z: {
    type: 'key',
    map: 'zIndex',
  },
  // borders
  border: {
    type: 'fork',
    map: [
      // color
      {
        key: 'transparent',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'black',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'white',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'gray',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'red',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'orange',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'yellow',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'green',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'teal',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'blue',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'indigo',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'purple',
        map: 'borderColor',
        type: 'value',
      },
      {
        key: 'pink',
        map: 'borderColor',
        type: 'value',
      },
      // style
      {
        key: 'solid',
        map: 'borderStyle',
        type: 'value',
      },
      {
        key: 'dashed',
        map: 'borderStyle',
        type: 'value',
      },
      {
        key: 'dotted',
        map: 'borderStyle',
        type: 'value',
      },
      {
        key: 'none',
        map: 'borderStyle',
        type: 'value',
      },
      // width
      {
        key: 'border',
        map: 'borderWidth',
        type: 'key',
      },
      {
        key: 't',
        map: 'borderWidth',
        type: 'key',
        alias: 'top',
      },
      {
        key: 'r',
        map: 'borderWidth',
        type: 'key',
        alias: 'right',
      },
      {
        key: 'b',
        map: 'borderWidth',
        type: 'key',
        alias: 'bottom',
      },
      {
        key: 'l',
        map: 'borderWidth',
        type: 'key',
        alias: 'left',
      },
      // table collapse
      {
        key: 'collapse',
        map: 'tableCollapse',
        type: 'value',
      },
      {
        key: 'separate',
        map: 'tableCollapse',
        type: 'value',
      },
    ],
  },
  rounded: {
    type: 'fork',
    map: [
      {
        key: 'rounded',
        map: 'borderRadius',
        type: 'value',
      },
      {
        key: 'none',
        map: 'borderRadius',
        type: 'value',
      },
      {
        key: 'sm',
        map: 'borderRadius',
        type: 'value',
      },
      {
        key: 'lg',
        map: 'borderRadius',
        type: 'value',
      },
      {
        key: 'full',
        map: 'borderRadius',
        type: 'value',
      },
      {
        key: 't',
        map: 'borderRadius',
        type: 'key',
        alias: 'top',
      },
      {
        key: 'r',
        map: 'borderRadius',
        type: 'key',
        alias: 'right',
      },
      {
        key: 'b',
        map: 'borderRadius',
        type: 'key',
        alias: 'bottom',
      },
      {
        key: 'l',
        map: 'borderRadius',
        type: 'key',
        alias: 'left',
      },
      {
        key: 'tl',
        map: 'borderRadius',
        type: 'key',
        alias: 'topLeft',
      },
      {
        key: 'tr',
        map: 'borderRadius',
        type: 'key',
        alias: 'topRight',
      },
      {
        key: 'bl',
        map: 'borderRadius',
        type: 'key',
        alias: 'bottomLeft',
      },
      {
        key: 'br',
        map: 'borderRadius',
        type: 'key',
        alias: 'bottomRight',
      },
    ],
  },
  // size
  w: {
    type: 'key',
    map: 'width',
  },
  h: {
    type: 'key',
    map: 'width',
  },
  min: {
    type: 'fork',
    map: [
      {
        key: 'w',
        map: 'minWidth',
        type: 'key',
      },
      {
        key: 'h',
        map: 'minHeight',
        type: 'key',
      },
    ],
  },
  max: {
    type: 'fork',
    map: [
      {
        key: 'w',
        map: 'minWidth',
        type: 'key',
      },
      {
        key: 'h',
        map: 'minHeight',
        type: 'key',
      },
    ],
  },
  // text
  text: {
    type: 'fork',
    map: [
      // color
      {
        key: 'transparent',
        map: 'color',
        type: 'value',
      },
      {
        key: 'black',
        map: 'color',
        type: 'value',
      },
      {
        key: 'white',
        map: 'color',
        type: 'value',
      },
      {
        key: 'gray',
        map: 'color',
        type: 'value',
      },
      {
        key: 'red',
        map: 'color',
        type: 'value',
      },
      {
        key: 'orange',
        map: 'color',
        type: 'value',
      },
      {
        key: 'yellow',
        map: 'color',
        type: 'value',
      },
      {
        key: 'green',
        map: 'color',
        type: 'value',
      },
      {
        key: 'teal',
        map: 'color',
        type: 'value',
      },
      {
        key: 'blue',
        map: 'color',
        type: 'value',
      },
      {
        key: 'indigo',
        map: 'color',
        type: 'value',
      },
      {
        key: 'purple',
        map: 'color',
        type: 'value',
      },
      {
        key: 'pink',
        map: 'color',
        type: 'value',
      },
      // size
      {
        key: 'xs',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: 'sm',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: 'base',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: 'lg',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: 'xl',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: '2xl',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: '3xl',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: '4xl',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: '5xl',
        map: 'fontSize',
        type: 'value',
      },
      {
        key: '6xl',
        map: 'fontSize',
        type: 'value',
      },
      // alignment
      {
        key: 'left',
        map: 'textAlignX',
        type: 'value',
      },
      {
        key: 'center',
        map: 'textAlignX',
        type: 'value',
      },
      {
        key: 'right',
        map: 'textAlignX',
        type: 'value',
      },
      {
        key: 'justify',
        map: 'textAlignX',
        type: 'value',
      },
    ],
  },
  font: {
    type: 'fork',
    map: [
      // famil
      {
        key: 'sans',
        map: 'fontFamily',
        type: 'value',
      },
      {
        key: 'serif',
        map: 'fontFamily',
        type: 'value',
      },
      {
        key: 'mono',
        map: 'fontFamily',
        type: 'value',
      },
      // weight
      {
        key: 'hairline',
        map: 'fontWeight',
        type: 'value',
      },
      {
        key: 'thin',
        map: 'fontWeight',
        type: 'value',
      },
      {
        key: 'light',
        map: 'fontWeight',
        type: 'value',
      },
      {
        key: 'normal',
        map: 'fontWeight',
        type: 'value',
      },
      {
        key: 'medium',
        map: 'fontWeight',
        type: 'value',
      },
      {
        key: 'semibold',
        map: 'fontWeight',
        type: 'value',
      },
      {
        key: 'bold',
        map: 'fontWeight',
        type: 'value',
      },
      {
        key: 'extrabold',
        map: 'fontWeight',
        type: 'value',
      },
      {
        key: 'black',
        map: 'fontWeight',
        type: 'value',
      },
    ],
  },
  italic: {
    map: 'fontStyle',
    type: 'value',
  },
  non: {
    map: 'fontStyle',
    type: 'value',
  },
  tracking: {
    map: 'letterSpacing',
    type: 'value',
  },
  leading: {
    map: 'lineHeight',
    type: 'value',
  },
  list: {
    type: 'fork',
    map: [
      // type
      {
        key: 'none',
        map: 'listType',
        type: 'value',
      },
      {
        key: 'disc',
        map: 'listType',
        type: 'value',
      },
      {
        key: 'decimal',
        map: 'listType',
        type: 'value',
      },
      // position
      {
        key: 'inside',
        map: 'listPosition',
        type: 'value',
      },
      {
        key: 'outside',
        map: 'listPosition',
        type: 'value',
      },
    ],
  },
  underline: {
    type: 'value',
    map: 'textDecoration',
  },
  line: {
    type: 'value',
    map: 'textDecoration',
  },
  no: {
    type: 'value',
    map: 'textDecoration',
  },
  uppercase: {
    type: 'value',
    map: 'textTransform',
  },
  lowercase: {
    type: 'value',
    map: 'textTransform',
  },
  capitalize: {
    type: 'value',
    map: 'textTransform',
  },
  normal: {
    type: 'value',
    map: 'textTransform',
  },
  // alignment
  align: {
    type: 'key',
    map: 'textAlignY',
  },
  whitespace: {
    type: 'key',
    map: 'whitespace',
  },
  break: {
    type: 'key',
    map: 'wordBreak',
  },
  items: {
    type: 'key',
    map: 'alignItems',
  },
  content: {
    type: 'key',
    map: 'alignContent',
  },
  self: {
    type: 'key',
    map: 'alignSelf',
  },
  justify: {
    type: 'key',
    map: 'justifyContent',
  },
  order: {
    type: 'key',
    map: 'flexOrder',
  },
  // spacing
  m: {
    type: 'key',
    map: 'margin',
  },
  mt: {
    type: 'key',
    map: 'margin',
    alias: 'top',
  },
  mr: {
    type: 'key',
    map: 'margin',
    alias: 'right',
  },
  mb: {
    type: 'key',
    map: 'margin',
    alias: 'bottom',
  },
  ml: {
    type: 'key',
    map: 'margin',
    alias: 'left',
  },
  mx: {
    type: 'key',
    map: 'margin',
    alias: 'x',
  },
  my: {
    type: 'key',
    map: 'margin',
    alias: 'y',
  },
  p: {
    type: 'key',
    map: 'padding',
  },
  pt: {
    type: 'key',
    map: 'padding',
    alias: 'top',
  },
  pr: {
    type: 'key',
    map: 'padding',
    alias: 'right',
  },
  pb: {
    type: 'key',
    map: 'padding',
    alias: 'bottom',
  },
  pl: {
    type: 'key',
    map: 'padding',
    alias: 'left',
  },
  px: {
    type: 'key',
    map: 'padding',
    alias: 'x',
  },
  py: {
      type: 'key',
      map: 'padding',
    alias: 'y',
  },
  // bg
  bg: {
    type: 'fork',
    map: [
      // attachement
      {
        key: 'fixed',
        type: 'value',
        map: 'bgAttachment',
      },
      {
        key: 'local',
        type: 'value',
        map: 'bgAttachment',
      },
      {
        key: 'scroll',
        type: 'value',
        map: 'bgAttachment',
      },
      // color
      {
        key: 'transparent',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'black',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'white',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'gray',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'red',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'orange',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'yellow',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'green',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'teal',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'blue',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'indigo',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'purple',
        map: 'bgColor',
        type: 'value',
      },
      {
        key: 'pink',
        map: 'bgColor',
        type: 'value',
      },
      // position
      {
        key: 'bottom',
        map: 'bgPosition',
        type: 'value',
      },
      {
        key: 'center',
        map: 'bgPosition',
        type: 'value',
      },
      {
        key: 'left',
        map: 'bgPosition',
        type: 'value',
      },
      {
        key: 'right',
        map: 'bgPosition',
        type: 'value',
      },
      {
        key: 'top',
        map: 'bgPosition',
        type: 'value',
      },
      // repeat
      {
        key: 'repeat',
        map: 'bgRepeat',
        type: 'value',
      },
      {
        key: 'no',
        map: 'bgRepeat',
        type: 'value',
      },
      // size
      {
        key: 'cover',
        map: 'bgSize',
        type: 'value',
      },
      {
        key: 'contain',
        map: 'bgSize',
        type: 'value',
      },
    ],
  },
  // interact
  appearance: {
    type: 'key',
    map: 'apperance',
  },
  cursor: {
    type: 'key',
    map: 'cursor',
  },
  outline: {
    type: 'key',
    map: 'outline',
  },
  pointer: {
    type: 'key',
    map: 'pointerEvents',
  },
  resize: {
    type: 'key',
    map: 'resize',
  },
  select: {
    type: 'key',
    map: 'userSelect',
  },
  // misc
  shadow: {
    type: 'key',
    map: 'shadow',
  },
  opacity: {
    type: 'key',
    map: 'shadow',
  },
  fill: {
    type: 'key',
    map: 'fill',
  },
  stroke: {
    type: 'key',
    map: 'stroke',
  },
}

export const cssPropTypes = {
  container: 'Boolean',
  display: 'String',
  clearfix: 'Boolean',
  float: 'String',
  objectFit: 'String',
  objectPosition: 'String',
  overflow: 'String',
  overflowX: 'String',
  overflowY: 'String',
  scrolling: 'String',
  position: 'String',
  inset: 'String',
  insetX: 'Boolean',
  insetY: 'Boolean',
  pin: 'Object',
  visible: 'Boolean',
  zIndex: ['String', 'Number'],
  borderColor: 'String',
  borderStyle: 'String',
  borderWidth: ['String', 'Number'],
  borderRadius: ['String', 'Boolean'],
  width: ['String', 'Number'],
  minWidth: ['String', 'Number'],
  maxWidth: 'String',
  height: ['String', 'Number'],
  minHeight: ['String', 'Number'],
  maxHeight: 'String',
  color: 'String',
  fontFamily: 'String',
  fontSize: 'String',
  fontSmoothing: ['String', 'Boolean'],
  fontStyle: 'String',
  fontWeight: 'String',
  letterSpacing: 'String',
  lineHeight: 'String',
  listType: 'String',
  listPosition: 'String',
  textAlignX: 'String',
  textAlignY: 'String',
  textDecoration: 'String',
  textTransform: 'String',
  whitespace: 'String',
  wordBreak: 'String',
  flex: ['String', 'Number'],
  flexDirection: 'String',
  flexWrap: ['String', 'Boolean'],
  alignItems: 'String',
  alignContent: 'String',
  alignSelf: 'String',
  justifyContent: 'String',
  flexGrow: 'Boolean',
  flexShrink: 'Boolean',
  flexOrder: ['String', 'Number'],
  tableCollapse: 'String',
  tableLayout: 'String',
  bgAttachment: 'String',
  bgColor: 'String',
  bgPosition: 'String',
  bgRepeat: 'String',
  bgSize: 'String',
  padding: ['Number', 'String', 'Object'],
  margin: ['Number', 'String', 'Object'],
  appearance: 'String',
  cursor: 'String',
  outline: 'String',
  pointerEvents: 'String',
  resize: ['String', 'Boolean'],
  userSelect: 'String',
  shadow: 'String',
  opacity: 'String',
  fill: 'Boolean',
  stroke: 'Boolean',
}
