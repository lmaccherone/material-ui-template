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
        <p>This is an example of using the same content component on two different routes but having them each get a different config.</p>
        <pre style={styles.text}>
          {JSON.stringify(this.props.route.config, null, 2)}
        </pre>
        <p>
          You could also use the query string in the url to configure a particular page. But you can't put query strings
          in the the app-routes. Add a query string to the url to see it change here:
        </p>
        <pre style={styles.text}>
          {JSON.stringify(this.props.location.query, null, 2)}
        </pre>
      </div>
    )
  }

});