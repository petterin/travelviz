# TravelViz UI

This is the React <abbr title="Single-Page Application">SPA</abbr> web frontend for Travel Visualization service.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), which bundles together React, Webpack, Babel, Jest and others without manual configuration. For more documentation about the built-in features, see [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).


## Getting started

### Prerequisites:

* [Node.js](https://nodejs.org/) 8.x with npm 5.x (or later)

### Dependencies
- React UI library - [Ant Design](https://ant.design)
Override default variables here: ./config-overrides.js
List of the default variables can be checked [here](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)
- Dynamic text - [Fittext](https://github.com/kennethormandy/react-fittext)

### Installing dependencies

In project directory:

```
npm install
```

### Running UI in development mode

```
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br>
The page will reload if you make edits.


### Running tests

```
npm test
```

Launches the test runner in the interactive watch mode in terminal.

### Running API in development mode

**First time:**

Run `npx firebase login` in project root, and login using the provided URL and your own Google account (which should be associated to the Firebase project).

**Starting the server:**

```
cd functions
npm run serve
```

JavaScript code for Firebase Cloud Functions is under `functions/` directory, which has its own `package.json` etc.

NOTE: `firebase-tools` is installed as a npm devDependency for the main project, so you don't have to install it globally. Call it with `npx firebase <cmd>` in the project root (instead of `firebase <cmd>` used in the [Firebase documentation](https://firebase.google.com/docs/functions)).


## Deployment

To build the app for production to the `build` folder, run following in project folder:

```
npm run build
```

This correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

After running the build step, use following command in project root to deploy the full project to Firebase:

```
npx firebase deploy
```

This deploys both the compiled React frontend (from `build/´) and Cloud Functions (from `functions/`). Configuration for the Firebase setup is in `firebase.json` in project root.

(If this is the first deploy from the current machine, you might have to login to Google first using: `npx firebase login`)
