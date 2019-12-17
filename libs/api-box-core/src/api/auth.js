import { task } from '@z1/preset-task'

// main
export const auth = task(t => ctx => {
  const authConfig = app => {
    const config = app.get('authentication')
    return t.merge(config, {
      path: `/${ctx.common.safeServiceName(config.path)}`,
    })
  }
  return {
    config(app){
      
    }
  }
})
