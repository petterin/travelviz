// Garmin input field name -> output field name.
// (Commented out / undefined = Not included in output)
const OUTPUT_METRIC_KEYS = {
  // sumElapsedDuration: "elapsedDuration",
  // sumMovingDuration: "movingDuration",
  directLongitude: "longitude",
  sumDistance: "sumDistance",
  directAirTemperature: "airTemperature",
  directTimestamp: "timestamp",
  // sumDuration: "duration",
  directCorrectedElevation: "correctedElevation",
  directLatitude: "latitude",
  // directUncorrectedElevation: "elevation",
  directSpeed: "speed",
  directElevation: "elevation",
  directVerticalSpeed: "verticalSpeed"
};

function convertGarminData(json) {
  // Assign the relevant output keys by Garmin's index number
  const outputMetrics = [];
  json.metricDescriptors.forEach(m => {
    const outputKey = OUTPUT_METRIC_KEYS[m.key];
    if (outputKey !== undefined) {
      outputMetrics[m.metricsIndex] = outputKey || m.key;
    }
  });

  // Assign values from index number to the output keys
  const convertMetricsArray = m => {
    const metricsObj = {};
    m.metrics.forEach((value, i) => {
      const key = outputMetrics[i];
      if (key === "timestamp") {
        metricsObj[key] = new Date(value).toISOString();
      } else if (key) {
        metricsObj[key] = value;
      }
    });
    return metricsObj;
  };
  const data = json.activityDetailMetrics.map(convertMetricsArray);

  const outputJson = { garminActivityId: json.activityId, locations: data };
  return outputJson;
}

exports.convertGarminData = convertGarminData;
