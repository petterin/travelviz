import React, { Component } from "react";
import Leaflet from "leaflet";
import { Map as LeafletMap, Marker, TileLayer, Popup } from "react-leaflet";

import { initFirebase, initFirestore } from "../common/firebaseHelpers";
import MapSidebar from "./MapSidebar";
import Route from "./Route";

import "leaflet/dist/leaflet.css";
import "./Map.css";
import mockLocations from "../data/garmin_locations";

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
    zoom: 3,
    locations: [],
    locationsLoading: false
  };

  componentDidMount() {
    // Set location data from temporary source:
    this.setState({ locations: mockLocations });

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
    return (
      <div className="MapView">
        <LeafletMap className="JourneyMap" center={position} zoom={zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Route locations={locations} />
          <Marker position={position}>
            <Popup>This is an example popup.</Popup>
          </Marker>
        </LeafletMap>
        <MapSidebar locations={locations} locationsLoading={locationsLoading} />
      </div>
    );
  }
}

export default MapView;
