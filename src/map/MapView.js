import React, { Component } from "react";
import Leaflet from "leaflet";
import {
  CircleMarker,
  Map as LeafletMap,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip
} from "react-leaflet";

import { initFirebase, initFirestore } from "../common/firebaseHelpers";
import MapWidget from "./MapWidget";

import "leaflet/dist/leaflet.css";
import "./Map.css";
import mockLocations from "../data/garmin_locations";

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

class MapView extends Component {
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

    const locationMarkers = locations.reduce((result, locationBatch) => {
      const realLocations = locationBatch.filter(
        loc => loc.latitude && loc.longitude
      );
      if (realLocations.length < 1) {
        return result;
      }
      const drawCircleMarker = loc => (
        <CircleMarker
          center={[loc.latitude, loc.longitude]}
          key={loc.timestamp}
        >
          <Tooltip>{new Date(loc.timestamp).toUTCString()}</Tooltip>
        </CircleMarker>
      );
      const drawPath = locations => (
        <Polyline
          positions={locations.map(loc => [loc.latitude, loc.longitude])}
        />
      );
      const markers = (
        <React.Fragment key={realLocations[0].timestamp}>
          {drawCircleMarker(realLocations[0])}
          {drawPath(realLocations)}
          {drawCircleMarker(realLocations[realLocations.length - 1])}
        </React.Fragment>
      );
      return result.concat(markers);
    }, []);

    return (
      <div className="MapView">
        <LeafletMap className="JourneyMap" center={position} zoom={zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/*
          <Marker position={position}>
            <Popup>This is an example popup.</Popup>
          </Marker>
          */}
          <React.Fragment>{locationMarkers}</React.Fragment>
        </LeafletMap>
        <MapWidget>
          <h3>Journey statistics:</h3>
          {locationsLoading ? <p>Loading...</p> : null}
          <p>
            <b>Logged location points:</b>
            <br />
            {locations.reduce((sum, locs) => (sum += locs.length), 0)}
          </p>
          <p>
            <b>Travelled distance:</b>
            <br />
            {Math.round(
              locations.reduce(
                (sum, locs) =>
                  (sum += locs.reduce(
                    (biggest, loc) => Math.max(biggest, loc.sumDistance),
                    0
                  )),
                0
              ) / 1000
            )}
            {"\xa0"}
            km
          </p>
          <p>
            <b>Top speed:</b>
            <br />
            {3.6 *
              locations.reduce(
                (max1, locs) =>
                  Math.max(
                    max1,
                    locs.reduce(
                      (max2, loc) =>
                        Math.max(max2, new Date(loc.speed).getTime()),
                      0
                    )
                  ),
                0
              )}{" "}
            km/h
          </p>
          <p>
            <b>Days on bicycle:</b>
            <br />
            {
              locations.reduce((dateSet, locs) => {
                const d = new Date(locs[0].timestamp);
                return dateSet.add(
                  Date.UTC(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate(),
                    0,
                    0,
                    0,
                    0
                  )
                );
              }, new Set()).size
            }
          </p>
          <p>
            <b>Latest data point:</b>
            <br />
            {new Date(
              locations.reduce(
                (max1, locs) =>
                  Math.max(
                    max1,
                    locs.reduce(
                      (max2, loc) =>
                        Math.max(max2, new Date(loc.timestamp).getTime()),
                      0
                    )
                  ),
                0
              )
            ).toUTCString()}
          </p>
        </MapWidget>
      </div>
    );
  }
}

export default MapView;
