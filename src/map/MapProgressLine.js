import React from "react";
import { Popover, Steps, Icon, Progress } from 'antd';

import "./Map.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import countriesData from '../data/countries/countries.json'
import config from "../common/config.js"

const Step = Steps.Step;
const tourCountries = config.tourTarget.path.countries;
const countriesDone = config.tourTarget.path.done;

const progressDot = (dot, { status, index, title }) => (
  <Popover content={<span>{title}</span>}>
    {dot}
  </Popover>
);

const countries = tourCountries.map(name => {
  return countriesData.filter(country => country.name === name)[0]
});

const MapProgressLine = props => (
  <div className="MapProgressLine">
    <Steps current={countriesDone} progressDot direction="vertical" size="small" > 
      {/* <Step title={<Icon type="global" />} />
      <Step title={<FontAwesomeIcon icon="stroopwaglobalfel"/>} /> */}
      {countries.map((country, idx) => <Step key={idx} title={country.name} onClick={() => props.onChange(country)} />)}
      {/* <Step title={<Icon type="global" />} ></Step> */}
    </Steps>

  </div>
);

export default MapProgressLine;
