import React from 'react'
import helpers from './analysisHelpers'
import yaml from 'js-yaml'

import {Mixins} from 'material-ui'
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
      content: `Fetching analysis specification: ${this.props.route.analysisName}...`
    }
  },

  componentDidMount() {
    let aggregation, transformation, visualization
    helpers.getAnalysis(this.props.route.analysisName, (err, result) => {
      aggregation = yaml.safeLoad(result.aggregation)
      transformation = result.transformation
      visualization = result.visualization
      this.setState({content: "Running aggregation..."})
      helpers.runAggregation(aggregation, (err, result) => {
        let aggregationResult = result
        this.setState({content: "Evaluating transformation..."})
        let transformationResult
        try {
          transformationResult = helpers.evaluateTransformation(transformation, aggregationResult)
        } catch (e) {
          // Do nothing
        }
        this.setState({content: "Getting visualization..."})
        let Visualization = helpers.getVisualization(visualization, transformationResult)
        let content = React.createElement(
          Visualization || "div", {
            parent: this,
            transformationResult: transformationResult,
          }
        )
        this.setState({content})
      })
    })
  },

  render() {
    return (
      <div>
        {this.state.content}
      </div>
    )
  }

})