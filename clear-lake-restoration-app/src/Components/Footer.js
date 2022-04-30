import React, { Component } from 'react';

import CLO from '../images/sponsors/CLO.webp';
import BVR from '../images/sponsors/bvr_logo.webp';

import CAFW from '../images/sponsors/CAFW.webp';
import CAFWlogo from '../images/sponsors/CAFWlogo.webp';
import VectorControl from '../images/sponsors/Vector Control.webp';
import CLSC from '../images/sponsors/CLSC.png';

import ELEM from '../images/sponsors/Elem.webp';
import WMWlogo from '../images/sponsors/WorldMark_by_Wyndham_logo.webp';
import USGS from '../images/sponsors/USGS-01.webp';
import RivieraWest from '../images/sponsors/rivieraWest.png';

import './Footer.css'
import '../App.css'

export default class Footer extends Component {
  render() {
    return (
      <div className="footerContainer">
            <div className="title-footer">
                <p className="main-title">Clear Lake</p>
                <p className="sub-title">Tahoe Environmental Research Center </p>
                <div className="funding-container">
                  <p>Funding Provided by</p>
                  <img src={CAFWlogo} alt="California Department of Fish and Wildlife logo" />
                  <img src={CAFW} alt="California Department of Fish and Wildlife" />
                </div>
                <div className="funding-container">
                  <p>In Collaboration With</p>
                  <div className='image-row'>
                    <img src={CLO} alt="Clearlake Oaks County Water District" />
                    <img src={BVR} alt="Big valley Rancheria" />
                    <img src={ELEM} alt="Elem Indian Colony" />
                    <img src={CLSC} alt="Count of Lake State of California" />
                    <img src={VectorControl} alt="Lake County Vector Control District" />
                  </div>
                  <div className='image-row'>
                    
                    <img src={WMWlogo} alt="Worldmark" />
                    <img src={USGS} alt="USGS" />
                    <img src={RivieraWest} alt="Riviera West" />
                  </div> 
                </div>
            </div>
      </div>
    )
  }
}