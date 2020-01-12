import zbx from '@z1/lib-feature-box'

// main
// export const route = ctx => {
//   return zbx.ui.connect(
//     zbx.ui.query(['landing', 'location']),
//     ctx.mutators
//   )(({ location, routing }) => {
//     return <div>{zbx.routing.render(location.type, routing)}</div>
//   })
// }
export const route = ctx => {
  return () => (
    <div>
      <h1>home</h1>
    </div>
  )
}
