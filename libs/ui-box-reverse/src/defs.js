// defs
export const defs = {
  container: {
    map: 'container',
  },
  // display
  hidden: {
    map: 'display',
  },
  block: {
    map: 'display',
  },
  inline: {
    map: 'display',
  },
  flex: {
    map: [
      // display
      {
        key: 'flex',
        map: 'display',
      },
      // direction
      {
        key: 'row',
        map: 'flexDirection',
      },
      {
        key: 'col',
        map: 'flexDirection',
      },
      // wrap
      {
        key: 'no',
        map: 'flexWrap',
      },
      {
        key: 'wrap',
        map: 'flexWrap',
      },
      // flex
      {
        key: '1',
        map: 'flex',
      },
      {
        key: 'auto',
        map: 'flex',
      },
      {
        key: 'initial',
        map: 'flex',
      },
      {
        key: 'none',
        map: 'flex',
      },
      // grow
      {
        key: 'grow',
        map: 'flexGrow',
      },
      // shrink
      {
        key: 'shrink',
        map: 'flexShrink',
      },
    ],
  },
  table: {
    map: [
      // display
      {
        key: 'table',
        map: 'display',
      },
      // layout
      {
        key: 'auto',
        map: 'tableLayout',
      },
      {
        key: 'fixed',
        map: 'tableLayout',
      },
    ],
  },
  // floats
  float: {
    map: 'float',
  },
  clearfix: {
    map: 'clearfix',
  },
  // media
  object: {
    map: [
      // fit
      {
        key: 'contain',
        map: 'objectFit',
      },
      {
        key: 'cover',
        map: 'objectFit',
      },
      {
        key: 'fill',
        map: 'objectFit',
      },
      {
        key: 'none',
        map: 'objectFit',
      },
      {
        key: 'scale',
        map: 'objectFit',
      },
      // position
      {
        key: 'bottom',
        map: 'objectPosition',
      },
      {
        key: 'center',
        map: 'objectPosition',
      },
      {
        key: 'left',
        map: 'objectPosition',
      },
      {
        key: 'right',
        map: 'objectPosition',
      },
      {
        key: 'top',
        map: 'objectPosition',
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
      },
      {
        key: 'hidden',
        map: 'overflow',
      },
      {
        key: 'visible',
        map: 'overflow',
      },
      {
        key: 'scroll',
        map: 'overflow',
      },
      {
        key: 'x',
        map: 'overflowX',
      },
      {
        key: 'y',
        map: 'overflowY',
      },
    ],
  },
  scrolling: {
    map: 'scrolling',
  },
  // position
  static: {
    map: 'position',
  },
  fixed: {
    map: 'position',
  },
  absolute: {
    map: 'position',
  },
  relative: {
    map: 'position',
  },
  sticky: {
    map: 'position',
  },
  // inset
  inset: {
    map: [
      {
        key: 'auto',
        map: 'inset',
      },
      {
        key: '0',
        map: 'inset',
      },
      {
        key: 'x',
        map: 'insetX',
      },
      {
        key: 'y',
        map: 'insetY',
      },
    ],
  },
  // pin
  top: {
    map: 'pin',
    key: 'top',
  },
  right: {
    map: 'pin',
    key: 'right',
  },
  bottom: {
    map: 'pin',
    key: 'bottom',
  },
  left: {
    map: 'pin',
    key: 'left',
  },
  // visibility
  visible: {
    map: 'visible',
  },
  invisible: {
    map: 'invisible',
  },
  z: {
    map: 'zIndex',
  },
  // borders
  border: {
    map: [
      // color
      {
        key: 'transparent',
        map: 'borderColor',
      },
      {
        key: 'black',
        map: 'borderColor',
      },
      {
        key: 'white',
        map: 'borderColor',
      },
      {
        key: 'gray',
        map: 'borderColor',
      },
      {
        key: 'red',
        map: 'borderColor',
      },
      {
        key: 'orange',
        map: 'borderColor',
      },
      {
        key: 'yellow',
        map: 'borderColor',
      },
      {
        key: 'green',
        map: 'borderColor',
      },
      {
        key: 'teal',
        map: 'borderColor',
      },
      {
        key: 'blue',
        map: 'borderColor',
      },
      {
        key: 'indigo',
        map: 'borderColor',
      },
      {
        key: 'purple',
        map: 'borderColor',
      },
      {
        key: 'pink',
        map: 'borderColor',
      },
      // style
      {
        key: 'solid',
        map: 'borderStyle',
      },
      {
        key: 'dashed',
        map: 'borderStyle',
      },
      {
        key: 'dotted',
        map: 'borderStyle',
      },
      {
        key: 'none',
        map: 'borderStyle',
      },
      // width
      {
        key: 'border',
        map: 'borderWidth',
      },
      {
        key: 't',
        map: 'borderWidth',
        alias: 'top',
      },
      {
        key: 'r',
        map: 'borderWidth',
        alias: 'right',
      },
      {
        key: 'b',
        map: 'borderWidth',
        alias: 'bottom',
      },
      {
        key: 'l',
        map: 'borderWidth',
        alias: 'left',
      },
      // table collapse
      {
        key: 'collapse',
        map: 'tableCollapse',
      },
      {
        key: 'separate',
        map: 'tableCollapse',
      },
    ],
  },
  rounded: {
    type: 'fork',
    map: [
      {
        key: 'rounded',
        map: 'borderRadius',
      },
      {
        key: 'none',
        map: 'borderRadius',
      },
      {
        key: 'sm',
        map: 'borderRadius',
      },
      {
        key: 'lg',
        map: 'borderRadius',
      },
      {
        key: 'full',
        map: 'borderRadius',
      },
      {
        key: 't',
        map: 'borderRadius',
        alias: 'top',
      },
      {
        key: 'r',
        map: 'borderRadius',
        alias: 'right',
      },
      {
        key: 'b',
        map: 'borderRadius',
        alias: 'bottom',
      },
      {
        key: 'l',
        map: 'borderRadius',
        alias: 'left',
      },
      {
        key: 'tl',
        map: 'borderRadius',
        alias: 'topLeft',
      },
      {
        key: 'tr',
        map: 'borderRadius',
        alias: 'topRight',
      },
      {
        key: 'bl',
        map: 'borderRadius',
        alias: 'bottomLeft',
      },
      {
        key: 'br',
        map: 'borderRadius',
        alias: 'bottomRight',
      },
    ],
  },
  // size
  w: {
    map: 'width',
  },
  h: {
    map: 'height',
  },
  min: {
    map: [
      {
        key: 'w',
        map: 'minWidth',
      },
      {
        key: 'h',
        map: 'minHeight',
      },
    ],
  },
  max: {
    map: [
      {
        key: 'w',
        map: 'maxWidth',
      },
      {
        key: 'h',
        map: 'maxHeight',
      },
    ],
  },
  // text
  text: {
    map: [
      // color
      {
        key: 'transparent',
        map: 'color',
      },
      {
        key: 'black',
        map: 'color',
      },
      {
        key: 'white',
        map: 'color',
      },
      {
        key: 'gray',
        map: 'color',
      },
      {
        key: 'red',
        map: 'color',
      },
      {
        key: 'orange',
        map: 'color',
      },
      {
        key: 'yellow',
        map: 'color',
      },
      {
        key: 'green',
        map: 'color',
      },
      {
        key: 'teal',
        map: 'color',
      },
      {
        key: 'blue',
        map: 'color',
      },
      {
        key: 'indigo',
        map: 'color',
      },
      {
        key: 'purple',
        map: 'color',
      },
      {
        key: 'pink',
        map: 'color',
      },
      // size
      {
        key: 'xs',
        map: 'fontSize',
      },
      {
        key: 'sm',
        map: 'fontSize',
      },
      {
        key: 'base',
        map: 'fontSize',
      },
      {
        key: 'lg',
        map: 'fontSize',
      },
      {
        key: 'xl',
        map: 'fontSize',
      },
      {
        key: '2xl',
        map: 'fontSize',
      },
      {
        key: '3xl',
        map: 'fontSize',
      },
      {
        key: '4xl',
        map: 'fontSize',
      },
      {
        key: '5xl',
        map: 'fontSize',
      },
      {
        key: '6xl',
        map: 'fontSize',
      },
      // alignment
      {
        key: 'left',
        map: 'textAlignX',
      },
      {
        key: 'center',
        map: 'textAlignX',
      },
      {
        key: 'right',
        map: 'textAlignX',
      },
      {
        key: 'justify',
        map: 'textAlignX',
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
      },
      {
        key: 'serif',
        map: 'fontFamily',
      },
      {
        key: 'mono',
        map: 'fontFamily',
      },
      // weight
      {
        key: 'hairline',
        map: 'fontWeight',
      },
      {
        key: 'thin',
        map: 'fontWeight',
      },
      {
        key: 'light',
        map: 'fontWeight',
      },
      {
        key: 'normal',
        map: 'fontWeight',
      },
      {
        key: 'medium',
        map: 'fontWeight',
      },
      {
        key: 'semibold',
        map: 'fontWeight',
      },
      {
        key: 'bold',
        map: 'fontWeight',
      },
      {
        key: 'extrabold',
        map: 'fontWeight',
      },
      {
        key: 'black',
        map: 'fontWeight',
      },
    ],
  },
  italic: {
    map: 'fontStyle',
  },
  antialiased: { map: 'fontStyle' },
  non: {
    map: 'fontStyle',
  },
  tracking: {
    map: 'letterSpacing',
  },
  leading: {
    map: 'lineHeight',
  },
  list: {
    type: 'fork',
    map: [
      // type
      {
        key: 'none',
        map: 'listType',
      },
      {
        key: 'disc',
        map: 'listType',
      },
      {
        key: 'decimal',
        map: 'listType',
      },
      // position
      {
        key: 'inside',
        map: 'listPosition',
      },
      {
        key: 'outside',
        map: 'listPosition',
      },
    ],
  },
  underline: {
    map: 'textDecoration',
  },
  line: {
    map: 'textDecoration',
  },
  no: {
    map: 'textDecoration',
  },
  uppercase: {
    map: 'textTransform',
  },
  lowercase: {
    map: 'textTransform',
  },
  capitalize: {
    map: 'textTransform',
  },
  normal: {
    map: 'textTransform',
  },
  // alignment
  align: {
    map: 'textAlignY',
  },
  whitespace: {
    map: 'whitespace',
  },
  break: {
    map: 'wordBreak',
  },
  items: {
    map: 'alignItems',
  },
  content: {
    map: 'alignContent',
  },
  self: {
    map: 'alignSelf',
  },
  justify: {
    map: 'justifyContent',
  },
  order: {
    map: 'flexOrder',
  },
  // spacing
  m: {
    map: 'margin',
  },
  mt: {
    map: 'margin',
    alias: 'top',
  },
  mr: {
    map: 'margin',
    alias: 'right',
  },
  mb: {
    map: 'margin',
    alias: 'bottom',
  },
  ml: {
    map: 'margin',
    alias: 'left',
  },
  mx: {
    map: 'margin',
    alias: 'x',
  },
  my: {
    map: 'margin',
    alias: 'y',
  },
  '-m': {
    map: 'margin',
  },
  '-mt': {
    map: 'margin',
    alias: 'top',
  },
  '-mr': {
    map: 'margin',
    alias: 'right',
  },
  '-mb': {
    map: 'margin',
    alias: 'bottom',
  },
  '-ml': {
    map: 'margin',
    alias: 'left',
  },
  '-mx': {
    map: 'margin',
    alias: 'x',
  },
  '-my': {
    map: 'margin',
    alias: 'y',
  },
  p: {
    map: 'padding',
  },
  pt: {
    map: 'padding',
    alias: 'top',
  },
  pr: {
    map: 'padding',
    alias: 'right',
  },
  pb: {
    map: 'padding',
    alias: 'bottom',
  },
  pl: {
    map: 'padding',
    alias: 'left',
  },
  px: {
    map: 'padding',
    alias: 'x',
  },
  py: {
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

        map: 'bgAttachment',
      },
      {
        key: 'local',

        map: 'bgAttachment',
      },
      {
        key: 'scroll',

        map: 'bgAttachment',
      },
      // color
      {
        key: 'transparent',
        map: 'bgColor',
      },
      {
        key: 'black',
        map: 'bgColor',
      },
      {
        key: 'white',
        map: 'bgColor',
      },
      {
        key: 'gray',
        map: 'bgColor',
      },
      {
        key: 'red',
        map: 'bgColor',
      },
      {
        key: 'orange',
        map: 'bgColor',
      },
      {
        key: 'yellow',
        map: 'bgColor',
      },
      {
        key: 'green',
        map: 'bgColor',
      },
      {
        key: 'teal',
        map: 'bgColor',
      },
      {
        key: 'blue',
        map: 'bgColor',
      },
      {
        key: 'indigo',
        map: 'bgColor',
      },
      {
        key: 'purple',
        map: 'bgColor',
      },
      {
        key: 'pink',
        map: 'bgColor',
      },
      // position
      {
        key: 'bottom',
        map: 'bgPosition',
      },
      {
        key: 'center',
        map: 'bgPosition',
      },
      {
        key: 'left',
        map: 'bgPosition',
      },
      {
        key: 'right',
        map: 'bgPosition',
      },
      {
        key: 'top',
        map: 'bgPosition',
      },
      // repeat
      {
        key: 'repeat',
        map: 'bgRepeat',
      },
      {
        key: 'no',
        map: 'bgRepeat',
      },
      // size
      {
        key: 'cover',
        map: 'bgSize',
      },
      {
        key: 'contain',
        map: 'bgSize',
      },
    ],
  },
  // interact
  appearance: {
    map: 'apperance',
  },
  cursor: {
    map: 'cursor',
  },
  outline: {
    map: 'outline',
  },
  pointer: {
    map: 'pointerEvents',
  },
  resize: {
    map: 'resize',
  },
  select: {
    map: 'userSelect',
  },
  // misc
  shadow: {
    map: 'shadow',
  },
  opacity: {
    map: 'shadow',
  },
  fill: {
    map: 'fill',
  },
  stroke: {
    map: 'stroke',
  },
}
