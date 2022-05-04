import React, { Suspense, lazy } from 'react';
import './App.css';
import FullHeader from './Components/FullHeader'
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./Components/pages/Home'));
const StreamHome = lazy(() => import('./Components/pages/streams/StreamHome'));
const Stream = lazy(() => import('./Components/pages/streams/Stream'));
const LoginPage = lazy(() => import('./Components/pages/upload-csv/LoginPage'));
const MetHome = lazy(() => import('./Components/pages/met/MetHome'));
const Met = lazy(() => import('./Components/pages/met/Met'));
const LakeTchainHome = lazy(() => import('./Components/pages/lakeTChain/LakeTchainHome'));
const LakeTchain = lazy(() => import('./Components/pages/lakeTChain/LakeTchain'));
const LakeCTDHome = lazy(() => import('./Components/pages/lakeCTD/LakeCTDHome'));
const LakeCTD = lazy(() => import('./Components/pages/lakeCTD/LakeCTD'));
const DataArchive = lazy(() => import('./Components/pages/data-archive/DataArchive'))

function App() {
  return (
    <Router basename='/Clear_Lake_Website_Data_Visualization/'>
      <FullHeader />
      <Navigation/>
      <Suspense fallback={<div>Loading...</div>}>
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

        <Route path='/lakeCTD' exact element={<LakeCTDHome/>} />
        <Route path='/lakeprofile' exact element={<LakeCTD name={"Lake Profile Monitoring"}/>} />

        <Route path='/upload-csv' exact element={<LoginPage/>} />

        <Route path='/data-archive' exact element={<DataArchive/>} />
      </Routes>
      </Suspense>
      <Footer />
    </Router>

  );
}

export default App;
