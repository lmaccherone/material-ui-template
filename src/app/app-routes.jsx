import React from 'react';
import {
  Route,
  Redirect,
  IndexRoute,
} from 'react-router';

// Here we define all our material-ui ReactComponents.
import Master from './components/master';
import Home from './components/pages/home';

import Colors from './components/pages/customization/colors';
import Themes from './components/pages/customization/themes';
import InlineStyles from './components/pages/customization/inline-styles';

import MarkdownPage from './components/pages/page-types/MarkdownPage';
import Showcase from './components/pages/page-types/Showcase';

/**
 * Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
 *
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > Master
 */
const AppRoutes = (
  <Route path="/" component={Master}>
    <IndexRoute component={Home} />
    <Route path="home" component={Home} />
    <Redirect from="customization" to="/customization/themes" />
    <Route path="customization">
      <Route path="colors" component={Colors} />
      <Route path="themes" component={Themes} />
      <Route path="inline-styles" component={InlineStyles} />
    </Route>
    <Redirect from="page-types" to="/page-types/markdown" />
    <Route path="page-types">
      <Route path="markdown" component={MarkdownPage} />
      <Route path="showcase" component={Showcase} />
    </Route>
  </Route>
);

export default AppRoutes;
