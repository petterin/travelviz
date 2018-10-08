/**
 * Node script to convert Garmin GPS JSON data to TravelViz JSON format.
 *
 * Usage: `node convertGarminData.js` (NOTE: see/change input and output filenames in code!)
 */

const fs = require("fs");

// TODO: Change these:
const inputPath = "garmin_data1.json";
const outputPath = "garmin_data1_converted.json";

const file = fs.readFileSync(inputPath, "utf8");
const json = JSON.parse(file);

// input field name -> output field name. (Commented out / undefined = Not included in output)
const outputMetricKeys = {
  // sumElapsedDuration: "elapsedDuration",
  // sumMovingDuration: "movingDuration",
  directLongitude: "longitude",
  // sumDistance: "sumDistance",
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

const metrics = [];
json.metricDescriptors.forEach(m => {
  const outputKey = outputMetricKeys[m.key];
  if (outputKey !== undefined) {
    metrics[m.metricsIndex] = outputKey || m.key;
  }
});

const convertMetricsArray = m => {
  const metricsObj = {};
  m.metrics.forEach((value, i) => {
    const key = metrics[i];
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

const output = JSON.stringify(outputJson);  
fs.writeFileSync(outputPath, output);  
console.log(`Wrote ${data.length} datapoints to file ${outputPath}.`);
