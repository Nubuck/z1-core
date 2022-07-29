import 'react-hot-loader/patch'
import { hot } from 'react-hot-loader/root'
import React from 'react'
import { Page } from '@z1/lib-feature-ui/dist/Page'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// elements
import { Layout } from './ui'

// demo
const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Page
        key="element-page"
        loading={false}
        padding={0}
        render={() => {
          return <Layout />
        }}
      />
    </DndProvider>
  )
}

// outs
export default hot(App)
