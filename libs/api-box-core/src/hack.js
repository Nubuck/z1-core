import { task } from '@z1/preset-task'

// hack
export const hack = task(t => ({ adapters }) => {
  return {
    create({models, services, lifecycle}){
      const modelList = models((name, factory)=>{})
    },
    combine(){},
    api(){}
  }
})
