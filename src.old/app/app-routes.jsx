import React from 'react';
import {
    Route,
    Redirect,
    IndexRoute,
} from 'react-router';

import * as JSONStorage from './JSONStorage'

// Here we define all our material-ui ReactComponents.
import Master from './components/master';
import Home from './components/pages/home';
import Login from './components/pages/login';
//import SignUp from './components/pages/sign-up';
//
//import Analyze from './components/pages/analyze';
//import TiP from './components/pages/analyze/tip';
//
//import Config from './components/pages/config';
//import Organization from './components/pages/config/organization';

function requiresAuth(nextState, replaceState) {
    let session = JSONStorage.getItem('session');
    JSONStorage.setItem('nextPathname', nextState.location.pathname);
    if (! session) {
        replaceState({ nextPathname: nextState.location.pathname }, '/login');
    }
}

function doesNotRequireAuth(nextState, replaceState) {
    JSONStorage.setItem('nextPathname', nextState.location.pathname);
}

let nextPathname = JSONStorage.getItem('nextPathname');

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
        <Route path="home" component={Home} onEnter={doesNotRequireAuth} />
        <Route path="login" component={Login} onEnter={doesNotRequireAuth} />

        <IndexRoute component={Home}/>
    </Route>
);

// This was in the AppRoutes above but I don't know how to comment out the HTML of JSX so I moved it here
//<Route path="login" component={Login} />
//
//<Route path="sign-up" component={SignUp} onEnter={doesNotRequireAuth}/>
//
//<Redirect from="analyze" to="/analyze/tip" />
//<Route path="analyze" component={Analyze} onEnter={requiresAuth}>
//    <Route path="tip" component={TiP} />
//</Route>
//
//<Redirect from="config" to="/config/organization" />
//<Route path="config" component={Config} onEnter={requiresAuth}>
//    <Route path="organization" component={Organization} />
//</Route>

export default AppRoutes;
