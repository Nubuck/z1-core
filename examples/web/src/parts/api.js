import io from '@z1/lib-api-box-client'
import { withRest } from '@z1/kit-bucket-storage-web'

// main
export const api = (path, opts) => withRest(io(path, opts))
export default api
