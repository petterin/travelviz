import React from "react";
import DeckGL, {LineLayer, PathLayer} from 'deck.gl';
import {StaticMap} from 'react-map-gl';

import config from "../common/config.js"
import garminData from "../data/garmin_locations"

const data = garminData
	.reduce((acc, arr) => acc.concat(arr.reverse()),[])
	// .slice(0, 100)
	.map((p, num, arr) => ({
		elevation: p.elevation,
		speed: p.speed,
		sourcePosition: [p.longitude, p.latitude], 
		targetPosition: arr[num+1] 
			? [arr[num+1].longitude, arr[num+1].latitude]
			: [p.longitude, p.latitude]
	}))
	.filter(p => p && p.sourcePosition && p.sourcePosition[0] && p.sourcePosition[1] && p.targetPosition[0] && p.targetPosition[1] && p.speed)

config.initialViewState.latitude = garminData[0][0].latitude
config.initialViewState.longitude = garminData[0][0].longitude


class Map extends React.Component {

	render(){
		const layers = [
      new LineLayer({
      	id: 'line-layer', 
      	data,
				pickable: true,
    		getStrokeWidth: 3, 
    		getColor: d => [10 * Math.sqrt(d.elevation), 100, 180, 255],     	
      }) 
    ];

    return (
      <DeckGL
        initialViewState={config.initialViewState}
        controller={true}
        layers={layers}>
        <StaticMap 
        	reuseMaps 
      		mapboxApiAccessToken={config.mapboxApiAccessToken} 
        	preventStyleDiffing={true} 
        	mapStyle="mapbox://styles/mapbox/light-v9" />
      </DeckGL>
    );
	}

}
export default Map;
