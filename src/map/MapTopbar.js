import React from "react";
import PropTypes from "prop-types";

import { LocationsPropType } from "./mapPropTypes";
import { Progress } from 'antd';

import "./Map.scss";
import config from "../common/config.js"

const calculateLocationPoints = locations =>
  locations.reduce((sum, locs) => (sum += locs.length), 0);

const progressDays = locations =>
  Math.floor(100 * calculateTourDays(locations) / config.tourTarget.days)

const correlationDays = locations =>
  100 * calculateActivityDays(locations) / calculateTourDays(locations)

// const calculateTotalDistance = locations => {
//   const totalDistance = locations.reduce(
//     (sum, locs) =>
//       (sum += locs.reduce(
//         (biggest, loc) => Math.max(biggest, loc.sumDistance),
//         0
//       )),
//     0
//   );
//   return Math.round(totalDistance / 1000.0); // convert to kilometers
// };

{/* <Icon type="compass" /> */ }
{/* <Progress type="circle" percent={props.progress} width={24} />
{ props.distance } / {config.tourTarget.km} km</div > */}

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

const timetStampToDate = timestamp => {
  const d = new Date(timestamp);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
}

const calculateActivityDays = locations => {
  const activityDateSet = locations.reduce((dateSet, locs) => {
    return locs.reduce((dateSet, loc) => dateSet.add(timetStampToDate(loc.timestamp)), dateSet)
  }, new Set());
  return activityDateSet.size;
};


const getEarliestLocationTimestamp = locations => {
  const earliestTimestamp = locations.reduce(
    (min1, locs) =>
      Math.min(
        min1,
        locs.reduce(
          (min2, loc) => Math.min(min2, new Date(loc.timestamp).getTime()),
          Infinity
        )
      ),
    Infinity
  );
  return new Date(earliestTimestamp)
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
  return new Date(latestTimestamp)
};

const calculateTourDays = locations => {
  return Math.ceil((getLatestLocationTimestamp(locations) - getEarliestLocationTimestamp(locations)) / (24 * 3600 * 1000))
}
const MapTopbar = props => (
  <div className="MapTopbar">
    <h3>Journey statistics:</h3>
    {props.locationsLoading ? <p>Loading...</p> : null}
    <p>
      <b>Logged location points:</b>
      <br />
      {calculateLocationPoints(props.locations)}
    </p>
    {/* <p>
      <b>Travelled distance:</b>
      <br />
      {calculateTotalDistance(props.locations)} km
    </p>
    <Progress type="dashboard" percent={progressDistance(props.locations)} width={80} /> */}
    <p>
      <b>Top speed:</b>
      <br />
      {calculateTopSpeed(props.locations)} km/h
    </p>
    <p>
      <b>Days on bicycle:</b>
      <br />
      {calculateActivityDays(props.locations)} / {calculateTourDays(props.locations)}
    </p>
    <Progress type="dashboard" percent={correlationDays(props.locations)} width={80} />
    <Progress type="dashboard" percent={progressDays(props.locations)} width={80} />
    <p>
      <b>Latest data point:</b>
      <br />
      {getLatestLocationTimestamp(props.locations).toUTCString()}
    </p>
  </div>
);

MapTopbar.propTypes = {
  locations: LocationsPropType.isRequired,
  locationsLoading: PropTypes.bool
};

export default MapTopbar;
