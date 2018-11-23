const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// --- Root of the project's Cloud Functions ---

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});

const app = express();

// Middleware
app.use(cors({ origin: true }));

// TODO: Add authentication for write requests

app.get("/userLocations/:userId/summary", (req, res) => {
  const userId = req.params.userId;
  // Get document fields in db path /userLocations/:userId
  const userRef = firestore.collection("userLocations").doc(userId);
  userRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.warn(`Document not found: /userLocations/${userId}`);
        return res.status(404).json({ error: "User data not found" });
      } else {
        return res.json(doc.data());
      }
    })
    .catch(err => {
      console.error("Error getting document", err);
      res.status(500).json({ error: "Error fetching from database." });
    });
});

app.post("/userLocations/:userId/garmin", (req, res) => {
  if (!req.is("json")) {
    return res.status(415).json({ error: "Content type must be JSON." });
  }
  const userId = req.params.userId;
  const body = req.body;
  // TODO: Convert from Garmin format to our format
  const timestamp = new Date().toISOString(); // TODO: Get timestamp from oldest/newest location in body
  return firestore
    .collection("userLocations")
    .doc(userId)
    .collection("locationBatches")
    .doc(timestamp)
    .set(body)
    .then(writeResult => {
      return res.json({
        result: `Location batch with timestamp ${timestamp} added.`
      });
    })
    .catch(err => {
      console.error("Error saving Garmin location batch", err);
      res.status(500).json({ error: "Error saving the data." });
    });
});

exports.api = functions.https.onRequest(app);
