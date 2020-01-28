import React from 'react'
import z from '@z1/lib-feature-box'
import { Col } from '@z1/lib-ui-box-elements'
import SchemaForm from 'react-jsonschema-form'

// main
const renderForm = z.fn(t => props => {
  return <Col as={SchemaForm} alignSelf="auto" {...props} />
})

export class Form extends React.Component {
  render() {
    return renderForm(this.props)
  }
}
Form.displayName = 'Form'
