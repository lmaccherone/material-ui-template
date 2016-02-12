import React from 'react';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

import {Mixins} from 'material-ui';
const {StylePropable, StyleResizable} = Mixins;

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
    };
  },

  getStyles() {
    let styles = {
      text: {
        fontSize: 20,
        color: this.context.muiTheme.rawTheme.palette.primary1Color
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();
    return (
      <div>
        This is an example of using the same content component on two different routes but having them each get a different config.
        <p style={styles.text}>
          {JSON.stringify(this.props.route.config, null, 2)}
        </p>
      </div>
    )
  }

});