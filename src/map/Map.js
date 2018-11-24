import React from "react";
import DeckGL, { LineLayer, IconLayer, TextLayer } from 'deck.gl';
import {StaticMap} from 'react-map-gl';
import memoize from "memoize-one";

import config from "../common/config.js"
import { Card, Rate } from 'antd';

import instaData from '../data/insta'
import "../common/_variables.scss";

const { Meta } = Card;

const pics = locations => instaData.map(item => {
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

const data = locations => locations
	.map((p, num, arr) => ({
		elevation: p.elevation,
		speed: p.speed,
		temperature: p.airTemperature,
		sourcePosition: [p.longitude, p.latitude], 
		targetPosition: arr[num+1] 
			? [arr[num+1].longitude, arr[num+1].latitude]
			: [p.longitude, p.latitude],
		days: arr[num + 1]
			? Math.floor((new Date(arr[num + 1].timestamp) - new Date(p.timestamp)) / (24 * 3600 * 1000))
			: 0
	}))
	.filter(p => p && p.sourcePosition && p.sourcePosition[0] && p.sourcePosition[1] && p.targetPosition[0] && p.targetPosition[1] && p.speed)

const points = locations => locations
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

const temps = locations => locations
	.map((p, num, arr) => ({
		elevation: p.elevation,
		speed: p.speed,
		temperature: p.airTemperature,
		sourcePosition: [p.longitude, p.latitude],
		diff: arr[num + 1]
			? Math.floor(arr[num + 1].airTemperature - p.airTemperature)
			: 0,
		// test: (() => console.log(new Date(arr[num + 1].timestamp), new Date(p.timestamp)))()
	}))
	.filter(p => p && p.sourcePosition && p.sourcePosition[0] && p.sourcePosition[1] && p.diff > 1)


// console.log('points', points)

class Map extends React.Component {
	constructor(props) {
		super(props);

		this.deckGlRef = React.createRef()
		this.mapRef = React.createRef()

		this.state = {
			x: 0,
			y: 0,
			hoveredObject: null
		};
	}

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
		const img = hoveredObject && hoveredObject.display_url ? <img src={hoveredObject.display_url} /> : null;
		const desc = hoveredObject && hoveredObject.edge_media_to_caption ? hoveredObject.edge_media_to_caption.edges[0].node.text : ""; 
		const likes = hoveredObject && hoveredObject.edge_media_preview_like ? hoveredObject.edge_media_preview_like.count : 0;
		// const rate = likes/100;
		return (
			hoveredObject && (
				// <Card className="tooltip" style={{ left: x, top: y }} hoverable 
				<div style={{ left: x, top: y, position: "absolute", zIndex: 1001 }}>
					<Card className="tooltip" hoverable 
						style={{ width: 240 }} 
						cover={img} >
						<Meta
							title={hoveredObject.days}
							description={desc} />
						<Rate allowHalf defaultValue={3.5} />
					</Card>
				</div>
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

	onViewStateChange = () => {
		this.setState({ hoveredObject: null })
	}

	// If locationProps hasn't changed since the last call (render),
	// `memoize-one` will reuse the last return value.
	flatLocations = memoize(locationProps =>
		locationProps
			.reduce((acc, arr) => acc.concat(arr.slice(0).reverse()), [])
			.reverse()
	);

	render(){
		const { enabledFilters } = this.props
		const locations = this.flatLocations(this.props.locations);

		const { initialViewState } = config;
		if (this.props.locations && this.props.locations[0] && this.props.locations[0][0]) {
			initialViewState.latitude = this.props.locations[0][0].latitude
			initialViewState.longitude = this.props.locations[0][0].longitude
		}

		const layers = [
			new LineLayer({
				id: 'layer-path', 
				data: data(locations),
				pickable: true,
				getStrokeWidth: 3, 
				// getColor: d => [100 * Math.sqrt(d.speed), 100, 180, 255],
				getColor: d => [16 * Math.sqrt(d.elevation), 100, 180, 255],  
				// onHover: ({ object }) => setTooltip(`${object.day}`)   
				// onHover: this._onHover	
			})
		]

		const homeLayers = [
			new IconLayer({
				id: 'layer-pointer',
				data: points(locations),
				iconAtlas: '/assets/pin_night.png', //<Icon type="home" theme="filled" />,
				pickable: true,
				iconMapping: {
					marker: {
						x: 0,
						y: 0,
						width: 128,
						height: 160,
						anchorY: 128,
						mask: true
					}
				},
				sizeScale: 12,
				getPosition: d => d.sourcePosition,
				getIcon: d => 'marker',
				getSize: d => 5,
				getColor: d => [48, 204, 95], //[200, 50 * Math.sqrt(d.days), 95], //[48, 204, 95], //
			}),
			new TextLayer({
				id: 'layer-stops',
				data: points(locations),
				pickable: true,
				getPosition: d => d.sourcePosition,
				getText: d => '' + d.days,
				getSize: 18,
				getAngle: 0,
				getTextAnchor: 'middle',
				getAlignmentBaseline: 'center',
				getPixelOffset: () => [6, -24]
				// onHover: ({ object }) => setTooltip(`${object.name}\n${object.address}`)
			})]	
		const tempLayers = [
			new TextLayer({
				id: 'layer-temp',
				data: temps(locations),
				pickable: true,
				getPosition: d => d.sourcePosition,
				getText: d => '' + d.temperature + 'C',
				getSize: 18,
				getAngle: 0,
				getTextAnchor: 'middle',
				getAlignmentBaseline: 'center'
			})]	
	
		const instaLayers = [
			new IconLayer({ // insta
				id: 'layer-insta',
				data: pics(locations),
				iconAtlas: '/assets/pin_insta.png',
				pickable: true,
				iconMapping: {
					marker: {
						x: 0,
						y: 0,
						width: 128,
						height: 160,
						anchorY: 128,
						mask: true
					}
				},
				sizeScale: 10,
				getPosition: d => [d.coords.longitude, d.coords.latitude],
				getIcon: d => 'marker',
				getSize: d => 5,
				// getColor: d => [48, 204, 95], //[Math.sqrt(d.days), 140, 0],
				onClick: this._onIconClick
			})
		];

		if (enabledFilters.includes('home')) {
			homeLayers.map(layer => layers.push(layer))
		}

		if (enabledFilters.includes('instagram')) {
			instaLayers.map(layer => layers.push(layer))
		}

		if (enabledFilters.includes('cloud')) {
			tempLayers.map(layer => layers.push(layer))
		}

		if (!this.props.locations || this.props.locations.length === 0) {
			return null;
		}
		return (
			<DeckGL
				ref={this.deckGlRef}
				initialViewState={initialViewState}
				controller={true}
				layers={layers}
				onViewStateChange={this.onViewStateChange}
				>
				<StaticMap 
					ref={this.mapRef}
					reuseMaps
					mapboxApiAccessToken={config.mapboxApiAccessToken}
					preventStyleDiffing={true}
					mapStyle="mapbox://styles/mapbox/light-v9"
				/>
				{this.renderTooltip}
			</DeckGL>
		);
	}

}
export default Map;
