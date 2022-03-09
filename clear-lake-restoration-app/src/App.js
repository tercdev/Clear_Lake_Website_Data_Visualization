import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Title from './components/Title';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/pages/Home.js';
import Stream from './components/pages/streams/Stream.js';
import Kelsey from './components/pages/streams/Kelsey.js';
import Middle from './components/pages/streams/Middle.js';
import Scotts from './components/pages/streams/Scotts.js';
import ContactUs from './components/pages/ContactUs.js';

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
      </Routes>

    </Router>

  );
}

export default App;
