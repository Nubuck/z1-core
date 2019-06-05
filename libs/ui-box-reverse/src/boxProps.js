import { task } from '@z1/preset-task'

// main
export const boxProps = task(t => ({
  container({ base, mod }) {
    if (t.and(t.isZeroLen(base), t.isZeroLen(mod))) {
      return null
    }
    if (t.isZeroLen(mod)) {
      return true
    }
    return [
      t.isZeroLen(base) ? null : true,
      t.mergeAll(
        t.map(item => {
          return { [item.prefix]: true }
        }, mod)
      ),
    ]
  },
  display({ base, mod }) {
    if (t.and(t.isZeroLen(base), t.isZeroLen(mod))) {
      return null
    }
    if (t.isZeroLen(mod)) {
      return t.pathOr(null, ['css'], t.head(base))
    }
    return [
      t.isZeroLen(base) ? null : t.pathOr(null, ['css'], t.head(base)),
      t.mergeAll(
        t.map(item => {
          return { [item.prefix]: t.pathOr(null, ['css'], item) }
        }, mod)
      ),
    ]
  },
  clearfix(props) {
    return null
  },
  float(props) {
    return null
  },
  objectFit(props) {
    return null
  },
  objectPosition(props) {
    return null
  },
  overflow(props) {
    return null
  },
  overflowX(props) {
    return null
  },
  overflowY(props) {
    return null
  },
  scrolling(props) {
    return null
  },
  position(props) {
    return null
  },
  inset(props) {
    return null
  },
  insetX(props) {
    return null
  },
  insetY(props) {
    return null
  },
  pin(props) {
    return null
  },
  visible(props) {
    return null
  },
  zIndex(props) {
    return null
  },
  borderColor(props) {
    return null
  },
  borderStyle(props) {
    return null
  },
  borderWidth(props) {
    return null
  },
  borderRadius(props) {
    return null
  },
  width(props) {
    return null
  },
  minWidth(props) {
    return null
  },
  maxWidth(props) {
    return null
  },
  height(props) {
    return null
  },
  minHeight(props) {
    return null
  },
  maxHeight(props) {
    return null
  },
  color(props) {
    return null
  },
  fontFamily(props) {
    return null
  },
  fontSize(props) {
    return null
  },
  fontSmoothing(props) {
    return null
  },
  fontStyle(props) {
    return null
  },
  fontWeight(props) {
    return null
  },
  letterSpacing(props) {
    return null
  },
  lineHeight(props) {
    return null
  },
  listType(props) {
    return null
  },
  listPosition(props) {
    return null
  },
  textAlignX(props) {
    return null
  },
  textAlignY(props) {
    return null
  },
  textDecoration(props) {
    return null
  },
  textTransform(props) {
    return null
  },
  whitespace(props) {
    return null
  },
  wordBreak(props) {
    return null
  },
  flex(props) {
    return null
  },
  flexDirection(props) {
    return null
  },
  flexWrap(props) {
    return null
  },
  alignItems(props) {
    return null
  },
  alignContent(props) {
    return null
  },
  alignSelf(props) {
    return null
  },
  justifyContent(props) {
    return null
  },
  flexGrow(props) {
    return null
  },
  flexShrink(props) {
    return null
  },
  flexOrder(props) {
    return null
  },
  tableCollapse(props) {
    return null
  },
  tableLayout(props) {
    return null
  },
  bgAttachment(props) {
    return null
  },
  bgColor(props) {
    return null
  },
  bgPosition(props) {
    return null
  },
  bgRepeat(props) {
    return null
  },
  bgSize(props) {
    return null
  },
  padding(props) {
    return null
  },
  margin(props) {
    return null
  },
  appearance(props) {
    return null
  },
  cursor(props) {
    return null
  },
  outline(props) {
    return null
  },
  pointerEvents(props) {
    return null
  },
  resize(props) {
    return null
  },
  userSelect(props) {
    return null
  },
  shadow(props) {
    return null
  },
  opacity(props) {
    return null
  },
  fill(props) {
    return null
  },
  stroke(props) {
    return null
  },
}))
