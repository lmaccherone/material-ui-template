import React from 'react'

import ReactHighcharts from '../../../../../node_modules/react-highcharts/bundle/highcharts'
import 'highcharts-exporting'
import 'highcharts-more'

import {Toolbar, ToolbarGroup, IconButton} from 'material-ui'
import {ActionLaunch} from 'material-ui/lib/svg-icons'
import {Mixins} from 'material-ui'
const {StylePropable, StyleResizable} = Mixins

import request from '../../../api-request'
import AdvancedTable from '../../AdvancedTable'

export default React.createClass({

  propTypes: {
    onChangeMuiTheme: React.PropTypes.func,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [StylePropable, StyleResizable],

  handleClick(event) {
    let index = event.point.index
    let newState = {}
    newState.detail = this.state.histogram[index].subscriptions
    this.setState(newState)
  },

  getChartConfig(categories, data) {
    return {
      config: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Event Rate Distribution'
        },
        xAxis: {
          categories: categories,
          crosshair: false,
          title: {
            text: 'Events per hour'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Count of subscriptions'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color}padding:0">Count: </td>' +
          '<td style="padding:0"><b>{point.y} subscriptions</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            pointPadding: 1,
            borderWidth: 1,
            groupPadding: 1,
            shadow: false
          }
        },
        series: [{
          name: 'Count of subscriptions',
          data: data,
          color: this.context.muiTheme.rawTheme.palette.canvasColor,
          events: {
            click: this.handleClick
          }
        }]
      }
    }
  },

  getInitialState() {
    let categories = []
    let data = []
    let state = this.getChartConfig(categories, data)
    state.histogram = []
    state.detail = []
    return state
  },

  componentDidMount() {
    this.serverRequest = request('GET', '/api/subscription', (err, result) => {
      if (err) {
        console.log(err)
      } else {
        let histogram = result.body.histogram
        let categories = []
        let data = []
        for (let row of histogram) {
          categories.push(row.label)
          data.push(row.count)
        }

        let state = this.getChartConfig(categories, data)
        state.histogram = histogram
        state.detail = []
        this.setState(state)
      }
    })
  },

  componentWillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.abort()
    }
  },

  getStyles() {
    let styles = {
      text: {
        fontSize: 12,
        color: this.context.muiTheme.rawTheme.palette.primary1Color
      }
    }

    // example of a screen-size sensitive style
    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)) {  // active for >= MEDIUM
      styles.text.fontSize = 20
    }

    return styles
  },

  launchDetail(event, value) {
    console.log(event, value)
    window.open('http://hp.com', '_blank')
  },

  render() {
    let styles = this.getStyles()
    let columns = [
      {field: 'name', label: 'Account'},
      {field: 'eventRate', label: 'Event Rate', tooltip: 'Events per hour'},
    ]
    let rowToolbar = (
      <Toolbar style={{height: 20, backgroundColor: "#FFFFFF"}}>
        <ToolbarGroup>
          <IconButton tooltip="Launch" tooltipPosition="top-center" onTouchTap={this.launchDetail}>
            <ActionLaunch color="#000000" style={{height: 20}} />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    )

    return (
      <div>
        <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>
        <AdvancedTable
          columns={columns}
          rowToolbar={rowToolbar}
          rowToolbarWidth={30}
          data={this.state.detail}
          initialSortField="eventRate"
          initialSortAscending={true}>
        </AdvancedTable>
      </div>
    )
  }

})
