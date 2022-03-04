import React, { Component } from 'react';
import logo from '../images/TERC_wave.png';
import './TitleComponent.css'
import '../App.css'

export default class TitleComponent extends Component {
  render() {
    return (
      <div className="titleContainer">
            <a href="#home" className="logoImage">
                <img src={logo} alt="Logo" />
            </a>
            <div className="title">
                <p className="main-title">Clear Lake</p>
                <p className="sub-title">Tahoe Environmental Research Center </p>
            </div>
      </div>
    )
  }
}