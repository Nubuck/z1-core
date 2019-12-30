import Fallback from 'express-history-api-fallback'
import Express from 'express'
import BodyParser from 'body-parser'
import Cors from 'cors'
import Compression from 'compression'
import { Fs } from '@z1/preset-tools'
import { task } from '@z1/preset-task'

export const createAppServer = task(t => props => {
  const appFolderName = t.path(['sitePath'], props)
  const onReq = t.path(['onReq'], props)
  const main = Express()
  main.use(Cors())
  main.use(Compression())
  main.use(BodyParser.json())
  main.use(BodyParser.urlencoded({ extended: true }))
  const root = Fs.path(appFolderName || 'site')
  main.use(Express.static(root))
  main.use((req, res, next) => {
    if (t.eq(t.type(onReq), 'Function')) {
      onReq(req)
    }
    Fallback('index.html', { root })(req, res, next)
  })
  return main
})