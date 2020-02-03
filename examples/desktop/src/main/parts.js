import { app } from 'electron'
import path from 'path'
import io from '@z1/lib-api-box-client-node'
import { withRest } from '@z1/kit-bucket-storage-node'

export const api = async apiPath => {
  const client = await io(apiPath, {
    storageOptions: { dir: path.join(app.getPath('home'), '.z1') },
  })
  return withRest(client)
}
export default api
