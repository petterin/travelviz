import React, { Component } from "react";
import Leaflet from "leaflet";
import {
  CircleMarker,
  Map as LeafletMap,
  Marker,
  Popup,
  TileLayer,
  Tooltip
} from "react-leaflet";

import { initFirebase, initFirestore } from "../common/firebaseHelpers";
import MapWidget from "./MapWidget";

import "leaflet/dist/leaflet.css";
import "./Map.css";
import mockLocations from "./mock-locations.json";

import marker from "leaflet/dist/images/marker-icon.png";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// This workaround allows us to use Leaflet icons from npm with Webpack
// (https://github.com/PaulLeCam/react-leaflet/issues/255)
delete Leaflet.Icon.Default.prototype._getIconUrl;
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

class JourneyMap extends Component {
  state = {
    lat: 60.1869,
    lng: 24.8215,
    zoom: 3,
    locations: [],
    locationsLoading: false
  };

  componentDidMount() {
    // Set location data from temporary source:
    this.setState({ locations: mockLocations.locations });

    // (Following is commented out because this version would
    // consume Firebase's daily free quota very fast!)
    /*
    const firebase = initFirebase();
    const db = initFirestore(firebase);

    this.setState({ locationsLoading: true });
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
    const { locations, locationsLoading, zoom } = this.state;
    const position = [this.state.lat, this.state.lng];
    const locationMarkers = locations.map(loc => (
      <CircleMarker
        center={[loc.coords.latitude, loc.coords.longitude]}
        key={loc.timestamp}
      >
        <Tooltip>{new Date(loc.timestamp).toString()}</Tooltip>
      </CircleMarker>
    ));
    const renderLocation = loc => (
      <span>
        timestamp: {loc.timestamp}
        <br />
        latitude: {loc.coords.latitude}
        <br />
        longitude: {loc.coords.longitude}
        <br />
        accuracy: {loc.coords.accuracy}
        <br />
        altitude: {loc.coords.altitude}
        <br />
        altitudeAccuracy: {loc.coords.altitudeAccuracy}
        <br />
        heading: {loc.coords.heading}
        <br />
        speed: {loc.coords.speed}
      </span>
    );
    return (
      <div className="JourneyMap-container">
        <LeafletMap className="JourneyMap" center={position} zoom={zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>This is an example popup.</Popup>
          </Marker>
          <React.Fragment>{locationMarkers}</React.Fragment>
        </LeafletMap>
        <MapWidget>
          <h3>Location statistics:</h3>
          {locationsLoading ? <p>Loading...</p> : null}
          <p>
            <b>Logged locations:</b> {locations.length}
          </p>
          <p>
            <b>Oldest data point:</b>
            <br />
            {locations.length > 0 ? renderLocation(locations[0]) : null}
          </p>
          <p>
            <b>Latest data point:</b>
            <br />
            {locations.length > 0
              ? renderLocation(locations[locations.length - 1])
              : null}
          </p>
        </MapWidget>
      </div>
    );
  }
}

export default JourneyMap;
