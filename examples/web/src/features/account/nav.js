import sc from '@z1/lib-ui-schema'

// main
export const anon = sc.nav.create(n => [
  n('/account/sign-in', {
    slot: 'page-action',
    title: 'Sign-in',
    icon: 'sign-in-alt',
  }),
  n('/account/sign-up', {
    slot: 'page-action',
    title: 'Sign-up',
    icon: 'user-plus',
  }),
])
