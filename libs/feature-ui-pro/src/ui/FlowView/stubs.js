// main
export const flowData = [
  // {
  //   id: '1',
  //   type: 'custom',
  //   data: { onChange: null, color: '#4299e1' },
  //   position: { x: 50, y: 300 },
  //   isHidden: true,
  // },
  {
    id: '2',
    type: 'pro',
    position: { x: 50, y: 50 },
    data: {
      id: '2',
      // node category
      // key: '',
      name: 'Open window',
      command: 'window',
      method: 'open',
      color: 'teal-500',
      icon: 'window-maximize',
      layers: [],
      // node instance
      alias: 'Open Notepad',
      description: null,
      customErrorMsg: null,
      customData: null,
      status: null,
      active: null,
      mustSync: null,
      syncStatus: null,
      // ports
      trigger: {},
      input: {
        ports: [
          {
            id: '2A',
            name: '>>_run',
            label: 'Run',
            dataType: 'trigger',
            data: null,
            sources: [],
            mode: 'link',
          },
          {
            id: '2C',
            name: '>>_app_path',
            label: 'App Path',
            dataType: 'text',
            data: null,
            sources: [],
            mode: 'link',
          },
        ],
      },
      output: {
        ports: [
          {
            id: '2B',
            name: '<<_continue',
            label: 'Continue',
            dataType: 'trigger',
            data: null,
            targets: [],
          },
        ],
      },
      error: {},
      continue: {},
      fork: null,
      repeat: null,
      returnTarget: null,
    },
  },
  {
    id: '3',
    type: 'pro',
    position: { x: 400, y: 50 },
    data: {
      id: '3',
      // node category
      // key: '',
      name: 'Screenshot OS',
      command: 'system',
      method: 'screenshot',
      color: 'pink-500',
      icon: 'camera',
      layers: [],
      // node instance
      alias: null,
      description: null,
      customErrorMsg: null,
      customData: null,
      status: null,
      active: null,
      mustSync: null,
      syncStatus: null,
      // ports
      trigger: {},
      input: {
        ports: [
          {
            id: '3A',
            name: '>>_run',
            label: 'Run',
            dataType: 'trigger',
            data: null,
            sources: [],
            mode: 'link',
          },
        ],
      },
      output: {
        ports: [
          {
            id: '3B',
            name: '<<_continue',
            label: 'Continue',
            dataType: 'trigger',
            data: null,
            targets: [],
          },
        ],
      },
      error: {},
      continue: {},
      fork: null,
      repeat: null,
      returnTarget: null,
    },
  },
]
export const commandData = [
  {
    id: 'A',
    parentId: null,
    title: 'Parent',
    node: {
      _id: 'A',
      icon: {
        name: 'tools',
        color: 'yellow-500',
        size: '2xl',
      },
      title: 'Control',
      label: {
        as: 'a',
        color: ['yellow-500', { hover: 'white' }],
        cursor: 'pointer',
        fontWeight: 'medium',
      },
      dataType: 'command',
    },
    children: [
      {
        id: 'A1',
        parentId: 'A',
        title: 'Child',
        node: {
          _id: 'A1',
          icon: {
            name: 'project-diagram',
            color: 'yellow-500',
          },
          title: 'Run Macro',
          dataType: 'method',
        },
      },
      {
        id: 'A2',
        parentId: 'A',
        title: 'Child',
        node: {
          _id: 'A2',
          icon: {
            name: 'sign-in-alt',
            color: 'yellow-500',
          },
          title: 'Inputs',
          dataType: 'method',
        },
      },
      {
        id: 'A3',
        parentId: 'A',
        title: 'Child',
        node: {
          _id: 'A3',
          icon: {
            name: 'sign-out-alt',
            color: 'yellow-500',
          },
          title: 'Outputs',
          dataType: 'method',
        },
      },
    ],
  },
  {
    id: 'B',
    parentId: null,
    title: 'Parent',
    node: {
      _id: 'A',
      icon: {
        name: 'brain',
        color: 'green-500',
        size: '2xl',
      },
      title: 'Logic',
      label: {
        as: 'a',
        color: ['green-500', { hover: 'white' }],
        cursor: 'pointer',
        color: 'green-500',
        fontWeight: 'medium',
      },
      dataType: 'command',
    },
    children: [
      {
        id: 'B1',
        parentId: 'B',
        title: 'Child',
        node: {
          _id: 'B1',
          icon: {
            name: 'random',
            color: 'green-500',
          },
          title: 'When is',
          dataType: 'method',
        },
        children: [
          {
            id: 'B1A',
            parentId: 'B1',
            title: 'Child',
            node: {
              _id: 'B1A',
              icon: {
                name: 'random',
                color: 'green-500',
              },
              title: 'Text',
              dataType: 'method',
            },
          },
          {
            id: 'B1B',
            parentId: 'B1',
            title: 'Child',
            node: {
              _id: 'B1B',
              icon: {
                name: 'random',
                color: 'green-500',
              },
              title: 'Number',
              dataType: 'method',
            },
          },
          {
            id: 'B1C',
            parentId: 'B1',
            title: 'Child',
            node: {
              _id: 'B1C',
              icon: {
                name: 'random',
                color: 'green-500',
              },
              title: 'Long-text',
              dataType: 'method',
            },
          },
        ],
      },
      {
        id: 'B2',
        parentId: 'B',
        title: 'Child',
        node: {
          _id: 'B2',
          icon: {
            name: 'retweet',
            color: 'green-500',
          },
          title: 'Repeats',
          dataType: 'method',
        },
        children: [
          {
            id: 'B2A',
            parentId: 'B2',
            title: 'Child',
            node: {
              _id: 'B2A',
              icon: {
                name: 'retweet',
                color: 'green-500',
              },
              title: 'Over text-list',
              dataType: 'method',
            },
          },
          {
            id: 'B2B',
            parentId: 'B2',
            title: 'Child',
            node: {
              _id: 'B2B',
              icon: {
                name: 'retweet',
                color: 'green-500',
              },
              title: 'Over number-list',
              dataType: 'method',
            },
          },
          {
            id: 'B2C',
            parentId: 'B2',
            title: 'Child',
            node: {
              _id: 'B2C',
              icon: {
                name: 'retweet',
                color: 'green-500',
              },
              title: 'Over data-list',
              dataType: 'method',
            },
          },
        ],
      },
      {
        id: 'B3',
        parentId: 'B',
        title: 'Child',
        node: {
          _id: 'B3',
          icon: {
            name: 'edit',
            color: 'green-500',
          },
          title: 'Set value',
          dataType: 'method',
        },
        children: [
          {
            id: 'B3A',
            parentId: 'B3',
            title: 'Child',
            node: {
              _id: 'B3A',
              icon: {
                name: 'edit',
                color: 'green-500',
              },
              title: 'Text',
              dataType: 'method',
            },
          },
          {
            id: 'B3B',
            parentId: 'B3',
            title: 'Child',
            node: {
              _id: 'B3B',
              icon: {
                name: 'edit',
                color: 'green-500',
              },
              title: 'Number',
              dataType: 'method',
            },
          },
          {
            id: 'B3C',
            parentId: 'B3',
            title: 'Child',
            node: {
              _id: 'B3C',
              icon: {
                name: 'edit',
                color: 'green-500',
              },
              title: 'Data',
              dataType: 'method',
            },
            // children: [
            //   {
            //     id: 'B3C1',
            //     parentId: 'B3C',
            //     title: 'Child',
            //     node: {
            //       _id: 'B3C1',
            //       icon: {
            //         name: 'edit',
            //         color: 'green-500',
            //       },
            //       title: 'Data-field',
            //       dataType: 'method',
            //     },
            //   },
            //   {
            //     id: 'B3C2',
            //     parentId: 'B3C',
            //     title: 'Child',
            //     node: {
            //       _id: 'B3C2',
            //       icon: {
            //         name: 'edit',
            //         color: 'green-500',
            //       },
            //       title: 'Data-item',
            //       dataType: 'method',
            //     },
            //   },
            //   {
            //     id: 'B3C3',
            //     parentId: 'B3C',
            //     title: 'Child',
            //     node: {
            //       _id: 'B3C3',
            //       icon: {
            //         name: 'edit',
            //         color: 'green-500',
            //       },
            //       title: 'Data-list',
            //       dataType: 'method',
            //     },
            //     children: [
            //       {
            //         id: 'B3C3A',
            //         parentId: 'B3C3',
            //         title: 'Child',
            //         node: {
            //           _id: 'B3C3A',
            //           icon: {
            //             name: 'edit',
            //             color: 'green-500',
            //           },
            //           title: 'Data-Field',
            //           dataType: 'method',
            //         },
            //       },
            //       {
            //         id: 'B3C3B',
            //         parentId: 'B3C3',
            //         title: 'Child',
            //         node: {
            //           _id: 'B3C3B',
            //           icon: {
            //             name: 'edit',
            //             color: 'green-500',
            //           },
            //           title: 'Data-item',
            //           dataType: 'method',
            //         },
            //         children: [
            //           {
            //             id: 'B3C3B1',
            //             parentId: 'B3C3B',
            //             title: 'Child',
            //             node: {
            //               _id: 'B3C3B1',
            //               icon: {
            //                 name: 'edit',
            //                 color: 'green-500',
            //               },
            //               title: 'Data-field',
            //               dataType: 'method',
            //             },
            //             children: [
            //               {
            //                 id: 'B3C3B1A',
            //                 parentId: 'B3C3B1',
            //                 title: 'Child',
            //                 node: {
            //                   _id: 'B3C3B1A',
            //                   icon: {
            //                     name: 'edit',
            //                     color: 'green-500',
            //                   },
            //                   title: 'Data-type',
            //                   dataType: 'method',
            //                 },
            //                 children: [
            //                   {
            //                     id: 'B3C3B1A1',
            //                     parentId: 'B3C3B1A',
            //                     title: 'Child',
            //                     node: {
            //                       _id: 'B3C3B1A1',
            //                       icon: {
            //                         name: 'edit',
            //                         color: 'green-500',
            //                       },
            //                       title: 'Value',
            //                       dataType: 'method',
            //                     },
            //                   },
            //                 ],
            //               },
            //             ],
            //           },
            //         ],
            //       },
            //     ],
            //   },
            // ],
          },
        ],
      },
    ],
  },
]
