import React from "react";
import PropTypes from "prop-types";

import { LocationsPropType } from "./mapPropTypes";
import { Row, Col, Progress, Avatar } from 'antd';

import Navigation from "../common/Navigation";
import "./Map.scss";
import config from "../common/config.js"

const bikeSVG = () => (
  <svg width="18px" height="18px" viewBox="0 0 24 24">
    <path fill='black' d="M15.5,5.5 C16.6,5.5 17.5,4.6 17.5,3.5 C17.5,2.4 16.6,1.5 15.5,1.5 C14.4,1.5 13.5,2.4 13.5,3.5 C13.5,4.6 14.4,5.5 15.5,5.5 Z M5,12 C2.2,12 0,14.2 0,17 C0,19.8 2.2,22 5,22 C7.8,22 10,19.8 10,17 C10,14.2 7.8,12 5,12 Z M5,20.5 C3.1,20.5 1.5,18.9 1.5,17 C1.5,15.1 3.1,13.5 5,13.5 C6.9,13.5 8.5,15.1 8.5,17 C8.5,18.9 6.9,20.5 5,20.5 Z M10.8,10.5 L13.2,8.1 L14,8.9 C15.3,10.2 17,11 19.1,11 L19.1,9 C17.6,9 16.4,8.4 15.5,7.5 L13.6,5.6 C13.1,5.2 12.6,5 12,5 C11.4,5 10.9,5.2 10.6,5.6 L7.8,8.4 C7.4,8.8 7.2,9.3 7.2,9.8 C7.2,10.4 7.4,10.9 7.8,11.2 L11,14 L11,19 L13,19 L13,12.8 L10.8,10.5 Z M19,12 C16.2,12 14,14.2 14,17 C14,19.8 16.2,22 19,22 C21.8,22 24,19.8 24,17 C24,14.2 21.8,12 19,12 Z M19,20.5 C17.1,20.5 15.5,18.9 15.5,17 C15.5,15.1 17.1,13.5 19,13.5 C20.9,13.5 22.5,15.1 22.5,17 C22.5,18.9 20.9,20.5 19,20.5 Z" id="path-1"></path>
  </svg>
)

const calculateLocationPoints = locations =>
  locations.reduce((sum, locs) => (sum += locs.length), 0);

const progressDays = locations =>
  Math.floor(100 * calculateTourDays(locations) / config.tour.days)

const progressDistance = locations =>
  Math.floor(100 * calculateTotalDistance(locations) / config.tour.km)

const correlationDays = locations =>
  100 * calculateActivityDays(locations) / calculateTourDays(locations)

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
  <Row gutter={16} className="MapTopbar" type="flex">
    <Col xs={10} sm={5} md={4} lg={3} xl={2}><Avatar src="/assets/icon_bike.png" size="small" className="menu" style={{ backgroundColor: '#30cc5f' }} /> <span>{config.tour.name}</span></Col>
    <Col xs={0} sm={5} md={4} lg={4} xl={3}>
      <Progress type="dashboard" percent={progressDistance(props.locations)} width={28} />{calculateTotalDistance(props.locations)} / {config.tour.km} km
    </Col>
    <Col xs={0} sm={5} md={4} lg={4} xl={3}>
      Top speed: {calculateTopSpeed(props.locations)} km/h
    </Col>
    <Col xs={0} sm={5} md={4} lg={4} xl={3}>
      <Progress type="dashboard" percent={progressDays(props.locations)} width={28} />{calculateActivityDays(props.locations)} / {calculateTourDays(props.locations)} days
    </Col>
    <Col xs={0} sm={0} md={6} lg={7} xl={12}></Col>
    <Col xs={10} sm={4} md={2} lg={2} xl={1} className="right">
      <Navigation showModal={props.showModal} />
    </Col>
  </Row>
);

MapTopbar.propTypes = {
  locations: LocationsPropType.isRequired,
  locationsLoading: PropTypes.bool,
  showModal: PropTypes.func
};

export default MapTopbar;
