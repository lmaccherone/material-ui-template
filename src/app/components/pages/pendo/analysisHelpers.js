import request from '../../../api-request'
//import lumenize from 'lumenize'  // Got webpack config to work as long as I use the npm version of Lumenize, but get runtime error in timezone-js.js: Can't find
import lumenize from '../../../lumenize'
import _ from 'lodash'
import * as async from 'async'
import CoffeeScript from '../../../coffee-script'
import transformCJSX from 'coffee-react-transform'
import DataGrid from 'react-data-grid'
import React from 'react'
import ReactDOM from 'react-dom'
import mui from 'material-ui'
import * as muiSVGIcons from 'material-ui/lib/svg-icons'
import * as muiStyles from 'material-ui/lib/styles'

import AdvancedTable from '../../AdvancedTable'  // Consider removing now that we have DataGrid

let pkgs = {_, AdvancedTable, lumenize, DataGrid, muiStyles, muiSVGIcons, mui, ReactDOM, React, async}

export default {

  getAnalysis(name, callback) {
    request('GET', `/api/analysis/${name}`, (err, result) => {
      if (err) {
        console.log(err)
      }
      callback(err, result)  // Calling even if err
    })
  },

  runAggregation(aggregation, callback) {
    request('POST', '/api/aggregation', aggregation, (err, result) => {
      if (err) {
        console.log(err)
      }
      callback(err, result)  // Calling even if err
    })
  },

  evaluateTransformation(transformation, aggregationResult) {
    let f = eval(CoffeeScript.compile(transformation, {bare: true}))
    let newTransformationResult = f(aggregationResult, lumenize)
    return newTransformationResult
  },

  getVisualization(visualization, transformationResult) {
    let cs = transformCJSX(visualization, {})
    let js = CoffeeScript.compile(cs, {bare: true})
    // Not sure what jsSyntaxTransform does. It was optional in example code and I've commented out for now.
    //import jsSyntaxTransform from 'coffee-react-jstransform'
    //js = jsSyntaxTransform(js)
    let getVisualization = eval(js)
    let Visualization = getVisualization(pkgs)
    return Visualization
  },


}
