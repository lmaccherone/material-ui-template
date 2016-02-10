import React from 'react';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import ReactHighcharts from 'react-highcharts/bundle/highcharts';
import 'highcharts-exporting';
import 'highcharts-more';

import {Mixins} from 'material-ui';
const {StylePropable, StyleResizable} = Mixins;

const HighchartsPage = React.createClass({

  propTypes: {
    onChangeMuiTheme: React.PropTypes.func,  // TODO: Do I need to do this for globalNav?
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
    globalNav: React.PropTypes.object,
  },

  mixins: [StylePropable, StyleResizable],

  getInitialState() {
    return {
      config: {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Monthly Average Temperature'
        },
        subtitle: {
          text: 'Source: WorldClimate.com'
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: false
          }
        },
        series: [{
          name: 'Tokyo',
          data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
          name: 'London',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
      }
    };
  },

  getStyles() {
    let styles = {
      blankText: {
        fontSize: 12,
        color: this.context.muiTheme.rawTheme.palette.primary1Color
      }
    };

    // example of a screen-size sensitive style
    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)) {  // active for >= MEDIUM
      styles.blankText.fontSize = 20;
    }

    return styles;
  },

  render() {
    let styles = this.getStyles()
    return (
        <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>
    )
  }

});

export default HighchartsPage;
