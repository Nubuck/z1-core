# Z1 Lib UI Box Tailwind

[Tailwind css](https://tailwindcss.com/) is the best™ functional css framework out.
The functional css approach is the best™ because who really wants to deal with writing
that css, scss or esoteric runtime generated css-in-js noise, let alone performing the mystical ritual
of configuring the packing for any pre or post processing magic needed to ship anything?

Not me.

That said functional css is also not the best™ when you end up with a monsterously long line of classNames to style an element. Terrible to read and edit at volume.

This library offers a solution to managing and mutating functional css classNames in a way that's comfortably functional and css-in-js'esque, across any platform free of any runtime DOM concerns.

Ui Box essentially takes a plain object input representing the root [classNames](https://nerdcave.com/tailwind-cheat-sheet) of [Tailwind css](https://tailwindcss.com/) and returns a chained object with a method to mutate the object or render the box state to a monsterously long line of classNames, so you don't have to.

## Usage

### Install

```
yarn add @z1/lib-ui-box-tailwind
```

```
npm i --save @z1/lib-ui-box-tailwind
```

### Import

```JavaScript

import { uiBox, toCss } from '@z1/lib-ui-box-tailwind'

```

### Top level functions

```TypeScript
interface UiBox = {
  next: (box: CssProps) => UiBox;
  toBox: () => CssProps;
  toCss: () => string;
}
declare function uiBox(box: CssProps): UiBox {}
declare function toCss(box: CssProps): string {}
```

### Example

```JavaScript

import { toCss, uiBox } from '@z1/lib-ui-box-tailwind'

const baseElement = uiBox({
  display: 'flex',
  flexDirection: ['col', { md: 'row' }],
  alignItems: 'center',
  justifySelf: 'stretch',
  borderWidth: true,
  borderRadius: [
    { topLeft: 'sm', bottomRight: 'sm' },
    {
      md: { topLeft: 'lg', bottomRight: 'lg' },
    },
  ],
  borderColor: ['blue-500', { hover: 'transparent' }],
  bgColor: [null, { hover: 'blue-500' }],
  color: ['blue-500', { hover: 'white' }],
  className: 'element',
})
const defaultClassNames = baseElement.toCss()
// defaultClassNames === 'flex flex-col md:flex-row items-center border rounded-tl-sm rounded-br-sm md:rounded-tl-lg md:rounded-br-lg border-blue-500 hover:border-transparent hover:bg-blue-500 text-blue-500 hover:text-white element'

const warningClassNames = baseElement
  .next({
    borderColor: ['orange-500', { hover: 'transparent' }],
    bgColor: [null, { hover: 'orange-500' }],
    color: ['orange-500', { hover: 'white' }],
    className: 'warning',
  })
  .toCss()
// warningClassNames === 'flex flex-col md:flex-row items-center border rounded-tl-sm rounded-br-sm md:rounded-tl-lg md:rounded-br-lg border-orange-500 hover:border-transparent hover:bg-orange-500 text-orange-500 hover:text-white warning'

const dangerElement = baseElement.next({
  borderColor: ['red-500', { hover: 'transparent' }],
  bgColor: [null, { hover: 'red-500' }],
  color: ['red-500', { hover: 'white' }],
  fontWeight: 'bold',
  className: 'danger',
})

const successElement = baseElement.next({
  borderColor: ['green-500', { hover: 'transparent' }],
  bgColor: [null, { hover: 'green-500' }],
  color: ['green-500', { hover: 'white' }],
  fontWeight: 'bolder',
  className: 'success',
})

// Mutate the box state before rendering
const infoProps = {
  borderColor: ['teal-500', { hover: 'transparent' }],
  bgColor: [null, { hover: 'teal-500' }],
  color: ['teal-500', { hover: 'white' }],
}
const infoClassNames = successElement
  .next(infoProps)
  .next({
    fontWeight: 'medium',
    className: 'info',
  })
  .toCss()
// infoClassNames === 'flex flex-col md:flex-row items-center border rounded-tl-sm rounded-br-sm md:rounded-tl-lg md:rounded-br-lg border-teal-500 hover:border-transparent hover:bg-teal-500 text-teal-500 hover:text-white info font-medium'

const fontProps = {
  fontWeight: 'bolder',
  fontSize: ['xl', { md: '2xl' }],
}
const noticeClassNames = dangerElement
  .next({
    borderColor: 'yellow-500',
    bgColor: 'yellow-500',
    color: 'gray-900',
    className: 'notice',
  })
  .next(fontProps)
  .toCss()
// noticeClassNames === 'flex flex-col md:flex-row items-center border rounded-tl-sm rounded-br-sm md:rounded-tl-lg md:rounded-br-lg border-yellow-500 bg-yellow-500 text-gray-900 notice font-bolder text-xl md:text-2xl'

// Shorthand render
const classNames = toCss({
  display: ['block', { sm: 'inline-block' }],
  borderColor: 'blue-500'
})
// classNames === 'block border-blue-500 sm:inline-block'

```

### CssProps

An object representing the root [classNames](https://nerdcave.com/tailwind-cheat-sheet) and their variations of properties.

A className property can either be the xs size or multiple sizes and modifiers as a Tuple with the head being the xs size and
the tail being an object of modifiers.

```TypeScript
type ClassNameType = boolean | string | number | object

interface CommonModifiers = {
  sm?: classNameType;
  md?: classNameType;
  lg?: classNameType;
  xl?: classNameType;
  hover?: classNameType;
}

let classNameTuple: [ ClassNameType, CommonModifiers]
```

#### Available CssProp Types

```TypeScript
// color range depends on your Tailwind config
type ColorName = string | null

// layout
type Container = boolean | null
type Display = 'hidden'
  | 'block'
  | 'flex'
  | 'inline-flex'
  | 'inline'
  | 'table'
  | 'table-row'
  | 'table-cell'
  | null
type Clearfix = boolean | null
type Float = 'right'
  | 'left'
  | 'none'
  | null
type ObjectFit = 'contain'
  | 'cover'
  | 'fill'
  | 'none'
  | 'scale-down'
  | null
type ObjectPosition = 'bottom'
  | 'center'
  | 'left'
  | 'left-bottom'
  | 'left-top'
  | 'right'
  | 'right-bottom'
  | 'right-top'
  | 'top'
  | null
type Overflow = 'auto'
  | 'visible'
  | 'hidden'
  | 'scroll'
  | null
type Scrolling = 'touch' | 'auto' | null
type Position = 'static'
  | 'fixed'
  | 'absolute'
  | 'relative'
  | 'sticky'
  | null
type Inset = 0 | 'auto' | null
interface Pin = {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
} | null
type Visible = boolean | null
type ZIndex = 'auto'
  | 0
  | 10
  | 20
  | 30
  | 40
  | 50
  | null

// borders
type BorderColor = ColorName | null
type BorderStyle = 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'none'
  | null
type BorderWidthRange = boolean
  | 0
  | 2
  | 4
  | null
interface BorderWidthSides = {
  top?: BorderWidthRange;
  right?: BorderWidthRange;
  bottom?: BorderWidthRange;
  left?: BorderWidthRange;
}
type BorderWidth = BorderWidthRange | BorderWidthSides
type RadiusRange = boolean
  | 'none'
  | 'sm'
  | 'lg'
  | 'full'
  | null
interface RadiusSides = {
  top?: RadiusRange;
  right?: RadiusRange;
  bottom?: RadiusRange;
  left?: RadiusRange;
  topRight?: RadiusRange;
  bottomRight?: RadiusRange;
  bottomLeft?: RadiusRange;
  topLeft?: RadiusRange;
}
type BorderRadius = RadiusRange | RadiusSides

// sizing
type Width = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
  | 10 | 12 | 16 | 20 | 24
  | 32 | 40 | 48 | 56 | 64
  | 'auto'
  | 'px'
  | '1/2' | '1/3' | '2/3'
  | '1/4' | '2/4' | '3/4'
  | '1/5' | '2/5' | '3/5' | '4/5'
  | '1/6' | '2/6' | '3/6' | '4/6' | '5/6'
  | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12'
  | '7/12' | '8/12' | '9/12' | '10/12' | '11/12'
  | 'full'
  | 'screen'
  | null
type MinWidth = 0 | 'full' | null
type MaxWidth = 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | 'full'
  | null
type Height = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
  | 10 | 12 | 16 | 20 | 24
  | 32 | 40 | 48 | 56 | 64
  | 'auto'
  | 'px'
  | 'screen'
  | null
type MinHeight = 0 | 'full' | 'screen' | null
type MaxHeight = 'full' | 'screen' | null

// typography
type Color = ColorName | null
type FontFamily = 'sans' | 'serif' | 'mono' | null
type FontSize = 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | 'base'
  | null
type FontSmoothing = boolean | 'subpixel' | null
type FontStyle = 'normal' | 'italic' | null
type FontWeight = 'hairline'
  | 'thin'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'
  | null
type LetterSpacing = 'tighter'
  | 'tight'
  | null
type LineHeight = 'none'
  | 'tight'
  | 'snug'
  | 'normal'
  | 'relaxed'
  | 'loose'
  | null
type ListType = 'none'
  | 'disc'
  | 'decimal'
  | null
type ListPosition = 'inside' | 'outside' | null
type TextAlignX = 'left'
  | 'center'
  | 'right'
  | 'justify'
  | null
type TextAlignY = 'baseline'
  | 'top'
  | 'middle'
  | 'bottom'
  | 'text-top'
  | 'text-bottom'
  | null
type TextDecoration = 'underline'
  | 'none'
  | 'line-through'
  | null
type TextTransform = 'normal'
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | null
type Whitespace = 'normal'
  | 'no-wrap'
  | 'pre'
  | 'pre-line'
  | 'pre-wrap'
  | null
type WordBreak = 'normal'
  | 'words'
  | 'all'
  | 'truncate'
  | null

// flexbox
type Flex = 1
  | 'auto'
  | 'initial'
  | 'none'
  | null
type FlexDirection = 'row'
  | 'row-reverse'
  | 'col'
  | 'col-reverse'
  | null
type FlexWrap = boolean | 'reverse' | null
type AlignItems = 'stretch'
  | 'start'
  | 'center'
  | 'end'
  | 'baseline'
  | null
type AlignContent = 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | null
type AlignSelf = 'auto'
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'
  | null
type JustifyContent = 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | null
type FlexGrow = boolean | null
type FlexShrink = boolean | null
type FlexOrder = 'first'
  | 'last'
  | 'none'
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
  | 10 | 12
  | null

// tables
type TableCollapse = boolean | null
type TableLayout = 'auto' | 'fixed' | null

// backgrounds
type BgAttachment = 'fixed' | 'local' | 'scroll' | null
type BgColor = ColorName | null
type BgPosition = 'bottom'
  | 'center'
  | 'left'
  | 'left-bottom'
  | 'left-top'
  | 'right'
  | 'right-bottom'
  | 'right-top'
  | 'top'
  | null
type BgRepeat = 'repeat'
  | 'no-repeat'
  | 'repeat-x'
  | 'repeat-y'
  | 'repeat-round'
  | 'repeat-space'
  | null
type BgSize = 'auto' | 'cover' | 'contain' | null

// spacing
type PaddingRange =  0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
  | 10 | 12 | 16 | 20 | 24
  | 32 | 40 | 48 | 56 | 64
  | 'px'
  | null
interface PaddingSides = {
  x?: PaddingRange;
  y?: PaddingRange;
  top?: PaddingRange;
  right?: PaddingRange;
  bottom?: PaddingRange;
  left?: PaddingRange;
}
type Padding = PaddingRange | PaddingSides
type MarginRange = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
  | 10 | 12 | 16 | 20 | 24
  | 32 | 40 | 48 | 56 | 64
  | 'auto'
  | 'px'
  | -1 | -2 | -3 | -4 | -5 | -6 | -8
  | -10 | -12 | -16 | -20 | -24
  | -32 | -40 | -48 | -56 | -64
interface MarginSides = {
  x?: MarginRange;
  y?: MarginRange;
  top?: MarginRange;
  right?: MarginRange;
  bottom?: MarginRange;
  left?: MarginRange;
}
type Margin = MarginRange | MarginSides

// interactivity
type Appearance = 'none' | null
type Cursor = 'auto' 
  | 'default'
  | 'pointer'
  | 'wait'
  | 'text'
  | 'move'
  | 'not-allowed'
  | null
type Outline = 'none' | null
type PointerEvents = 'none' | 'auto' | null
type Resize = boolean | 'none' | 'x' | 'y' | null
type UserSelect = 'none' 
  | 'text' 
  | 'all' 
  | 'auto' 
  | null

// misc
type Shadow = boolean 
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'inner'
  | 'outline'
  | 'none'
  | null
type Opacity = 0 
  | 25
  | 50
  | 75
  | 100
  | null
type Fill = boolean | null
type Stroke = boolean | null

// extra classNames to add to output
type ClassName = string | null

```

#### CssProps Interface

```TypeScript
type Mod = 'sm' 
  | 'md' 
  | 'lg' 
  | 'xl' 
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled'
  | 'visited'
  | 'first'
  | 'last'
  | 'odd'
  | 'even'
  | 'group-hover'
  | 'focus-within'

interface CssProps = {
   // layout
  container?: Container | [Container, { [key: Mod]: Container; }];
  display?: Display | [Display, { [key: Mod]: Display; }];
  clearfix?: Clearfix | [Clearfix, { [key: Mod]: Clearfix; }];
  float?: Float | [Float, { [key: Mod]: Float; }];
  objectFit?: ObjectFit | [ObjectFit, { [key: Mod]: ObjectFit; }];
  objectPosition?: ObjectPosition | [ObjectPosition, { [key: Mod]: ObjectPosition; }];
  overflow?: Overflow | [Overflow, { [key: Mod]: Overflow; }];
  overflowX?: Overflow | [Overflow, { [key: Mod]: Overflow; }];
  overflowY?: Overflow | [Overflow, { [key: Mod]: Overflow; }];
  scrolling?: Scrolling | [Scrolling, { [key: Mod]: Scrolling; }];
  position?: Position | [Position, { [key: Mod]: Position; }];
  inset?: Inset | [Inset, { [key: Mod]: Inset; }];
  insetX?: Inset | [Inset, { [key: Mod]: Inset; }];
  insetY?: Inset | [Inset, { [key: Mod]: Inset; }];
  pin?: Pin | [Pin, { [key: Mod]: Pin; }];
  visible?: Visible | [Visible, { [key: Mod]: Visible; }];
  zIndex?: ZIndex | [ZIndex, { [key: Mod]: ZIndex; }];
   // borders
  borderColor?: BorderColor | [BorderColor, { [key: Mod]: BorderColor; }];
  borderStyle?: BorderStyle | [BorderStyle, { [key: Mod]: BorderStyle; }];
  borderWidth?: BorderWidth | [BorderWidth, { [key: Mod]: BorderWidth; }];
  borderRadius?: BorderRadius | [BorderRadius, { [key: Mod]: BorderRadius; }];
   // sizing
  width?: Width | [Width, { [key: Mod]: Width; }];
  minWidth?: MinWidth | [MinWidth, { [key: Mod]: MinWidth; }];
  maxWidth?: MaxWidth | [MaxWidth, { [key: Mod]: MaxWidth; }];
  height?: Height | [Height, { [key: Mod]: Height; }];
  minHeight?: MinHeight | [MinHeight, { [key: Mod]: MinHeight; }];
  maxHeight?: MaxHeight | [MaxHeight, { [key: Mod]: MaxHeight; }];
  // typography
  color?: Color | [Color, { [key: Mod]: Color; }];
  fontFamily?: FontFamily | [FontFamily, { [key: Mod]: FontFamily; }];
  fontSize?: FontSize | [FontSize, { [key: Mod]: FontSize; }];
  fontSmoothing?: FontSmoothing | [FontSmoothing, { [key: Mod]: FontSmoothing; }];
  fontStyle?: FontStyle | [FontStyle, { [key: Mod]: FontStyle; }];
  fontWeight?: FontWeight | [FontWeight, { [key: Mod]: FontWeight; }];
  letterSpacing?: LetterSpacing | [LetterSpacing, { [key: Mod]: LetterSpacing; }];
  lineHeight?: LineHeight | [LineHeight, { [key: Mod]: LineHeight; }];
  listType?: ListType | [ListType, { [key: Mod]: ListType; }];
  listPosition?: ListPosition | [ListPosition, { [key: Mod]: ListPosition; }];
  textAlignX?: TextAlignX | [TextAlignX, { [key: Mod]: TextAlignX; }];
  textAlignY?: TextAlignY | [TextAlignY, { [key: Mod]: TextAlignY; }];
  textDecoration?: TextDecoration | [TextDecoration, { [key: Mod]: TextDecoration; }];
  textTransform?: TextTransform | [TextTransform, { [key: Mod]: TextTransform; }];
  whitespace?: Whitespace | [Whitespace, { [key: Mod]: Whitespace; }];
  wordBreak?: WordBreak | [WordBreak, { [key: Mod]: WordBreak; }];
  // flexbox
  flex?: Flex | [Flex, { [key: Mod]: Flex; }];
  flexDirection?: FlexDirection | [FlexDirection, { [key: Mod]: FlexDirection; }];
  flexWrap?: FlexWrap | [FlexWrap, { [key: Mod]: FlexWrap; }];
  alignItems?: AlignItems | [AlignItems, { [key: Mod]: AlignItems; }];
  alignContent?: AlignContent | [AlignContent, { [key: Mod]: AlignContent; }];
  alignSelf?: AlignSelf | [AlignSelf, { [key: Mod]: AlignSelf; }];
  justifyContent?: JustifyContent | [JustifyContent, { [key: Mod]: JustifyContent; }];
  flexGrow?: FlexGrow | [FlexGrow, { [key: Mod]: FlexGrow; }];
  flexShrink?: FlexShrink | [FlexShrink, { [key: Mod]: FlexShrink; }];
  flexOrder?: FlexOrder | [FlexOrder, { [key: Mod]: FlexOrder; }];
  // tables
  tableCollapse?: TableCollapse | [TableCollapse, { [key: Mod]: TableCollapse; }];
  tableLayout?: TableLayout | [TableLayout, { [key: Mod]: TableLayout; }];
  // backgrounds
  bgAttachment?: BgAttachment | [BgAttachment, { [key: Mod]: BgAttachment; }];
  bgColor?: BgColor | [BgColor, { [key: Mod]: BgColor; }];
  bgPosition?: BgPosition | [BgPosition, { [key: Mod]: BgPosition; }];
  bgRepeat?: BgRepeat | [BgRepeat, { [key: Mod]: BgRepeat; }];
  bgSize?: BgSize | [BgSize, { [key: Mod]: BgSize; }];
  // spacing
  padding?: Padding | [Padding, { [key: Mod]: Padding; }];
  margin?: Margin | [Margin, { [key: Mod]: Margin; }];
  // interactivity
  appearance?: Appearance | [Appearance, { [key: Mod]: Appearance; }];
  cursor?: Cursor | [Cursor, { [key: Mod]: Cursor; }];
  outline?: Outline | [Outline, { [key: Mod]: Outline; }];
  pointerEvents?: PointerEvents | [PointerEvents, { [key: Mod]: PointerEvents; }];
  resize?: Resize | [Resize, { [key: Mod]: Resize; }];
  userSelect?: UserSelect | [UserSelect, { [key: Mod]: UserSelect; }];
  // misc
  shadow?: Shadow | [Shadow, { [key: Mod]: Shadow; }];
  opacity?: Opacity | [Opacity, { [key: Mod]: Opacity; }];
  fill?: Fill | [Fill, { [key: Mod]: Fill; }];
  stroke?: Stroke | [Stroke, { [key: Mod]: Stroke; }];
  className?: ClassName | [ClassName, { [key: Mod]: ClassName; }];
}

```

### Converting Tailwind classNames into CssProps

[Z1 Lib UI Box Reverse](https://github.com/SaucecodeOfficial/zero-one-core/tree/master/libs/ui-box-reverse) does the opposite of this lib. It takes a string of Tailwind classNames and returns a CssProps object.
