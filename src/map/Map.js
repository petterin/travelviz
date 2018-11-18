import React from "react";
import DeckGL, { LineLayer, IconLayer, TextLayer } from 'deck.gl';
import {StaticMap} from 'react-map-gl';

import config from "../common/config.js"
import garminData from "../data/garmin_locations"
import { Icon, Card } from 'antd';

import instaData from '../data/insta'
import "../common/_variables.scss";

const { Meta } = Card;

const locations = garminData
	.reduce((acc, arr) => acc.concat(arr.slice(0).reverse()), [])
	.reverse()
	// .slice(0, 100)

const pics = instaData.map(item => {
	const ts = item.taken_at_timestamp * 1000
	let prevLocTs = 0
	let found = false
	const coords = locations.filter(l => {
		if (found) {
			return false
		}
		const locTs = +new Date(l.timestamp) 
		if (ts > prevLocTs && ts < locTs) {
			found = true
			return true
		}
		prevLocTs = locTs
		return false
	})
	item.coords = coords[0]
	return item
}).filter(item => item && !!item.coords)
// console.log('instaData', pics)

const data = locations
	.map((p, num, arr) => ({
		elevation: p.elevation,
		speed: p.speed,
		sourcePosition: [p.longitude, p.latitude], 
		targetPosition: arr[num+1] 
			? [arr[num+1].longitude, arr[num+1].latitude]
			: [p.longitude, p.latitude],
		days: arr[num + 1]
			? Math.floor((new Date(arr[num + 1].timestamp) - new Date(p.timestamp)) / (24 * 3600 * 1000))
			: 0
	}))
	.filter(p => p && p.sourcePosition && p.sourcePosition[0] && p.sourcePosition[1] && p.targetPosition[0] && p.targetPosition[1] && p.speed)

const points = locations
	.map((p, num, arr) => ({
		elevation: p.elevation,
		speed: p.speed,
		sourcePosition: [p.longitude, p.latitude],
		days: arr[num + 1]
			? Math.floor((new Date(arr[num + 1].timestamp) - new Date(p.timestamp)) / (24 * 3600 * 1000))
			: 0,
		// test: (() => console.log(new Date(arr[num + 1].timestamp), new Date(p.timestamp)))()
	}))
	.filter(p => p && p.sourcePosition && p.sourcePosition[0] && p.sourcePosition[1] && p.days > 0)

// console.log('points', points)

config.initialViewState.latitude = garminData[0][0].latitude
config.initialViewState.longitude = garminData[0][0].longitude

class Map extends React.Component {
	deckGlRef = React.createRef()
	mapRef = React.createRef()

	state = config.initialViewState

	_onIconClick = ({ x, y, object }) => {
		this.setState({ x, y, hoveredObject: object });
	}

	// _renderTooltip = () => {
	// 	const { x, y, hoveredObject } = this.state;
	// 	return (
	// 		hoveredObject && (
	// 			<div className="tooltip" style={{ left: x, top: y }}>
	// 				{hoveredObject.days ? <div>{hoveredObject.days}</div> : null }
	// 				{hoveredObject.thumbnail_src ? <img width='200' src={hoveredObject.thumbnail_src} /> : null }
	// 			</div>
	// 		)
	// 	);
	// }

	renderTooltip = () => {
		const { x, y, hoveredObject } = this.state;
		const img = hoveredObject && hoveredObject.thumbnail_src ? <img src = { hoveredObject.thumbnail_src } /> : null;
		return (
			hoveredObject && (
				<Card className="tooltip" style={{ left: x, top: y }} hoverable 
					style={{ width: 240 }} 
					cover={img} >
					<Meta
						title={hoveredObject.days}
						description="www.instagram.com"
				/>
				</Card>
			)
		);
	}

	setLocation = latlng => {
		const viewState = { 
			...config.initialViewState,
			latitude: latlng[0], 
			longitude: latlng[1] 
		}
		this.deckGlRef.current.deck.setProps({ viewState })
		this.mapRef.current.getMap().panTo([latlng[1], latlng[0]], { duration: 1 })
	}
	render(){
		const layers = [
      new LineLayer({
      	id: 'layer-path', 
      	data,
				pickable: true,
    		getStrokeWidth: 3, 
				// getColor: d => [100 * Math.sqrt(d.speed), 100, 180, 255],
				getColor: d => [16 * Math.sqrt(d.elevation), 100, 180, 255],  
				// onHover: ({ object }) => setTooltip(`${object.day}`)   
				// onHover: this._onHover	
			}),
			new IconLayer({
				id: 'layer-pointer',
				data: points,
				iconAtlas: '/assets/pin.png', //<Icon type="home" theme="filled" />,
				pickable: true,
				iconMapping: {
					marker: {
						x: 0,
						y: 0,
						width: 128,
						height: 128,
						anchorY: 128,
						mask: true
					}
				},
				sizeScale: 15,
				getPosition: d => d.sourcePosition,
				getIcon: d => 'marker',
				getSize: d => 5,
				getColor: d => [48, 204, 95], //d => [Math.sqrt(d.days), 140, 0],
			}),
			new IconLayer({ // insta
				id: 'layer-insta',
				data: pics,
				iconAtlas: '/assets/pin.png',
				pickable: true,
				iconMapping: {
					marker: {
						x: 0,
						y: 0,
						width: 128,
						height: 128,
						anchorY: 128,
						mask: true
					}
				},
				sizeScale: 15,
				getPosition: d => [d.coords.longitude, d.coords.latitude],
				getIcon: d => 'marker',
				getSize: d => 5,
				getColor: d => [48, 204, 95], //[Math.sqrt(d.days), 140, 0],
				onClick: this._onIconClick
			}),
			new TextLayer({
				id: 'layer-stops',
				data: points,
				pickable: true,
				getPosition: d => d.sourcePosition,
				getText: d => ''+d.days,
				getSize: 32,
				getAngle: 0,
				getTextAnchor: 'middle',
				getAlignmentBaseline: 'center',
				getPixelOffset: () => [0, -36]
				// onHover: ({ object }) => setTooltip(`${object.name}\n${object.address}`)
			})			
    ];

    return (
      <DeckGL
				ref={this.deckGlRef}
				initialViewState={config.initialViewState}
        controller={true}
        layers={layers}>
				<StaticMap 
					ref={this.mapRef}
        	reuseMaps 
      		mapboxApiAccessToken={config.mapboxApiAccessToken} 
        	preventStyleDiffing={true} 
        	mapStyle="mapbox://styles/mapbox/light-v9" />
				{this.renderTooltip}
      </DeckGL>
    );
	}

}
export default Map;
