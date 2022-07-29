import React from 'react'

export class Value extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: props.defaultValue }
    this.onChange = this.onChange.bind(this)
  }
  onChange(value) {
    const { onChange } = this.props
    this.setState({ value })
    if (typeof onChange === 'function') {
      onChange(value)
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.defaultValue })
  }

  render() {
    return this.props.render(this.state.value, this.onChange)
  }
}

export const withValue = ({
  defaultValue,
  onChange,
  ...props
}) => {
  return (
    <Value
      onChange={onChange}
      defaultValue={defaultValue}
      render={(value, onChange) => {
        const valueProps = {
          [valueProp || 'value']: value,
          [onChangeProp || 'onChange']: onChange,
        }
        return <Component {...props} {...valueProps} />
      }}
    />
  )
}
