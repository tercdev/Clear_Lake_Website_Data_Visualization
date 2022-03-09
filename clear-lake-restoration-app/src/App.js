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

function App() {
  return (
    <Router>
      <Title/>
      <Navbar/>
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/stream' exact element={<Stream/>} />
        <Route path='/kelsey' exact element={<Kelsey/>} />
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
