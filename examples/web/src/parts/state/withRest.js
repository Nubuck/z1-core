import ky from 'ky'

export const withRest = api => {
  console.log('API', api)
  const rest = ky.extend({
    hooks: {
      beforeRequest: [
        request => {
          // const { accessToken } = await api.get('authentication')
          // console.log('REQEST', accessToken)
          // request.headers.set('Authorization', `Bearer Derp`)
        },
      ],
    },
  })
  api.rest = rest.create({
    prefixUrl: 'http://localhost:3035/api',
  })

  api.upload = async payload => {}
  return api
}
