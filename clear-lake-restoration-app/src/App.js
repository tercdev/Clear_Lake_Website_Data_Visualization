import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Title from './Components/Title';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Components/pages/Home.js';
import Stream from './Components/pages/streams/Stream.js';
import Kelsey from './Components/pages/streams/Kelsey.js';
import Middle from './Components/pages/streams/Middle.js';
import Scotts from './Components/pages/streams/Scotts.js';
import ContactUs from './Components/pages/ContactUs.js';
import Met from './Components/pages/met/Met.js';
import Lake from './Components/pages/lake/Lake.js';

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
    <Router>
      <Title/>
      <Navbar/>
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/stream' exact element={<Stream />} />
        <Route path='/kelsey' exact element={<Stream fromDate={fromDate} endDate={toDate}/>} />
        <Route path='/middle' exact element={<Middle/>} />
        <Route path='/scotts' exact element={<Scotts/>} />
        <Route path='/contact-us' exact element={<ContactUs/>} />
        <Route path='/met' exact element={<Met/>} />
        <Route path='/lake' exact element={<Lake/>} />
      </Routes>
      {/* <Map/> */}
    </Router>

  );
}

export default App;
