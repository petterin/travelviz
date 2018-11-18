import React, { Component } from "react";
import PropTypes from "prop-types";
import Leaflet from "leaflet";
import { Map as LeafletMap, Marker, TileLayer, Popup } from "react-leaflet";

import { initFirebase, initFirestore } from "../common/firebaseHelpers";
import MapTopbar from "./MapTopbar";
import MapProgressLine from "./MapProgressLine";
import Map from "./Map";
import Route from "./Route";
import { Layout } from 'antd';

import "leaflet/dist/leaflet.css";
import "./Map.scss";

import marker from "leaflet/dist/images/marker-icon.png";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import config from "../common/config.js"

const { Header, Content, Sider, Footer } = Layout;

// Following workaround allows us to use Leaflet icons from npm with Webpack
// (https://github.com/PaulLeCam/react-leaflet/issues/255)
delete Leaflet.Icon.Default.prototype._getIconUrl;
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

const calculateTotalDistance = locations => {
  console.log("distance")
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
const progressDistance = locations =>
  Math.floor(100 * calculateTotalDistance(locations) / config.tourTarget.km)

class MapView extends Component {
  mapRef = React.createRef()

  // Initial map position and default empty values
  state = {
    lat: 60.1869,
    lng: 24.8215,
    zoom: 7,
    locations: [],
    locationsLoading: false
  };

  
  componentDidMount() {
    this.setState({ locationsLoading: true });

    // Set location data from temporary source:
    import("../data/garmin_locations")
      .then(module => {
        this.setState({ locations: module.default, locationsLoading: false });
      })
      .catch(err => {
        console.log("Could not load mock locations.", err);
      });

    // (Following is commented out because this version would
    // consume Firebase's daily free quota very fast!)
    /*
    const firebase = initFirebase();
    const db = initFirestore(firebase);

    db.collection("locations")
      .get()
      .then(snapshot => {
        const locations = [];
        snapshot.forEach(doc => locations.push(doc.data()));
        this.setState({ locations: locations, locationsLoading: false });
      })
      .catch(err => {
        console.log("Error getting documents:", err);
        this.setState({ locationsLoading: false });
      });
    */
  }

  onCountryChange = (country) => {
    this.mapRef.current.setLocation(country.latlng)
  }

  render() {
    const { locations, locationsLoading, zoom } = this.state;
    // const position = [this.state.lat, this.state.lng];
    return (
      <div className="MapView">
        <MapTopbar locations={locations} locationsLoading={locationsLoading} />
        <Map state={this.state} ref={this.mapRef} />
        <MapProgressLine onChange={this.onCountryChange} distance={calculateTotalDistance(locations)} progress={progressDistance(locations)} />
      </div>
    );
  }
}

MapView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired
    })
  }).isRequired
};

export default MapView;
