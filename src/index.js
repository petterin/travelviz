import "react-app-polyfill/ie11"; // For IE 11 support
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./index.scss";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";

import 'antd/lib/button/style/css'; 

import Home from "./frontpage/Home";
import MapView from "./map/MapView";
import NotFound from "./error/NotFound";
import Settings from "./settings/Settings";
import * as serviceWorker from "./serviceWorker";

const app = (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path ="/settings/" component={Settings} />
      <Route path="/user/:userId" component={MapView} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
