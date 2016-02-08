import React from 'react';
import PageWithNav from './page-with-nav';

export default class Config extends React.Component {

  render() {
    let menuItems = [
      {route: '/config/organization', text: 'Organization'},
    ];

    return (
      <PageWithNav location={this.props.location} menuItems={menuItems}>{this.props.children}</PageWithNav>
    );
  }

}

Config.propTypes = {
  children: React.PropTypes.node,
  location: React.PropTypes.object,
};
