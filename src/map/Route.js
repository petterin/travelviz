import React from "react";
import { CircleMarker, Polyline, Tooltip } from "react-leaflet";

const drawRouteEndMarker = loc => (
  <CircleMarker center={[loc.latitude, loc.longitude]} key={loc.timestamp}>
    <Tooltip>{new Date(loc.timestamp).toUTCString()}</Tooltip>
  </CircleMarker>
);

const drawPartialRoute = locationList => {
  const realLocations = locationList.filter(
    loc => loc.latitude && loc.longitude
  );
  if (realLocations.length < 1) {
    return null;
  }
  return (
    <React.Fragment key={realLocations[0].timestamp}>
      {drawRouteEndMarker(realLocations[0])}
      <Polyline
        positions={realLocations.map(loc => [loc.latitude, loc.longitude])}
      />
      {drawRouteEndMarker(realLocations[realLocations.length - 1])}
    </React.Fragment>
  );
};

const drawRoute = locations =>
  locations.reduce((result, locationBatch) => {
    const routePart = drawPartialRoute(locationBatch);
    if (routePart) {
      return result.concat(routePart);
    } else {
      return result;
    }
  }, []);

const Route = props => (
  <React.Fragment>{drawRoute(props.locations)}</React.Fragment>
);

export default Route;
