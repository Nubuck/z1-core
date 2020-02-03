import z from '@z1/lib-state-box-node'
import got from 'got'

export const withRest = z.fn(t => api => {
  api.on('login', payload => {
    api.set('accessToken', payload.accessToken)
  })
  api.on('logout', () => {
    api.set('accessToken', null)
  })
  const apiUri = t.at('io.io.uri', api)
  console.log('API URI', apiUri)
  api.rest = got.extend({
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
    body.append('uri', uri.stream, ui.originalName)
    body.append('meta', JSON.stringify(t.omit(['uri'], payload)))
    return await api.rest
      .post('bucket-storage', {
        body,
      })
      .json()
  }

  return api
})
