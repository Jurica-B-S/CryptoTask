import React from 'react';
import logo from './logo.svg';
import './App.css';
import ContentTask from './App_Container/ContentTask';
const API_LINK = "https://api.multifarm.fi/jay_flamingo_random_6ix_vegas/get_assets?pg=1&tvl_min=50000&sort=tvlStaked&sort_order=desc&farms_tvl_staked_gte=10000000"

function App() {
  return (
    <ContentTask link={API_LINK}/>
  );
}

export default App;
