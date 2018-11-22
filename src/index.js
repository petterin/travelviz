import "react-app-polyfill/ie11"; // For IE 11 support
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./index.scss";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";

import 'antd/lib/button/style/css'; 

import { withAuthentication } from "./common/Authentication";
import Firebase, { FirebaseContext } from "./common/Firebase";
import Home from "./frontpage/Home";
import MapView from "./map/MapView";
import NotFound from "./error/NotFound";
import Settings from "./settings/Settings";
import Images from "./settings/Images";
import * as serviceWorker from "./serviceWorker";

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path ="/settings/" component={Settings} />
      <Route path ="/images/" component={Images} />
      <Route path="/user/:userId" component={MapView} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

const AuthenticatedApp = withAuthentication(App);
const WrappedApp = () => (
  <FirebaseContext.Provider value={new Firebase()}>
    <AuthenticatedApp />
  </FirebaseContext.Provider>
);

ReactDOM.render(<WrappedApp />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
