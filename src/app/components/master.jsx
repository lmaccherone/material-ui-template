import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import {
  StylePropable,
  StyleResizable,
} from 'material-ui/lib/mixins';

import {
  Colors,
  getMuiTheme,
} from 'material-ui/lib/styles';

import AppLeftNav from './app-left-nav';
import FullWidthSection from './full-width-section';

import CustomBaseTheme from '../customBaseTheme';
import appRoutes from '../app-routes';

const githubButton = (
  <IconButton
    iconClassName="muidocs-icon-custom-github"
    href="https://github.com/lmaccherone/material-ui-template"
    linkButton={true}
  />
);

const Master = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
    history: React.PropTypes.object,
    location: React.PropTypes.object,
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [
    StylePropable,
    StyleResizable,
  ],

  getInitialState() {
    return {
      muiTheme: getMuiTheme(CustomBaseTheme),
      leftNavOpen: false,
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    this.setState({
      muiTheme: this.state.muiTheme,
    });
  },

  componentWillReceiveProps(nextProps, nextContext) {
    const newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme,
    });
  },

  getStyles() {
    const darkWhite = Colors.darkWhite;

    const styles = {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0,
      },
      root: {
        paddingTop: this.state.muiTheme.rawTheme.spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        //margin: this.state.muiTheme.rawTheme.spacing.desktopGutter,
        margin: 4,
      },
      contentWhenMedium: {
        //margin: `${this.state.muiTheme.rawTheme.spacing.desktopGutter * 2}px ${this.state.muiTheme.rawTheme.spacing.desktopGutter * 3}px`,
        margin: 4,
      },
      footer: {
        backgroundColor: this.state.muiTheme.rawTheme.palette.accent2Color,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: Colors.lightWhite,
        maxWidth: 335,
      },
      iconButton: {
        color: darkWhite,
      },
    };

    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      styles.content = this.mergeStyles(styles.content, styles.contentWhenMedium);
    }

    return styles;
  },

  handleTouchTapLeftIconButton() {
    this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });
  },

  handleChangeRequestLeftNav(open) {
    this.setState({
      leftNavOpen: open,
    });
  },

  handleRequestChangeList(event, value) {
    this.props.history.push(value);
    this.setState({
      leftNavOpen: false,
    });
  },

  handleChangeMuiTheme(muiTheme) {
    this.setState({
      muiTheme: muiTheme,
    });
  },

  render() {
    const {
      history,
      location,
      children,
    } = this.props;

    let {
      leftNavOpen,
    } = this.state;

    const styles = this.getStyles();

    let title = this.props.routes[1].name || '';

    let docked = false;
    let showMenuIconButton = true;

    //if (this.isDeviceSize(StyleResizable.statics.Sizes.LARGE) && title !== '') {
    //  docked = true;
    //  leftNavOpen = true;
    //  showMenuIconButton = false;
    //
    //  styles.leftNav = {
    //    zIndex: styles.appBar.zIndex - 1,
    //  };
    //  styles.root.paddingLeft = this.state.muiTheme.leftNav.width
    //  styles.footer.paddingLeft = this.state.muiTheme.leftNav.width
    //}

    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          title={title}
          zDepth={0}
          iconElementRight={githubButton}
          style={styles.appBar}
          showMenuIconButton={showMenuIconButton}
        />
        {title !== '' ?
          <div style={this.prepareStyles(styles.root)}>
            <div style={this.prepareStyles(styles.content)}>
              {React.cloneElement(children, {
                onChangeMuiTheme: this.handleChangeMuiTheme,
              })}
            </div>
          </div>
          :
          children
        }
        <AppLeftNav
          style={styles.leftNav}
          history={history}
          location={location}
          docked={docked}
          onRequestChangeLeftNav={this.handleChangeRequestLeftNav}
          onRequestChangeList={this.handleRequestChangeList}
          open={leftNavOpen}
        />
        <FullWidthSection style={styles.footer}>
          <p style={this.prepareStyles(styles.p)}>
            {'Hand crafted with love by '}
            <a style={styles.a} href="https://www.linkedin.com/in/larrymaccherone">
              Larry Maccherone
            </a>.
          </p>
          <IconButton
            iconStyle={styles.iconButton}
            iconClassName="muidocs-icon-custom-github"
            href="https://github.com/lmaccherone/material-ui-template"
            linkButton={true}
          />
        </FullWidthSection>
      </div>
    );
  },
});

export default Master;
