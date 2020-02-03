import z from '@z1/lib-feature-box'
import ky from 'ky'
import { toBlob } from './toBlob'

export const withRest = z.fn(t => api => {
  console.log('max size', 25 * 1024 * 1024)
  api.on('login', payload => {
    api.set('accessToken', payload.accessToken)
  })
  api.on('logout', () => {
    api.set('accessToken', null)
  })
  const apiUri = t.at('io.io.uri', api)
  api.rest = ky.create({
    prefixUrl: `${
      t.endsWith('/', apiUri) ? t.dropLast(1, apiUri) : apiUri
    }/api`,
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set(
            'Authorization',
            `Bearer ${api.get('accessToken')}`
          )
        },
      ],
    },
  })
  api.upload = async payload => {
    const body = new FormData()
    const uri = t.at('uri', payload)
    const fileBlob = toBlob(uri)
    body.append('uri', fileBlob.blob, fileBlob.name)
    body.append('meta', JSON.stringify(t.omit(['uri'], payload)))
    return await api.rest
      .post('bucket-storage', {
        body,
      })
      .json()
  }
  return api
})
