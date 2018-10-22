import React, { Component } from "react";
import PropTypes from "prop-types";
import Leaflet from "leaflet";
import { Map as LeafletMap, Marker, TileLayer, Popup } from "react-leaflet";

import { initFirebase, initFirestore } from "../common/firebaseHelpers";
import MapSidebar from "./MapSidebar";
import Map from "./Map";
import Route from "./Route";

import "leaflet/dist/leaflet.css";
import "./Map.scss";

import marker from "leaflet/dist/images/marker-icon.png";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Following workaround allows us to use Leaflet icons from npm with Webpack
// (https://github.com/PaulLeCam/react-leaflet/issues/255)
delete Leaflet.Icon.Default.prototype._getIconUrl;
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

class MapView extends Component {
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

  render() {
    console.log("MapView userId:", this.props.match.params.userId);
    const { locations, locationsLoading, zoom } = this.state;
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="MapView">
        <MapSidebar locations={locations} locationsLoading={locationsLoading} />
        <Map state={this.state} />
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
