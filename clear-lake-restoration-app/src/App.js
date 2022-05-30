import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FullHeader from './Components/FullHeader.js';
import Navigation from './Components/Navigation.js';
import Home from './Components/pages/Home.js';
import StreamHome from './Components/pages/streams/StreamHome.js';
import Stream from './Components/pages/streams/Stream.js';
import MetHome from './Components/pages/met/MetHome.js';
import Met from './Components/pages/met/Met.js';
import LakeTchainHome from './Components/pages/lakeTChain/LakeTchainHome.js';
import LakeTchain from './Components/pages/lakeTChain/LakeTchain';
import LakeCTDHome from './Components/pages/lakeCTD/LakeCTDHome.js';
import LakeCTD from './Components/pages/lakeCTD/LakeCTD.js';
import LoginPage from './Components/pages/upload-csv/LoginPage';
import DataArchive from './Components/pages/data-archive/DataArchive.js';
import Map from './Components/Map.js';
import Footer from './Components/Footer.js';

import './App.css';

/**
 * Component for setting up all the routes in this React app.  
 * Header and Footer for every page except '/map'.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Router basename='/Clear_Lake_Website_Data_Visualization/'>
      {window.location.pathname !== '/Clear_Lake_Website_Data_Visualization/map' ? <><FullHeader/><Navigation/></>:<></>}
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/stream' exact element={<StreamHome />} />
        <Route path='/kelsey' exact element={<Stream id={"1"} name={"Kelsey Creek"}/>} />
        <Route path='/middle' exact element={<Stream id={"2"} name={"Middle Creek"}/>} />
        <Route path='/scotts' exact element={<Stream id={"3"} name={"Scotts Creek"}/>} />
        
        <Route path='/met' exact element={<MetHome/>} />
        <Route path='/bkp' exact element={<Met id={"1"} name={"Buckingham Point"}/>} />
        <Route path='/clo' exact element={<Met id={"2"} name={"Clearlake Oaks"}/>} />
        <Route path='/bek' exact element={<Met id={"3"} name={"Beakbane Island"}/>} />
        <Route path='/knb' exact element={<Met id={"4"} name={"Konocti Bay"}/>} />
        <Route path='/nlp' exact element={<Met id={"6"} name={"North Lakeport"}/>} />
        <Route path='/nic' exact element={<Met id={"5"} name={"Nice"}/>} />
        <Route path='/bvr' exact element={<Met id={"7"} name={"Big Valley Rancheria"}/>} />

        <Route path='/lakemooring' exact element={<LakeTchainHome/>} />
        <Route path='/la03' exact element={<LakeTchain id={"1"} name={"LA-03 Station"}/>} />
        <Route path='/nr02' exact element={<LakeTchain id={"2"} name={"NR-02 Station"}/>} />
        <Route path='/oa04' exact element={<LakeTchain id={"3"} name={"OA-04 Station"}/>} />
        <Route path='/ua01' exact element={<LakeTchain id={"4"} name={"UA-01 Station"}/>} />
        <Route path='/ua06' exact element={<LakeTchain id={"5"} name={"UA-06 Station"}/>} />
        <Route path='/ua08' exact element={<LakeTchain id={"6"} name={"UA-08 Station"}/>} />
        <Route path='/ua07' exact element={<LakeTchain id={"7"} name={"UA-07 Station"}/>} />

        <Route path='/lakeCTD' exact element={<LakeCTDHome/>} />
        <Route path='/ua01-profile' exact element={<LakeCTD id={"1"} name={"UA-01 Profile"}/>} />
        <Route path='/ua06-profile' exact element={<LakeCTD id={"2"} name={"UA-06 Profile"}/>} />
        <Route path='/ua07-profile' exact element={<LakeCTD id={"3"} name={"UA-07 Profile"}/>} />
        <Route path='/ua08-profile' exact element={<LakeCTD id={"4"} name={"UA-08 Profile"}/>} />
        <Route path='/la03-profile' exact element={<LakeCTD id={"5"} name={"LA-03 Profile"}/>} />
        <Route path='/nr02-profile' exact element={<LakeCTD id={"6"} name={"NR-02 Profile"}/>} />
        <Route path='/oa04-profile' exact element={<LakeCTD id={"7"} name={"OA-04 Profile"}/>} />

        <Route path='/upload-csv' exact element={<LoginPage/>} />

        <Route path='/data-archive' exact element={<DataArchive/>} />

        <Route path='/map' exact element={<Map name="all"/>} />
      </Routes>
      {window.location.pathname!=='/Clear_Lake_Website_Data_Visualization/map'?<Footer />:<></>}
    </Router>

  );
}

export default App;
