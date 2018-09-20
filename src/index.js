import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import JourneyMap from './Map/JourneyMap';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<JourneyMap />, document.getElementById('root'));
registerServiceWorker();
