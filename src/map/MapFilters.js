import React from "react";
import { Button } from 'antd';

import "./MapFilters.scss";

const ButtonGroup = Button.Group;

const buttons = [
  'instagram',
  'home',
  'cloud'
]

const MapFilters = props => (
  <div className="MapFilters">
    <ButtonGroup>
      {buttons.map(name => 
        <Button key={name} icon={name} type={props.filters[name] ? 'primary' : ''} onClick={() => props.onFilterChange(name)} />
      )}
      <Button onClick={() => props.onAllFilterChanged(buttons)}>All</Button>
    </ButtonGroup>
  </div>
);

export default MapFilters;
