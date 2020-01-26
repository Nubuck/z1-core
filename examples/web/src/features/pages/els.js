const cols = {
  title: {
    xs: 3,
  },
}
export const items = [
  {
    cols,
    selectable: true,
    avatar: {
      icon: 'user',
      size: 'xs',
    },
    // caption: {
    //   label: { text: 'caption', fontSize: 'xs' },
    // },
    title: {
      label: 'Title 1',
    },
    // subtitle: {
    //   icon:'power-off',
    //   label: 'subtitle',
    // },
    // content: [],
    stamp: {
      icon: 'stopwatch',
      label: 'stamp',
    },
    buttons: [
      {
        shape: 'circle',
        fill: 'ghost-solid',
        icon: 'gear',
        size: 'sm',
        color: 'blue-500',
      },
    ],
  },
  {
    cols,
    selectable: true,
    avatar: {
      icon: 'user',
      // size: 'md',
      size: 'xs',
    },
    // caption: {
    //   label: 'caption',
    // },
    title: {
      // icon: 'superpowers',
      label: { text: 'title' },
      // caption:'super',
      // info:'super super',
    },
    subtitle: {
      icon: { name: 'power-off', size: 'md' },
      label: { text: 'subtitle', fontSize: 'xs' },
    },
    // content: [],
    stamp: {
      icon: { name: 'stopwatch' },
      label: { text: 'stamp' },
    },
    buttons: [
      {
        shape: 'circle',
        fill: 'ghost-solid',
        icon: 'gear',
        size: 'sm',
        color: 'blue-500',
      },
    ],
  },
]
