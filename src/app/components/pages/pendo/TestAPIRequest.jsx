import React from 'react'
//import superagent from 'superagent/lib/client'

import {Mixins} from 'material-ui'
const {StylePropable, StyleResizable} = Mixins

import apiRequest from '../../../api-request'
import _ from 'lodash'

export default React.createClass({

  // Boilerplate and React lifecycle methods

  propTypes: {
    onChangeMuiTheme: React.PropTypes.func,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [StylePropable, StyleResizable],

  getInitialState() {
    return {
      result: '',
    }
  },

  componentDidMount() {
    let body = {

    }
    apiRequest('get', '/api/super/subscription', (err, response) => {
      if (err) {
        this.setState({
          result: JSON.stringify(err, null, 2)
        })
      } else {
        this.setState({
          result: JSON.stringify(response, null, 2)
        })
      }
    })
  },

  // Helpers

  // Event handlers

  // None for this Blank page

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props.pendoContext, null, 2)}</pre>
        <pre>{this.state.result}</pre>
      </div>
    )
  }

})

