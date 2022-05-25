import React, { useState } from 'react';
import {Navbar, Nav, Container, NavDropdown, Button, Modal} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';

const Navigation = () => {
  const [showStream, setShowStream] = useState(false);
  const [showMet, setShowMet] = useState(false);
  const [showLake, setShowLake] = useState(false);
  const [showLakeCTD, setShowLakeCTD] = useState(false);
  const showStreamDropdown = (e)=>{
      setShowStream(!showStream);
  }
  const hideStreamDropdown = e => {
      setShowStream(false);
  }

  const showMetDropdown = (e)=>{
    setShowMet(!showMet);
  }
  const hideMetDropdown = e => {
    setShowMet(false);
  }

  const showLakeDropdown = (e)=>{
    setShowLake(!showLake);
  }
  const hideLakeDropdown = e => {
    setShowLake(false);
  }

  const showLakeCTDDropdown = (e)=>{
    setShowLakeCTD(!showLakeCTD);
  }
  const hideLakeCTDDropdown = e => {
    setShowLakeCTD(false);
  }
  return (
    <>
    <Navbar collapseOnSelect expand='sm' variant='dark'>
      <Container className="wrapper">
        <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav>
            <Nav.Link href='/Clear_Lake_Website_Data_Visualization/'>Home</Nav.Link>
            <NavDropdown title="Stream" id="collasible-nav-dropdown" show={showStream} onMouseEnter={showStreamDropdown} onMouseLeave={hideStreamDropdown}>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/stream">Overview</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/kelsey">Kelsey</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/middle">Middle</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/scotts">Scotts</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Meteorology" id="collasible-nav-dropdown" show={showMet} onMouseEnter={showMetDropdown} onMouseLeave={hideMetDropdown}>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/met">Overview</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/nic">Nice</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/nlp">North Lakeport</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/bvr">Big Valley Rancheria</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/bkp">Buckingham Point</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/knb">Konocti Bay</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/clo">Clearlake Oaks</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/bek">Beakbane Island</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Lake Mooring" id="collasible-nav-dropdown" show={showLake} onMouseEnter={showLakeDropdown} onMouseLeave={hideLakeDropdown}>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/lakemooring">Overview</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/la03">LA-03</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/nr02">NR-02</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/oa04">OA-04</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua01">UA-01</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua06">UA-06</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua07">UA-07</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua08">UA-08</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Lake Profile" id="collasible-nav-dropdown" show={showLakeCTD} onMouseEnter={showLakeCTDDropdown} onMouseLeave={hideLakeCTDDropdown}>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/lakeCTD">Overview</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua01-profile">UA-01 Profile</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua06-profile">UA-06 Profile</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua07-profile">UA-07 Profile</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua08-profile">UA-08 Profile</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/la03-profile">LA-03 Profile</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/nr02-profile">NR-02 Profile</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/oa04-profile">OA-04 Profile</NavDropdown.Item>
            </NavDropdown>            
            <Nav.Link href='https://tahoe.ucdavis.edu/clear-lake-wind-maps'>Wind Animations</Nav.Link>
            <Nav.Link href='/Clear_Lake_Website_Data_Visualization/data-archive'>Data Archive</Nav.Link>
            <Nav.Link href='https://clearlakerestoration.sf.ucdavis.edu/'>Main Clear Lake Site</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}

export default Navigation;