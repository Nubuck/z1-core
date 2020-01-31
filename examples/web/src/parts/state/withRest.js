import ky from 'ky'

export const withRest = api => {
  console.log('API', api)
  const rest = ky.extend({
    hooks: {
      beforeRequest: [
        async request => {
          const { accessToken } = await api.get('authentication')
          request.headers.set('Authorization', `Bearer ${accessToken}`)
        },
      ],
    },
  })
  api.set(
    'rest',
    rest.create({
      prefixUrl: 'http://localhost:3035/api',
    })
  )
  return api
}
