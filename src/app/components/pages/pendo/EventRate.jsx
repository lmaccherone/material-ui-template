import React from 'react';
import getMuiTheme from '../../../../../node_modules/material-ui/lib/styles/getMuiTheme';
import ReactHighcharts from '../../../../../node_modules/react-highcharts/bundle/highcharts';
import 'highcharts-exporting';
import 'highcharts-more';

import {Mixins} from 'material-ui';
const {StylePropable, StyleResizable} = Mixins;

import request from '../../../api-request';

export default React.createClass({

  propTypes: {
    onChangeMuiTheme: React.PropTypes.func,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [StylePropable, StyleResizable],

  getChartConfig(categories, series) {
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
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Events per hour'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 1,
            borderWidth: 1,
            groupPadding: 1,
            shadow: false
          }
        },
        series: series
      }
    };
  },

  getInitialState() {
    let categories = [];
    let series = [{
      name: 'Event Rate',
      data: []
    }]
    return this.getChartConfig(categories, series);
  },

  componentDidMount() {
    console.log('before request');
    request('/subscription', (err, result) => {
      console.log('after request', result);
      let categories = [];
      let data = [];


      let series = [{
        name: 'Event Rate',
        data: data
      }];
      this.setState(this.getChartConfig(categories, series))
    })
  },

  getStyles() {
    let styles = {
      text: {
        fontSize: 12,
        color: this.context.muiTheme.rawTheme.palette.primary1Color
      }
    };

    // example of a screen-size sensitive style
    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)) {  // active for >= MEDIUM
      styles.text.fontSize = 20;
    }

    return styles;
  },

  render() {
    let styles = this.getStyles();
    return (
        <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>
    )
  }

});
