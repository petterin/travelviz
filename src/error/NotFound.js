import React from "react";
import { Link } from "react-router-dom";

import "./error.scss";

const NotFound = ({ location }) => (
  <div className="error NotFound">
    <h1>Not Found</h1>
    <p>
      Could not find: <code>{location.pathname}</code>
    </p>
    <p>
      Go back to <Link to="/">Front page</Link>.
    </p>
  </div>
);

export default NotFound;
