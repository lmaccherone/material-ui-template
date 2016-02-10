import React from 'react';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

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
      <p style={styles.blankText}>Blank page</p>
    )
  }

});

export default HighchartsPage;
