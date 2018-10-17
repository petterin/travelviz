/**
 * Node script to convert Garmin GPS JSON data to TravelViz JSON format.
 *
 * Usage: `node convertGarminData.js` (NOTE: see/change input and output filenames in code!)
 */

const fs = require("fs");

// TODO: Change these:
const inputPaths = [
  "garmin_3069518268.json",
  "garmin_3069512763.json",
  "garmin_3066921966.json",
  "garmin_3066921799.json",
  "garmin_3064392533.json",
  "garmin_3061476113.json",
  "garmin_3059461791.json",
  "garmin_3056121999.json",
  "garmin_3056121805.json",
  "garmin_3037698901.json",
  "garmin_3032006437.json",
  "garmin_3028657078.json",
  "garmin_3024610852.json",
  "garmin_3024610723.json",
  "garmin_3024610671.json",
  "garmin_3024610488.json",
  "garmin_3024610111.json",
  "garmin_3024610027.json",
  "garmin_3008099722.json",
  "garmin_3008099695.json",
  "garmin_3008099669.json",
  "garmin_3008099631.json",
  "garmin_3008099608.json",
  "garmin_3008099590.json",
  "garmin_2994808167.json",
  "garmin_2987001621.json",
  "garmin_2984978172.json",
  "garmin_2984583396.json",
  "garmin_2982840709.json",
  "garmin_2982250804.json",
  "garmin_2981964669.json",
  "garmin_2974854277.json",
  "garmin_2974433520.json",
  "garmin_2972158314.json",
  "garmin_2972158235.json",
  "garmin_2969499683.json",
  "garmin_2969310247.json"
];
const outputDir = "../src/data/";

inputPaths.forEach(inputPath => {
  convert(inputPath, `${outputDir}${inputPath}`);
});

function convert(inputPath, outputPath) {
  const file = fs.readFileSync(inputPath, "utf8");
  const json = JSON.parse(file);

  // input field name -> output field name. (Commented out / undefined = Not included in output)
  const outputMetricKeys = {
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
}
