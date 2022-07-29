import 'react-hot-loader/patch'
import { hot } from 'react-hot-loader'
import React from 'react'

// elements
import { fui } from './elements'

// demo
const App = () => {
  return (
    <fui.Page
      key="element-page"
      loading={false}
      render={() => {
        return (
          <React.Fragment>
            <fui.Alert icon="check-circle" message="Alert message" />
            <fui.IconLabel
              margin={{ top: 3 }}
              padding={{ x: 2, y: 1 }}
              borderWidth={true}
              slots={{
                icon: {
                  bgColor: 'gray-600',
                },
                label: {
                  padding: { left: 2 },
                  bgColor: 'gray-700',
                },
              }}
              icon={{
                name: 'code',
              }}
              caption={{
                text: 'caption',
              }}
              label={{
                text: 'Icon Label',
              }}
              info={{
                text: 'Info',
                fontSize: 'sm',
              }}
            />
            <fui.ListItem
              margin={{ top: 3 }}
              padding={{ y: 1 }}
              borderWidth={true}
              slots={{
                main: {
                  bgColor: 'gray-800',
                },
                aux: {
                  bgColor: 'gray-700',
                },
                select: {
                  bgColor: 'gray-800',
                },
                avatar: {
                  bgColor: 'gray-700',
                },
                heading: {
                  bgColor: 'gray-600',
                },
                content: {
                  bgColor: 'gray-500',
                },
                inner: {
                  bgColor: 'gray-400',
                },
                nested: {
                  bgColor: 'gray-500',
                },
                last: {
                  bgColor: 'gray-700',
                  padding: { right: 2 },
                },
                buttons: {
                  bgColor: 'gray-600',
                },
              }}
              selectable={true}
              avatar={{
                icon: 'code',
              }}
              caption={{
                slots: {
                  icon: {
                    margin: { top: 1 },
                  },
                },
                icon: {
                  name: 'power-off',
                  size: 'sm',
                },
                label: {
                  text: 'avatar',
                },
              }}
              heading={{
                icon: {
                  name: 'check-circle',
                },
                caption: {
                  text: 'icon',
                },
                label: {
                  text: 'List Item Heading',
                },
                info: {
                  text: 'Info',
                },
              }}
              subheading={{
                icon: {
                  name: 'check-circle',
                  size: 'lg',
                },
                caption: {
                  text: 'icon',
                },
                label: {
                  text: 'Subheading',
                  fontSize: 'sm',
                },
                info: {
                  text: 'Info',
                  fontSize: 'xs',
                },
              }}
              status={{
                icon: {
                  name: 'power-off',
                },
                caption: {
                  text: 'icon',
                },
                label: {
                  text: 'Status',
                },
                info: {
                  text: 'Info',
                  fontSize: 'xs',
                },
              }}
              stamp={{
                icon: {
                  name: 'calendar',
                },
                caption: {
                  text: 'icon',
                },
                label: {
                  text: 'Stamp',
                },
                info: {
                  text: 'Info',
                  fontSize: 'xs',
                },
              }}
              buttons={[
                {
                  icon: 'play',
                  title: 'Run',
                  shape: 'circle',
                  fill: 'solid',
                  size: 'xs',
                  color: 'green-500',
                  margin: { left: 1 },
                  disabled: false,
                  loading: false,
                  onClick: () => {},
                },
                {
                  icon: 'stop',
                  title: 'Stop',
                  shape: 'circle',
                  fill: 'solid',
                  size: 'xs',
                  color: 'red-500',
                  margin: { left: 1 },
                  disabled: false,
                  loading: false,
                  onClick: () => {},
                },
              ]}
            />
            <fui.SearchInput margin={{ top: 3 }} />
            <fui.Segment
              margin={{ top: 3 }}
              buttons={{
                play: {
                  icon: {
                    name: 'play',
                  },
                  label: {
                    text: 'Play',
                  },
                },
                pause: {
                  icon: {
                    name: 'pause',
                  },
                  label: {
                    text: 'Pause',
                  },
                },
                stop: {
                  icon: {
                    name: 'stop',
                  },
                  label: {
                    text: 'Stop',
                  },
                },
              }}
            />
          </React.Fragment>
        )
      }}
    />
  )
}

// outs
export default hot(module)(App)
