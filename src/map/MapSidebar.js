import React from "react";
import PropTypes from "prop-types";

import { LocationsPropType } from "./mapPropTypes";

import "./Map.scss";

const calculateLocationPoints = locations =>
  locations.reduce((sum, locs) => (sum += locs.length), 0);

const calculateTotalDistance = locations => {
  const totalDistance = locations.reduce(
    (sum, locs) =>
      (sum += locs.reduce(
        (biggest, loc) => Math.max(biggest, loc.sumDistance),
        0
      )),
    0
  );
  return Math.round(totalDistance / 1000.0); // convert to kilometers
};

const calculateTopSpeed = locations => {
  const topSpeed = locations.reduce(
    (max1, locs) =>
      Math.max(
        max1,
        locs.reduce(
          (max2, loc) => Math.max(max2, new Date(loc.speed).getTime()),
          0
        )
      ),
    0
  );
  return Math.round(3.6 * topSpeed); // convert from m/s to km/h
};

const calculateActivityDays = locations => {
  const activityDateSet = locations.reduce((dateSet, locs) => {
    const d = new Date(locs[0].timestamp);
    return dateSet.add(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
    );
  }, new Set());
  return activityDateSet.size;
};

const getLatestLocationTimestamp = locations => {
  const latestTimestamp = locations.reduce(
    (max1, locs) =>
      Math.max(
        max1,
        locs.reduce(
          (max2, loc) => Math.max(max2, new Date(loc.timestamp).getTime()),
          0
        )
      ),
    0
  );
  return new Date(latestTimestamp).toUTCString();
};

const MapSidebar = props => (
  <div className="MapSidebar">
    <h3>Journey statistics:</h3>
    {props.locationsLoading ? <p>Loading...</p> : null}
    <p>
      <b>Logged location points:</b>
      <br />
      {calculateLocationPoints(props.locations)}
    </p>
    <p>
      <b>Travelled distance:</b>
      <br />
      {calculateTotalDistance(props.locations)} km
    </p>
    <p>
      <b>Top speed:</b>
      <br />
      {calculateTopSpeed(props.locations)} km/h
    </p>
    <p>
      <b>Days on bicycle:</b>
      <br />
      {calculateActivityDays(props.locations)}
    </p>
    <p>
      <b>Latest data point:</b>
      <br />
      {getLatestLocationTimestamp(props.locations)}
    </p>
  </div>
);

MapSidebar.propTypes = {
  locations: LocationsPropType.isRequired,
  locationsLoading: PropTypes.bool
};

export default MapSidebar;
