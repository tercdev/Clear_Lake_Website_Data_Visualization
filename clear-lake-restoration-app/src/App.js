import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import FullHeader from './Components/FullHeader'
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";

import Home from './Components/pages/Home.js';
import Stream from './Components/pages/streams/Stream.js';
import StreamHome from './Components/pages/streams/StreamHome.js';
import DropCSVFile from './Components/pages/DropCSVFile';
import MetHome from './Components/pages/met/MetHome.js';
import Met from './Components/pages/met/Met.js';
import LakeHome from './Components/pages/lake/LakeHome.js';

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
        <Route path='/kelsey' exact element={<Stream fromDate={fromDate} endDate={toDate} id={"1"} name={"Kelsey Creek"}/>} />
        <Route path='/middle' exact element={<Stream fromDate={fromDate} endDate={toDate} id={"2"} name={"Middle Creek"}/>} />
        <Route path='/scotts' exact element={<Stream fromDate={fromDate} endDate={toDate} id={"3"} name={"Scotts Creek"}/>} />
        
        <Route path='/bkp' exact element={<Met fromDate={fromDate} endDate={toDate} id={"1"} name={"Buckingham Point"}/>} />
        <Route path='/clo' exact element={<Met fromDate={fromDate} endDate={toDate} id={"2"} name={"Clearlake Oaks"}/>} />
        <Route path='/jgb' exact element={<Met fromDate={fromDate} endDate={toDate} id={"3"} name={"Jago Bay"}/>} />
        <Route path='/knb' exact element={<Met fromDate={fromDate} endDate={toDate} id={"4"} name ={"Konocti Bay"}/>} />
        <Route path='/nlp' exact element={<Met fromDate={fromDate} endDate={toDate} id={"6"} name={"North Lakeport"}/>} />
        <Route path='/nic' exact element={<Met fromDate={fromDate} endDate={toDate} id={"5"} name={"Nice"}/>} />
        <Route path='/bvr' exact element={<Met fromDate={fromDate} endDate={toDate} id={"7"} name={"Big Valley Rancheria"}/>} />

        <Route path='/upload-csv' exact element={<DropCSVFile/>} />
        <Route path='/met' exact element={<MetHome/>} />
        <Route path='/lake' exact element={<LakeHome/>} />
      </Routes>
      <Footer />
    </Router>

  );
}

export default App;
