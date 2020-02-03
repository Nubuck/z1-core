import z from '@z1/lib-feature-box'
import ky from 'ky'

export const withRest = z.fn((t, a) => api => {
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
    body.append('uri', t.at('uri', payload))
    body.append('meta', JSON.stringify(t.omit(['uri'], payload)))
    return await a.of(
      api.rest.post('bucket-storage', {
        body,
      })
    )
  }
  return api
})
