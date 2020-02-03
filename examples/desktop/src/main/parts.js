import z from '@z1/lib-state-box-node'
import got from 'got'
import FormData from 'form-data'

export const withRest = z.fn(t => api => {
  const apiUri = t.at('io.io.uri', api)
  api.rest = got.extend({
    prefixUrl: `${
      t.endsWith('/', apiUri) ? t.dropLast(1, apiUri) : apiUri
    }/api`,
    hooks: {
      beforeRequest: [
        async options => {
          const { accessToken } = await api.get('authentication')
          options.headers['user-agent'] = 'node-XMLHttpRequest'
          options.headers.Authorization = `Bearer ${accessToken}`
        },
      ],
    },
  })
  api.upload = async payload => {
    const body = new FormData()
    const uri = t.at('uri', payload)
    body.append('uri', uri.stream, uri.name)
    body.append('meta', JSON.stringify(t.omit(['uri'], payload)))
    return await api.rest
      .post('bucket-storage', {
        body,
      })
      .json()
  }

  return api
})
