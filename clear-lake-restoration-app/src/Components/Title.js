import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/TERC_wave.png';
import './Title.css'
import '../App.css'
import Weather from './Weather.js'

export default class TitleComponent extends Component {
  render() {
    return (
      <div className="titleContainer">
            <Link to='/' className='logoImage' >
              <img src={logo} alt="Logo" />
             </Link>
            <div className="title">
                <p className="main-title">Clear Lake</p>
                <p className="sub-title">Tahoe Environmental Research Center </p>
            </div>
            {/* <Weather/> */}
      </div>
    )
  }
}