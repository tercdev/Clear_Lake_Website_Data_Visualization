import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/TERC_wave.png';

import './Footer.css'
import '../App.css'

export default class Footer extends Component {
  render() {
    return (
      <div className="footerContainer">
            
            <div className="title-footer">
                <p className="main-title">Clear Lake</p>
                <p className="sub-title">Tahoe Environmental Research Center </p>
            </div>
      </div>
    )
  }
}