import z from '@z1/lib-feature-box'
import ky from 'ky'
export function toBlob(dataURI) {
  // Split metadata from data
  const splitted = dataURI.split(',')
  // Split params
  const params = splitted[0].split(';')
  // Get mime-type from params
  const type = params[0].replace('data:', '')
  // Filter the name property from params
  const properties = params.filter(param => {
    return param.split('=')[0] === 'name'
  })
  // Look for the name and use unknown if no name property.
  let name
  if (properties.length !== 1) {
    name = 'unknown'
  } else {
    // Because we filtered out the other property,
    // we only have the name case here.
    name = properties[0].split('=')[1]
  }

  // Built the Uint8Array Blob parameter from the base64 string.
  const binary = atob(splitted[1])
  const array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  // Create the blob object
  const blob = new window.Blob([new Uint8Array(array)], { type })

  return { blob, name }
}

export const withRest = z.fn(t => api => {
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
    console.log('URI TYPE', t.type(uri))
    const fileBlob = t.isType(uri, 'string') ? toBlob(uri) : uri
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
