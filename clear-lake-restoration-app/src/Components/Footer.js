import React from 'react';

import CLO from '../images/sponsors/CLO.webp';
import BVR from '../images/sponsors/bvr_logo.webp';

import VectorControl from '../images/sponsors/Vector Control.webp';
import CLSC from '../images/sponsors/CLSC.png';

import ELEM from '../images/sponsors/Elem.webp';
import WMWlogo from '../images/sponsors/WorldMark_by_Wyndham_logo.webp';
import USGS from '../images/sponsors/USGS-01.webp';
import RivieraWest from '../images/sponsors/rivieraWest.png';

import sponsor1 from '../images/sponsors/sponsor1.png';
import SFEI from '../images/sponsors/SFEI.png';
import NASA from '../images/sponsors/NASA.png';
import WaterBoards from '../images/sponsors/waterBoards.png';
import EPA_logo from '../images/sponsors/EPA-logo.png';

import CNRA from '../images/sponsors/CNRA-Logo_xA0_Image.png';

import './Footer.css'
import '../App.css'

/**
 * Component for showing the footer with logos.
 * @returns {JSX.Element}
 */
export default function Footer() {
    return (
        <div className="footerContainer">
            <div className="title-footer">
                <p className="main-title">Clear Lake Data</p>
                <p className="sub-title">Tahoe Environmental Research Center </p>
                <div className="funding-container">
                    <p>Funding Provided by</p>
                    <img src={CNRA} alt="California Natural Resources Agency" />
                </div>
                <div className="funding-container">
                    <p>In Collaboration With</p>
                    <p>(in progress)</p>
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
                    <div className='image-row'>
                        <img src={EPA_logo} alt="Environmental Protection Agency" />
                        <img src={sponsor1} />
                        <img src={SFEI} alt="SFEI" />
                        <img src={NASA} alt="NASA" />
                        <img src={WaterBoards} alt="California Water Boards" />
                    </div> 
                </div>
            </div>
        </div>
    )
}