import React from 'react'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'

import {Mixins, Paper, TextField} from 'material-ui'
const {StylePropable, StyleResizable} = Mixins

export default React.createClass({

  propTypes: {
    onChangeMuiTheme: React.PropTypes.func,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [StylePropable, StyleResizable],

  getInitialState() {
    return {
      formFields: [{key: "one", value: "first"}, {key: "two", value: "second"}]
    }
  },

  getOnChange(key) {
    let handler = () => {
      let newValue = this.refs[key].getValue()
      let newState = {}
      newState[key] = newValue
      this.setState(newState)
    }
    return handler
  },

  render() {
    return (
      <Paper>
        {this.state.formFields.map((item, index) => {
          return (<TextField ref={item.key} key={item.key} defaultValue={item.value} onChange={this.getOnChange(item.key)}/>)
        })}
      </Paper>
    )
  }

})