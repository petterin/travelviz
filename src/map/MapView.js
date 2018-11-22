import React, { Component } from "react";
import PropTypes from "prop-types";

import MapTopbar from "./MapTopbar";
import MapFilters from "./MapFilters";
import MapProgressLine from "./MapProgressLine";
import Map from "./Map";
import SignModal from "../components/SinInOutnModal";

import "./Map.scss";

import config from "../common/config.js"

const logoSVG = () => (
  <svg width="20px" height="20px" viewBox="0 0 160 160" >
    <g transform="translate(-10.000000, -10.000000)" fill="#30cc5f" fillRule="nonzero">
      <path d="M20,10 L160,10 C165.522847,10 170,14.4771525 170,20 L170,160 C170,165.522847 165.522847,170 160,170 L20,170 C14.4771525,170 10,165.522847 10,160 L10,20 C10,14.4771525 14.4771525,10 20,10 Z M51.59,33.36 L51.59,151 L71.48,151 L71.48,103.23 L97.66,103.23 C103.666697,103.23 109.021643,102.238343 113.725,100.255 C118.428357,98.2716568 122.366651,95.6650161 125.54,92.435 C128.713349,89.2049839 131.121658,85.4650213 132.765,81.215 C134.408342,76.9649787 135.23,72.6300221 135.23,68.21 C135.23,64.0166457 134.408342,59.8516873 132.765,55.715 C131.121658,51.5783126 128.713349,47.8383501 125.54,44.495 C122.366651,41.1516499 118.45669,38.4600102 113.81,36.42 C109.16331,34.3799898 103.780031,33.36 97.66,33.36 L51.59,33.36 Z M71.48,86.4 L71.48,50.53 L97.66,50.53 C102.760026,50.53 106.98165,52.1733169 110.325,55.46 C113.66835,58.7466831 115.34,62.9399745 115.34,68.04 C115.34,70.6466797 114.858338,73.0549889 113.895,75.265 C112.931662,77.475011 111.656675,79.4016584 110.07,81.045 C108.483325,82.6883415 106.613344,83.9916618 104.46,84.955 C102.306656,85.9183381 100.040012,86.4 97.66,86.4 L71.48,86.4 Z"></path>
    </g>
  </svg>
)
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
  Math.floor(100 * calculateTotalDistance(locations) / config.tour.km)

class MapView extends Component {
  mapRef = React.createRef()

  // Initial map position and default empty values
  state = {
    modalKey: null,
    modalVisible: false,
    lat: 60.1869,
    lng: 24.8215,
    zoom: 7,
    locations: [],
    locationsLoading: false,
    filters: {}
  };

  showModal = key => {
    this.setState({
      modalKey: key,
      modalVisible: true
    });
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

  onFilterChange = (filter) => {
    const { filters } = this.state
    // Object.keys(filters).map(key => { filters[key] = false })
    filters[filter] = !filters[filter]
    this.setState({ filters })
  }

  onAllFilterChanged = names => {
    const filters = names.reduce((obj, name) => Object.assign(obj, { [name]: true }) , {})
    this.setState({ filters })
  }

  render() {
    const { locations, locationsLoading, zoom, filters } = this.state;
    // const position = [this.state.lat, this.state.lng];
    const enabledFilters = Object.keys(filters).filter(key => filters[key])
    return (
      <div className="MapView">
        <MapTopbar locations={locations} locationsLoading={locationsLoading} xs={0} sm={0} md={0} showModal={this.showModal} />
        <Map state={this.state} ref={this.mapRef} enabledFilters={enabledFilters} />
        <MapProgressLine onChange={this.onCountryChange} distance={calculateTotalDistance(locations)} progress={progressDistance(locations)} />
        <a href="/" className="logo">SPUTNIK</a>
        <MapFilters filters={filters} onFilterChange={this.onFilterChange} onAllFilterChanged={this.onAllFilterChanged} />
        <SignModal
          visible={this.state.modalVisible}
          activeKey={this.state.modalKey}
          onClose={() => this.setState({ modalVisible: false })}
        />
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
