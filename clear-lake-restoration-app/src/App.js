import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import FullHeader from './Components/FullHeader'
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Components/pages/Home.js';
import Stream from './Components/pages/streams/Stream.js';
import StreamHome from './Components/pages/streams/StreamHome.js';
import LoginPage from './Components/pages/upload-csv/LoginPage';
import MetHome from './Components/pages/met/MetHome.js';
import Met from './Components/pages/met/Met.js';
import LakeTchainHome from './Components/pages/lake/LakeTchainHome.js';
import LakeTchain from './Components/pages/lake/LakeTchain';

function getCurrentTime() {
  var time = new Date().toLocaleDateString();
  time = time.split('/');
  var currentTimeArr = time.slice(0).reverse().map(
      val => { return val;
  })
  if (currentTimeArr[1].length < 2) {
      currentTimeArr[1] = '0' + currentTimeArr[1];
  }
  if (currentTimeArr[2].length < 2) {
      currentTimeArr[2] = '0' + currentTimeArr[2];
  }
  var curTime = currentTimeArr[0] + currentTimeArr[2] + currentTimeArr[1];
  return curTime;
}

function getPreviousWeekDate() {
  var today = new Date();
  var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
  var month = (lastWeek.getUTCMonth() + 1).toString(); //months from 1-12
  var day = lastWeek.getUTCDate().toString();
  var year = lastWeek.getUTCFullYear().toString();

  if (month.length < 2) {
      month = '0' + month;
  }
  if (day.length < 2) {
      day = '0' + day;
  }
  return year+month+day;
}

function App() {
  var fromDate = getPreviousWeekDate();
  var toDate = getCurrentTime();
  return (
    <Router basename='/Clear_Lake_Website_Data_Visualization/'>
      <FullHeader />
      <Navigation/>
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/stream' exact element={<StreamHome />} />
        <Route path='/kelsey' exact element={<Stream id={"1"} name={"Kelsey Creek"}/>} />
        <Route path='/middle' exact element={<Stream id={"2"} name={"Middle Creek"}/>} />
        <Route path='/scotts' exact element={<Stream id={"3"} name={"Scotts Creek"}/>} />
        
        <Route path='/met' exact element={<MetHome/>} />
        <Route path='/bkp' exact element={<Met id={"1"} name={"Buckingham Point"}/>} />
        <Route path='/clo' exact element={<Met id={"2"} name={"Clearlake Oaks"}/>} />
        <Route path='/jgb' exact element={<Met id={"3"} name={"Jago Bay"}/>} />
        <Route path='/knb' exact element={<Met id={"4"} name={"Konocti Bay"}/>} />
        <Route path='/nlp' exact element={<Met id={"6"} name={"North Lakeport"}/>} />
        <Route path='/nic' exact element={<Met id={"5"} name={"Nice"}/>} />
        <Route path='/bvr' exact element={<Met id={"7"} name={"Big Valley Rancheria"}/>} />

        <Route path='/lakemooring' exact element={<LakeTchainHome/>} />
        <Route path='/la03' exact element={<LakeTchain name={"LA-03 Station"}/>} />
        <Route path='/nr02' exact element={<LakeTchain name={"NR-02 Station"}/>} />
        <Route path='/oa04' exact element={<LakeTchain name={"OA-04 Station"}/>} />
        <Route path='/ua01' exact element={<LakeTchain name={"UA-01 Station"}/>} />
        <Route path='/ua06' exact element={<LakeTchain name={"UA-06 Station"}/>} />
        <Route path='/ua07' exact element={<LakeTchain name={"UA-07 Station"}/>} />
        <Route path='/ua08' exact element={<LakeTchain name={"UA-08 Station"}/>} />

        <Route path='/upload-csv' exact element={<LoginPage/>} />
      </Routes>
      <Footer />
    </Router>

  );
}

export default App;
