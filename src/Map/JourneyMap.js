import React, { Component } from "react";
import Leaflet from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./Map.css";

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
    zoom: 14
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map className="JourneyMap" center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    );
  }
}

export default JourneyMap;
