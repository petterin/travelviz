import PropTypes from "prop-types";

const LocationPropType = PropTypes.shape({
  airTemperature: PropTypes.number,
  correctedElevation: PropTypes.number,
  elevation: PropTypes.number,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  speed: PropTypes.number,
  sumDistance: PropTypes.number,
  timestamp: PropTypes.string.isRequired,
  verticalSpeed: PropTypes.number
});

const LocationListPropType = PropTypes.arrayOf(LocationPropType);

const LocationsPropType = PropTypes.arrayOf(LocationListPropType);

export { LocationPropType, LocationListPropType, LocationsPropType };
