import fn from '@z1/preset-task'
import got from 'got'
import FormData from 'form-data'
import { DownloaderHelper } from 'node-downloader-helper'

export const withRest = fn(t => api => {
  const apiUri = t.at('io.io.uri', api)
  const prefixUrl = `${
    t.endsWith('/', apiUri) ? t.dropLast(1, apiUri) : apiUri
  }/api`
  api.rest = got.extend({
    prefixUrl,
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
  api.Downloader = DownloaderHelper
  api.download = (idOrUrl, destination, options = {}) => {
    return new Promise((resolve, reject) => {
      api
        .get('authentication')
        .then(({ accessToken }) => {
          const isUrl = t.includes('://', idOrUrl)
          const source = isUrl
            ? idOrUrl
            : `${prefixUrl}/bucket-content/${idOrUrl}`
          const dl = new api.Downloader(
            source,
            destination,
            t.merge(
              {
                headers: isUrl
                  ? { 'user-agent': 'node-XMLHttpRequest' }
                  : {
                      'user-agent': 'node-XMLHttpRequest',
                      Authorization: `Bearer ${accessToken}`,
                    },
              },
              options
            )
          )
          dl.on('error', err => reject(err))
          dl.on('end', result => resolve(result))
          dl.start()
        })
        .catch(e => reject(e))
    })
  }
  return api
})
