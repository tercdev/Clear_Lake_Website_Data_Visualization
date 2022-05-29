import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/TERC_wave.png';
import './Title.css'

/**
 * Component for showing the logo, title, and subtitle.
 * @returns {JSX.Element}
 */
export default function Title() {
    return (
        <div className="titleContainer">
            <Link to='/' className='logoImage' >
                <img src={logo} alt="Logo" />
            </Link>
            <div className="title">
                <p className="main-title">Clear Lake Data</p>
                <p className="sub-title">Tahoe Environmental Research Center </p>
            </div>
        </div>
    )
}